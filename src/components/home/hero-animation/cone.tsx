"use client";
import React, { useRef, useEffect, useState } from "react";

// Vertex shader (shared)
const vertexShaderSrc = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

attribute vec2 aPosition;
varying vec2 vUv;

void main() {
    vUv = 0.5 * aPosition + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Fragment shader for composition (stars, logo, trail)
const compositionFragmentShader = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform float uLogoScale;
uniform vec2 uOffset;
uniform sampler2D uNoiseTexture;
uniform sampler2D uLogoTexture;
uniform sampler2D uTrailTexture;

// Star brightness
#define STAR 5.0
// Flare brightness
#define FLARE 4.0
// Star color
#define COLOR vec3(0.2, 0.3, 0.8)

// Star turbulence parameters
#define STAR_NUM 12.0
#define STAR_AMP 0.5
#define STAR_SPEED 0.01
#define STAR_VEL vec2(-1.0, 0.0)  // Reversed for left to right flow
#define STAR_FREQ 8.0
#define STAR_EXP 1.5

// Logo size (relative to screen-y)
// Set in both shaders!
#define LOGO_SCALE 0.5
// Aspect ratio (w / h)
#define LOGO_RATIO 2.08

// Glow strength
#define GLOW_STRENGTH 12.0
// Glow colors
#define GLOW_RED vec3(0.5, 0.2, 0.2)
#define GLOW_BLUE vec3(0.3, 0.3, 0.6)
// Glow turbulence strength
#define GLOW_TURBULENCE 0.4
// Glow chromatic aberration
#define GLOW_TINT 3.0

// Light vertical falloff exponent (higher = narrower)
#define LIGHT_EXP 30.0

// Trail RGB falloff exponents (higher = darker)
#define TRAIL_EXP vec3(1.4, 1.2, 1.0)
// Trail strength (0.0 = no trail, 1.0 = full strength)
#define TRAIL_STRENGTH 0.4

// Dither intensity
#define DITHER 0.01
// Dither texture resolution
#define DITHER_RES 64.0

// Gamma encoding (with Gamma = 2.0)
vec3 gamma_encode(vec3 lrgb) {
    return sqrt(lrgb);
}

// Turbulence waves
vec2 turbulence(vec2 p, float freq, float num) {
    mat2 rot = mat2(0.6, -0.8, 0.8, 0.6);
    vec2 turb = vec2(0.0);
    for (float i = 0.0; i < STAR_NUM; i++) {
        if (i >= num) break;

        vec2 pos = p + turb + STAR_SPEED * i * uTime * STAR_VEL;
        float phase = freq * (pos * rot).y + STAR_SPEED * uTime * freq;
        turb += rot[0] * sin(phase) / freq;
        rot *= mat2(0.6, -0.8, 0.8, 0.6);
        freq *= STAR_EXP;
    }
    return turb;
}

// Star background
vec3 star(inout vec2 p) {

    // Horizontal stretching factor (1 / scale)
    #define STAR_STRETCH 0.7
    #define STAR_CURVE 0.5

    // Signed range [-1, 1]
    vec2 suv = p * 2.0 - 1.0;
    // Coordinates relative to left side (reversed for left to right)
    vec2 left = suv + vec2(1.0, 0.0);  // Changed from right to left

    // Aspect corrected
    left.x *= STAR_STRETCH * uResolution.x / uResolution.y;
    // Apply turbulence
    // Variable turbulence intensity
    float factor = 1.0 + 0.4 * sin(9.0 * suv.y) * sin(5.0 * (suv.x + 5.0 * uTime * STAR_SPEED));
    vec2 turb = left + factor * STAR_AMP * turbulence(left, STAR_FREQ, STAR_NUM);
    // Shift top and bottom edges
    turb.x += STAR_CURVE * suv.y * suv.y;  // Adjusted sign for left origin

    // Attenuate slower inside
    float fade = max(4.0 * suv.y * suv.y + suv.x - 1.2, 0.001);  // Adjusted for left
    float atten = fade * max(0.5 * turb.x, -turb.x);

    // Flare time
    float ft = 0.4 * uTime;
    // Flare position
    vec2 fp = 8.0 * (turb + 0.5 * STAR_VEL * ft);
    fp *= mat2(0.4, -0.3, 0.3, 0.4);
    // Flare
    float f = cos(fp.x) * sin(fp.y) - 0.5;
    // Flare brightness
    float flare = f * f + 0.5 * suv.y * suv.y - 1.5 * turb.x + 0.6 * cos(0.42 * ft + 1.6 * turb.y) * cos(0.31 * ft - turb.y);

    // Star brightness
    vec3 col = 0.1 * COLOR * (STAR / (atten * atten) + FLARE / (flare * flare));

    // Chroma phase shift
    const vec3 chrom = vec3(0.0, 0.1, 0.2);
    // Color rays
    col *= exp(p.x *
                cos(turb.y * 5.0 + 0.4 * (uTime + turb.x * 1.0) + chrom) *
                cos(turb.y * 7.0 - 0.5 * (uTime - turb.x * 1.5) + chrom) *
                cos(turb.y * 9.0 + 0.6 * (uTime + turb.x * 2.0) + chrom)
        );

    return col;
}

void main() {
    // Dither uv
    vec2 duv = 0.9 * gl_FragCoord.xy / DITHER_RES * mat2(0.8, -0.6, 0.6, 0.8);
    // Sample signed dithering [-0.5, +0.5]
    float dither = texture2D(uNoiseTexture, duv).r - 0.5;

    // Capped aspect ratio
    vec2 ratio = min(uResolution.yx / uResolution.xy, 1.0);
    // Sample trail texture
    vec4 trailTex = texture2D(uTrailTexture, vUv);

    // Signed screen uvs [-1, +1]
    vec2 suv = vUv * 2.0 - 1.0;

    // Compute logo scale (aspect ratio corrected)
    vec2 scale = max(uLogoScale, 1.0 - (LOGO_RATIO / 4.0)) * ratio * vec2(LOGO_RATIO, -1.0);
    // Normalized logo uvs
    vec2 logoUv = 0.5 + (vUv - 0.5) / scale;

    // Logo texture + turbulent samples
    vec4 logo = vec4(0);
    vec4 logoTurb = vec4(0);
    // Signed direction vector from logo
    vec2 dir = vec2(0);
    // Glow intensity
    float glow = 0.0;
    // UV distortions
    vec2 distort = uOffset;

    // Bounding box check
    if (logoUv.x >= 0.0 && logoUv.x <= 1.0 && logoUv.y >= 0.0 && logoUv.y <= 1.0) {
        // Sample logo
        logo = texture2D(uLogoTexture, logoUv);

        // Direction vector (flipped x for left to right)
        dir = (logo.rg - 0.6);
        dir.x = dir.x;  // Not flipped for left origin

        // Twist around logo
        vec2 shift = -2.0 * vec2(dir.y, -dir.x) * dir.y * logo.b;
        // Trail distortion (0.1 seems reasonable)
        shift += 0.1 * (1.0 - logo.b) * (trailTex.rg - 0.5) * trailTex.b * ratio;
        // Correct for ratio and shift
        vec2 logoT = (logoUv) * vec2(LOGO_RATIO, 1.0) + shift;
        // Add turbulence
        logoT += (1.0 - logo.b) * turbulence(logoT, 40.0, 6.0);
        // Convert back to normalized uvs
        logoUv = (logoT - shift) / vec2(LOGO_RATIO, 1.0);

        // Sample logo turbulence
        logoTurb = texture2D(uLogoTexture, logoUv);
        // Mix with logo alpha
        logoTurb.b = mix(logo.b, logoTurb.b, GLOW_TURBULENCE);

        // Glow
        // Horizontal fade
        float xx = logoUv.x;
        // Vertical fade
        float yy = (logoUv.y - 0.5);
        // Glow intensity
        glow = max(logoTurb.b - (xx * xx + 8.0 * yy * yy) * logoTurb.b, 0.0);

        // Distort round logo
        distort += dir * logo.b * (1.0 - logo.b);
    }

    // Star
    vec2 starUv = vUv + distort;
    // Add trail distortion
    starUv += 0.3 * (trailTex.rg - 0.5) * trailTex.b * ratio;
    // Get star color
    vec3 col = star(starUv);

    // Vertical vignette
    float vig = 1.0 - abs(suv.y);
    // Horizontal fade (adjusted for left to right)
    vig *= 0.5 + 0.5 * (1.0 - suv.x);  // Fade from left, bright left, fade right
    // Apply vignette
    col *= vig * vig;

    // Tonemap and gamma encode
    col /= 1.0 + col;
    col = clamp(col, 0.0, 1.0);
    col = gamma_encode(col);

    // Light gradient
    float yy = suv.y + 0.03;
    yy = max(1.0 - 1e1 * yy * yy / max(0.5 + 1.5 * (1.0 - starUv.x), 0.1), 0.0);  // Adjusted for left
    float light = max(0.5 + 0.5 * (1.0 - starUv.x), 0.0) * yy;  // Bright on left
    light += 2.0 * (1.0 - light) * glow;

    // Rim
    float tint = GLOW_TINT * dir.x * glow;
    vec3 hue = mix(GLOW_RED, GLOW_BLUE, 1.0 - suv.x + tint);  // Adjusted
    float alpha = 1.0 - (1.0 - pow(yy, LIGHT_EXP)) * glow;
    vec3 rim = GLOW_STRENGTH * light * light * light * light * alpha * (0.5 + 0.5 * (1.0 - suv.x)) * hue;  // Adjusted

    // Rim tone mapping
    rim /= (1.0 + rim);
    // Add rim glow
    col += (1.0 - col) * rim * rim;
    // Add trail
    col += TRAIL_STRENGTH * hue * pow(trailTex.aaa, TRAIL_EXP);
    // Logo mask
    float a = smoothstep(1.0, 0.2, logo.a);
    col.rgb = a * col.rgb + (1.0 - a);

    // Apply dithering
    col += DITHER * dither;

    gl_FragColor = vec4(col, 1.0);
}
`;

// Fragment shader for trail
const trailFragmentShader = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;
uniform float uTime;
uniform float uDeltaTime;
uniform float uLogoScale;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform vec2 uResolution;
uniform sampler2D uNoiseTexture;
uniform sampler2D uPreviousFrame;
uniform sampler2D uLogoTexture;

// Trail falloff (higher = narrower)
#define TRAIL_FALLOFF 9000.0
// Fade exponents (velocity x, velocity y, motion, alpha)
#define FADE_EXP vec4(0.02, 0.02, 0.1, 0.1)

// Base scrolling speed
#define SCROLL_SPEED 0.0005
// Turbulent distortion speed
#define DISTORT_SPEED 0.02

// Logo twirl strength
#define LOGO_TWIRL 0.4
// Logo pull strength
#define LOGO_PULL 0.1

// Logo size (relative to screen-y)
// Set in both shaders!
#define LOGO_SCALE 0.5
// Aspect ratio (w / h)
#define LOGO_RATIO 2.08

// Turbulence parameters
#define TURB_NUM 8.0
#define TURB_AMP 0.6
#define TURB_SPEED 0.5
#define TURB_VEL vec2(-0.1, 0.0)  // Reversed for left to right
#define TURB_FREQ 50.0
#define TURB_EXP 1.3

vec2 turbulence(vec2 p) {
    mat2 rot = mat2(0.6, -0.8, 0.8, 0.6);
    vec2 turb = vec2(0.0);
    float freq = TURB_FREQ;
    for (float i = 0.0; i < TURB_NUM; i++) {
        vec2 pos = p + TURB_SPEED * i * uTime * TURB_VEL;
        float phase = freq * (pos * rot).y + TURB_SPEED * uTime * freq * 0.1;
        turb += rot[0] * sin(phase) / freq;
        rot *= mat2(0.6, -0.8, 0.8, 0.6);
        freq *= TURB_EXP;
    }
    return turb;
}

void main() {
    // Capped aspect ratio
    vec2 ratio = min(uResolution.yx / uResolution.xy, 1.0);

    // Compute logo scale (aspect ratio corrected)
    vec2 scale = max(uLogoScale, 1.0 - (LOGO_RATIO / 4.0)) * ratio * vec2(LOGO_RATIO, -1.0);
    // Normalized logo uvs
    vec2 logoUV = 0.5 + (vUv - 0.5) / scale;
    // Sample logo
    vec4 logo = vec4(0);
    if (logoUV.x >= 0.0 && logoUV.x <= 1.0 && logoUV.y >= 0.0 && logoUV.y <= 1.0) {
        logo = texture2D(uLogoTexture, logoUV);
    }

    // Delta rate
    float delta = 144.0 * uDeltaTime;
    // Scroll velocity (reversed for left to right)
    vec2 scroll = -SCROLL_SPEED * vec2(1.0, vUv.y - 0.5) * ratio;  // Negative for left to right flow
    // Turbulent distortion vector
    vec2 turb = turbulence((vUv + scroll) / ratio);
    // Distortion velocity
    vec2 distort = -DISTORT_SPEED * turb;  // Adjusted sign
    // Add logo twirl and pull
    distort -= LOGO_TWIRL * (logo.rg - 0.6) * mat2(0, -1, 1, 0) * (logo.g - 0.5) * logo.b;
    distort -= LOGO_PULL * (logo.rg - 0.6) * logo.b * logo.b;
    // Distorted UVs
    vec2 distortedUv = vUv + delta * scroll + delta * distort * ratio;

    // Sample previous frame with distortion
    vec4 prev = texture2D(uPreviousFrame, distortedUv);

    // Create trail effect based on mouse velocity and position
    // Mouse trail start and end points
    vec2 trailA = vUv + 0.01 * delta * turb * ratio - uMouse;
    vec2 trailB = -uMouseVelocity;
    // Trail distance squared
    float trailD = dot(trailB, trailB);
    // Vector to nearest trail point
    vec2 trailDif = trailA / ratio;
    // Falloff
    float falloff = 0.0;
    if (trailD > 0.0) {
        // Normalized segment factor
        float f = clamp(dot(trailA, trailB) / trailD, 0.0, 1.0);
        // Trail difference to uvs
        trailDif -= f * trailB / ratio;
        // Falloff
        falloff = (1.0 - logo.b) / (1.0 + TRAIL_FALLOFF * dot(trailDif, trailDif));
        // Normalize falloff
        falloff *= min(trailD / (0.001 + trailD), 1.0);
    }

    // Compute brightness value
    vec2 suv = (uMouse - uMouseVelocity) * 2.0 - 1.0;
    // Vignette
    float vig = 1.0 - abs(suv.y);
    // Horizontal fade
    vig *= 0.5 + 0.5 * suv.x;

    // Sample noise for dithered falloff
    vec2 nuv = gl_FragCoord.xy / 64.0 + uTime * vec2(7.1, 9.1);
    float noise = texture2D(uNoiseTexture, nuv).r;

    // Falloff exponents
    vec4 fade = pow(vec4(noise), FADE_EXP);
    // Delta timed decay
    fade = exp(-2.0 * fade * uDeltaTime);
    // Mix previous frame with current trail
    vec4 decay = mix(vec4(0.5, 0.5, 0.0, 0.0), prev, fade);

    // Set output color
    vec4 col = decay;

    // Trail velocity
    vec2 vel = (-trailB) / (0.01 + length(trailB));
    // Add trail velocity (smooth blended)
    col.rg -= (0.5 - abs(decay.rg - 0.5)) * (falloff * vel);
    // Add trail falloff (smooth blended)
    col.ba += falloff * (1.0 - decay.ba) * vec2(1.0, vig * vig);

    // Stochastic dithering
    col += (noise - 0.5) / 255.0;
    gl_FragColor = col;
}
`;

const AnimationComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl2") ||
      (canvas.getContext("webgl") as WebGLRenderingContext);
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    // Arrays for cleanup
    const buffers: WebGLBuffer[] = [];
    const textures: WebGLTexture[] = [];
    const framebuffers: WebGLFramebuffer[] = [];
    const programs: WebGLProgram[] = [];

    // Create shader
    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    // Create program
    const createProgram = (
      vsSource: string,
      fsSource: string
    ): WebGLProgram | null => {
      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return null;

      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return null;
      }

      programs.push(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return program;
    };

    // Create framebuffer
    const createFramebuffer = (
      texture: WebGLTexture
    ): WebGLFramebuffer | null => {
      const fb = gl.createFramebuffer();
      if (!fb) return null;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      if (
        gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE
      ) {
        console.error("Framebuffer not complete");
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      framebuffers.push(fb);
      return fb;
    };

    // Create render texture
    const createRenderTexture = (scale = 1): WebGLTexture => {
      const tex = gl.createTexture();
      if (!tex) throw new Error("Failed to create texture");
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        Math.floor(canvas.width * scale),
        Math.floor(canvas.height * scale),
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      textures.push(tex);
      return tex;
    };

    // Bind quad to program
    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "aPosition");
      const quadBuffer = gl.createBuffer();
      if (!quadBuffer) throw new Error("Failed to create buffer");
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );
      buffers.push(quadBuffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    // Create programs
    const compositionProgram = createProgram(
      vertexShaderSrc,
      compositionFragmentShader
    );
    const trailProgram = createProgram(vertexShaderSrc, trailFragmentShader);

    if (!compositionProgram || !trailProgram) {
      console.error("Failed to create programs");
      return;
    }

    bindQuad(compositionProgram);
    bindQuad(trailProgram);

    // Uniform locations for composition
    const compUniforms = {
      time: gl.getUniformLocation(compositionProgram, "uTime"),
      resolution: gl.getUniformLocation(compositionProgram, "uResolution"),
      logoScale: gl.getUniformLocation(compositionProgram, "uLogoScale"),
      offset: gl.getUniformLocation(compositionProgram, "uOffset"),
      noiseTexture: gl.getUniformLocation(compositionProgram, "uNoiseTexture"),
      logoTexture: gl.getUniformLocation(compositionProgram, "uLogoTexture"),
      trailTexture: gl.getUniformLocation(compositionProgram, "uTrailTexture"),
    };

    // Uniform locations for trail
    const trailUniforms = {
      time: gl.getUniformLocation(trailProgram, "uTime"),
      deltaTime: gl.getUniformLocation(trailProgram, "uDeltaTime"),
      resolution: gl.getUniformLocation(trailProgram, "uResolution"),
      logoScale: gl.getUniformLocation(trailProgram, "uLogoScale"),
      mouse: gl.getUniformLocation(trailProgram, "uMouse"),
      mouseVelocity: gl.getUniformLocation(trailProgram, "uMouseVelocity"),
      noiseTexture: gl.getUniformLocation(trailProgram, "uNoiseTexture"),
      previousFrame: gl.getUniformLocation(trailProgram, "uPreviousFrame"),
      logoTexture: gl.getUniformLocation(trailProgram, "uLogoTexture"),
    };

    // Ping-pong render textures
    const renderTextures = [createRenderTexture(), createRenderTexture()];
    const fbs = [
      createFramebuffer(renderTextures[0]),
      createFramebuffer(renderTextures[1]),
    ];
    let currentPingPong = 0;

    // Load texture async
    const loadTexture = (
      src: string,
      repeat = false
    ): Promise<WebGLTexture> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const tex = gl.createTexture();
        if (!tex) return reject("Failed to create texture");
        textures.push(tex);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          1,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array([128, 128, 128, 255])
        );

        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_TEXTURE_SIZE || height > MAX_TEXTURE_SIZE) {
            const scale = Math.min(
              MAX_TEXTURE_SIZE / width,
              MAX_TEXTURE_SIZE / height
            );
            width = Math.floor(width * scale);
            height = Math.floor(height * scale);
            const canvasResize = document.createElement("canvas");
            canvasResize.width = width;
            canvasResize.height = height;
            const ctx = canvasResize.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, width, height);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              canvasResize
            );
          } else {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              img
            );
          }
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_S,
            repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
          );
          gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_T,
            repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
          );
          resolve(tex);
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    // Choose logo based on width (adjust paths as needed)
    const chooseLogo = () => {
      const width = canvas.clientWidth;
      if (width >= 900) return "/logo.png"; // Place your full logo in public
      if (width >= 450) return "/logoHalf.png";
      return "/logoQuat.png";
    };

    const logoPath = chooseLogo();

    // Load textures
    Promise.all([
      loadTexture("/images/download.png", true), // Your noise image in public
      loadTexture(logoPath, false),
    ])
      .then(([noiseTex, logoTex]) => {
        // Resize function
        const updateSize = () => {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);

          // Clear render textures
          renderTextures.forEach((tex) => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              canvas.width,
              canvas.height,
              0,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              null
            );
          });

          // Compute logo scale (simplified, adjust for your SVG if needed)
          const logoScale = 0.5;
          const offsetX = 0.3; // Adjust for centering

          gl.useProgram(compositionProgram);
          gl.uniform2f(compUniforms.resolution, canvas.width, canvas.height);
          gl.uniform1f(compUniforms.logoScale, logoScale);
          gl.uniform2f(compUniforms.offset, offsetX, 0);

          gl.useProgram(trailProgram);
          gl.uniform2f(trailUniforms.resolution, canvas.width, canvas.height);
          gl.uniform1f(trailUniforms.logoScale, logoScale);
        };
        updateSize();

        // Mouse state
        let mousePos = [0.5, 0.5];
        let prevMousePos = [0.5, 0.5];
        const onMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          mousePos = [
            (e.clientX - rect.left) / canvas.clientWidth,
            1 - (e.clientY - rect.top) / canvas.clientHeight,
          ];
        };
        window.addEventListener("mousemove", onMouseMove);

        // Animation
        let lastTime = 0;
        let frameCount = 0;
        let fpsTime = 0;
        let scale = 1.0;
        // const prevDelta = 0;

        const animate = (time: number) => {
          const deltaTime = Math.min((time - lastTime) * 0.001, 0.05);
          lastTime = time;
          frameCount++;

          if (time - fpsTime >= 1000) {
            const fps = (1000 * frameCount) / (time - fpsTime);
            fpsTime = time;
            frameCount = 0;
            // Adjust scale based on FPS (optional)
            if (fps < 30 && scale > 0.5) {
              scale = Math.max(0.5, scale - 0.1);
              updateSize();
            } else if (fps > 55 && scale < 1) {
              scale = Math.min(1, scale + 0.1);
              updateSize();
            }
          }

          const mouseVel = [
            mousePos[0] - prevMousePos[0],
            mousePos[1] - prevMousePos[1],
          ];
          prevMousePos = [...mousePos];

          // Trail pass
          const nextPingPong = 1 - currentPingPong;
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[nextPingPong]);
          gl.useProgram(trailProgram);
          gl.uniform1f(trailUniforms.time, time * 0.001);
          gl.uniform1f(trailUniforms.deltaTime, deltaTime);
          gl.uniform2f(trailUniforms.mouse, mousePos[0], mousePos[1]);
          gl.uniform2f(trailUniforms.mouseVelocity, mouseVel[0], mouseVel[1]);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, noiseTex);
          gl.uniform1i(trailUniforms.noiseTexture, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, renderTextures[currentPingPong]);
          gl.uniform1i(trailUniforms.previousFrame, 1);

          gl.activeTexture(gl.TEXTURE2);
          gl.bindTexture(gl.TEXTURE_2D, logoTex);
          gl.uniform1i(trailUniforms.logoTexture, 2);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          // Composition pass
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.useProgram(compositionProgram);
          gl.uniform1f(compUniforms.time, time * 0.001);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, noiseTex);
          gl.uniform1i(compUniforms.noiseTexture, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, logoTex);
          gl.uniform1i(compUniforms.logoTexture, 1);

          gl.activeTexture(gl.TEXTURE2);
          gl.bindTexture(gl.TEXTURE_2D, renderTextures[nextPingPong]);
          gl.uniform1i(compUniforms.trailTexture, 2);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          currentPingPong = nextPingPong;

          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        setIsLoaded(true);

        // Cleanup
        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("resize", resizeCanvas);
          buffers.forEach((b) => gl.deleteBuffer(b));
          textures.forEach((t) => gl.deleteTexture(t));
          framebuffers.forEach((f) => gl.deleteFramebuffer(f));
          programs.forEach((p) => gl.deleteProgram(p));
        };
      })
      .catch((err) => {
        console.error("Failed to load textures", err);
      });

    return () => {
      // Cleanup on unmount
    };
  }, [isLoaded]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 1s" }}
      />
      {/* Optional: Add your text or logo overlay if needed */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-5xl md:text-8xl font-bold text-white/80 mix-blend-screen text-center select-none tracking-wider">
          Energy Flow
        </h1>
      </div>
    </div>
  );
};

export default function ConeGlow() {
  return <AnimationComponent />;
}

// bad using the attached image as noise texture

// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import * as THREE from "three";

// // --- Types ---
// interface ShaderProps {
//   hue: number;
//   speed: number;
//   intensity: number;
//   complexity: number;
//   warp: number;
// }

// interface ThreeRef {
//   renderer: THREE.WebGLRenderer;
//   scene: THREE.Scene;
//   camera: THREE.OrthographicCamera;
//   material: THREE.ShaderMaterial;
// }

// // --- Custom Hook for Shader Animation ---
// const useShaderAnimation = (
//   mountRef: React.RefObject<HTMLDivElement | null>,
//   shaderProps: ShaderProps
// ) => {
//   const threeRef = useRef<ThreeRef | null>(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     // --- Three.js Core Setup ---
//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(mount.clientWidth, mount.clientHeight);
//     mount.appendChild(renderer.domElement);

//     // Load noise texture (place your attached image as 'noise.png' in the public folder)
//     const loader = new THREE.TextureLoader();
//     const noiseTexture = loader.load(
//       "/images/download.png",
//       undefined,
//       undefined,
//       (err) => {
//         console.error("Error loading noise texture", err);
//       }
//     );
//     noiseTexture.wrapS = THREE.RepeatWrapping;
//     noiseTexture.wrapT = THREE.RepeatWrapping;
//     noiseTexture.minFilter = THREE.LinearFilter;
//     // noiseTexture.magFilter = THREE.LinearFilter; // Smooth for now; change to NearestFilter for sharper pixels if desired
//     noiseTexture.magFilter = THREE.NearestFilter; // Smooth for now; change to NearestFilter for sharper pixels if desired

//     // --- Shader Material Setup ---
//     const uniforms = {
//       u_time: { value: 0.0 },
//       u_resolution: {
//         value: new THREE.Vector2(mount.clientWidth, mount.clientHeight),
//       },
//       u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
//       u_hue: { value: shaderProps.hue },
//       u_speed: { value: shaderProps.speed },
//       u_intensity: { value: shaderProps.intensity },
//       u_complexity: { value: shaderProps.complexity },
//       u_warp: { value: shaderProps.warp },
//       u_noiseTexture: { value: noiseTexture },
//     };

//     const vertexShader = `
//       void main() {
//         gl_Position = vec4(position, 1.0);
//       }
//     `;

//     const fragmentShader = `
//       precision highp float;
//       uniform vec2 u_resolution;
//       uniform float u_time;
//       uniform vec2 u_mouse;
//       uniform float u_hue;
//       uniform float u_speed;
//       uniform float u_intensity;
//       uniform float u_complexity;
//       uniform float u_warp;
//       uniform sampler2D u_noiseTexture;

//       #define PI 3.1415926535

//       vec3 hsv2rgb(vec3 c) {
//         vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//         vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//         return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
//       }

//       // Updated noise using the provided texture for crisp, detailed noise
//       float noise(vec2 st) {
//         // Sample the noise texture directly for crispness; scale st for frequency control
//         // Adjust the multiplier (e.g., 5.0) to control how "crisp" or scaled the noise appears
//         return texture2D(u_noiseTexture, st * 5.0).r;
//       }

//       float fbm(vec2 st) {
//         float value = 0.0;
//         float amplitude = 0.5;
//         for (int i = 0; i < 10; i++) {
//           if (i >= int(u_complexity)) break;
//           value += amplitude * noise(st);
//           st *= 2.0;
//           amplitude *= 0.5;
//         }
//         return value;
//       }

//       mat2 rotate(float angle) {
//         return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
//       }

//       // Wispy energy wind flowing from right to left, matching image style
//       // Increased scales for crisper, finer details using texture noise
//       float energyWind(vec2 uv, float time) {
//         float aspect = u_resolution.x / u_resolution.y;

//         // Soft source at right edge, no bright white spot - subtle violet-pink origin
//         vec2 source = vec2(aspect * 1.02, 0.0);
//         float sourceDist = length(uv - source);
//         float sourceGlow = smoothstep(1.5, 0.0, sourceDist * 1.5) * 0.6; // Soft, dim glow
//         sourceGlow *= (0.8 + 0.2 * sin(uv.y * 4.0 + time * 0.5)); // Slight vertical variation

//         // Horizontal flow offset for right-to-left wind motion
//         float flowTime = time * u_speed * 1.5;
//         vec2 windUv = uv + vec2(-flowTime * 2.0, sin(flowTime * 0.3 + uv.y * 3.0) * 0.08); // Gentle waves

//         // Layered noise with higher base frequency for crisper wisps
//         vec2 stretchUv = windUv * vec2(1.5, 4.5); // Increased for finer, crisper streams
//         float wind1 = fbm(stretchUv * 1.5 + vec2(flowTime * 0.4, 0.0)) * 0.7; // Higher scale
//         float wind2 = fbm(stretchUv * 2.5 + vec2(flowTime * 0.6 + 30.0, time * 0.2)) * 0.5;
//         float wind3 = fbm(stretchUv * 4.0 + vec2(flowTime * 0.8 + 60.0, -time * 0.1)) * 0.3;
//         float wind = (wind1 + wind2 + wind3) * 0.8;

//         // Add subtle turbulence for alive, cosmic feel without harshness
//         vec2 turbUv = windUv * 3.0 + vec2(-flowTime * 1.2, sin(time * 0.4 + uv.x * 1.5) * 0.05); // Higher freq
//         float turbulence = fbm(turbUv) * 0.4;
//         wind += turbulence * (0.5 + 0.5 * sin(uv.y * PI * 6.0 + time * 0.7)); // Patterned streams

//         // Gradual fade from right to left, natural into darkness
//         float rightToLeftFade = smoothstep(-aspect * 0.1, aspect * 0.9, uv.x);
//         wind *= rightToLeftFade * 0.9;

//         // Vertical soft fade, not full height
//         float vertSoft = 1.0 - (abs(uv.y) * 0.6 + smoothstep(0.4, 0.8, abs(uv.y)));
//         wind *= vertSoft;

//         // Combine soft source with wind, no hotspots
//         float energy = sourceGlow * 0.5 + wind * sourceGlow * 1.2;

//         // Clamp softly
//         return clamp(energy, 0.0, 1.2);
//       }

//       void main() {
//         vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//         float t = u_time;
//         float aspect = u_resolution.x / u_resolution.y;

//         // Minimal mouse warp
//         vec2 mouseUv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//         float warpEffect = smoothstep(0.8, 0.0, distance(uv, mouseUv)) * u_warp * 0.05;

//         // Compute wind energy
//         vec2 distortedUv = uv + vec2(warpEffect * 0.1, 0.0);
//         float energy = energyWind(distortedUv, t * u_speed);

//         // Shimmering overlay for dynamic, flowing life with crisper noise
//         vec2 shimmerUv = uv * rotate(t * u_speed * 0.01) + vec2(t * u_speed * 0.2, 0.0);
//         shimmerUv.y += sin(t * 0.6 + uv.x * 2.0) * 0.03; // Subtle distortion
//         float s1 = fbm(shimmerUv * 5.0 + vec2(t * 1.0, t * 0.5)); // Higher frequency for crisp
//         float s2 = fbm(shimmerUv * 10.0 + s1 * 0.3 + vec2(-t * 0.7, t * 0.8)); // Even higher
//         float shimmer = s1 * 0.7 + s2 * 0.3;

//         // Colors: violet-pink blend, soft like image, no white overbright
//         float baseHue = u_hue / 360.0; // 285/360 ≈ 0.79 violet-magenta
//         float hueVar = (shimmer * 0.06 - 0.03) + (energy * 0.05); // Subtle pink-violet shift
//         float saturation = 0.7 + shimmer * 0.15 + energy * 0.1; // Vibrant but soft
//         float value = energy * u_intensity * 0.8 + pow(shimmer, 1.5) * 0.3; // Dimmer, no harsh peaks

//         vec3 color = hsv2rgb(vec3(baseHue + hueVar, saturation, value));

//         // Soft glow layer, blueish tint for image match
//         float softGlow = pow(energy, 1.8) * 0.4;
//         vec3 glowTint = hsv2rgb(vec3(baseHue - 0.05, 0.5, 0.6)); // Slightly more blue-violet
//         color += glowTint * softGlow;

//         // Strong left fade to darkness, anchored right
//         float leftDarken = smoothstep(-aspect * 1.0, 0.1, uv.x);
//         color *= leftDarken * 0.95;

//         // Ensure no spillover to left
//         float strictMask = smoothstep(-aspect * 0.4, aspect * 0.3, uv.x);
//         color *= strictMask;

//         // Gentle vignette
//         float vig = 1.0 - length(uv * vec2(aspect, 1.0)) * 0.2;
//         color *= vig;

//         gl_FragColor = vec4(color, 1.0);
//       }
//     `;

//     const geometry = new THREE.PlaneGeometry(2, 2);
//     const material = new THREE.ShaderMaterial({
//       uniforms,
//       vertexShader,
//       fragmentShader,
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     threeRef.current = { renderer, scene, camera, material };

//     // --- Animation & Event Listeners ---
//     const clock = new THREE.Clock();
//     let animationFrameId: number;
//     const animate = () => {
//       uniforms.u_time.value = clock.getElapsedTime();
//       renderer.render(scene, camera);
//       animationFrameId = requestAnimationFrame(animate);
//     };
//     animate();

//     const handleResize = () => {
//       if (!mountRef.current) return;
//       const { clientWidth, clientHeight } = mountRef.current;
//       renderer.setSize(clientWidth, clientHeight);
//       uniforms.u_resolution.value.set(clientWidth, clientHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     const handleMouseMove = (e: MouseEvent) => {
//       uniforms.u_mouse.value.x = e.clientX;
//       uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // --- Cleanup ---
//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("mousemove", handleMouseMove);
//       mount.removeChild(renderer.domElement);
//       geometry.dispose();
//       material.dispose();
//       renderer.dispose();
//       noiseTexture.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     if (threeRef.current) {
//       const { material } = threeRef.current;
//       material.uniforms.u_hue.value = shaderProps.hue;
//       material.uniforms.u_speed.value = shaderProps.speed;
//       material.uniforms.u_intensity.value = shaderProps.intensity;
//       material.uniforms.u_complexity.value = shaderProps.complexity;
//       material.uniforms.u_warp.value = shaderProps.warp;
//     }
//   }, [shaderProps]);
// };

// // --- React Components ---
// interface ShaderCanvasProps extends ShaderProps {}

// export const ShaderCanvas: React.FC<ShaderCanvasProps> = (props) => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   useShaderAnimation(mountRef, props);
//   return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
// };

// interface ControlSliderProps {
//   label: string;
//   value: number;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   min: string;
//   max: string;
//   step: string;
// }

// export const ControlSlider: React.FC<ControlSliderProps> = ({
//   label,
//   value,
//   onChange,
//   min,
//   max,
//   step,
// }) => (
//   <div className="flex flex-col text-white/90">
//     <div className="flex justify-between items-center mb-2">
//       <label className="text-sm font-medium tracking-wide">{label}</label>
//       <span className="text-xs bg-white/10 px-2 py-1 rounded-full font-mono">
//         {Number(value).toFixed(2)}
//       </span>
//     </div>
//     <input
//       type="range"
//       min={min}
//       max={max}
//       step={step}
//       value={value}
//       onChange={onChange}
//       className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-violet-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
//     />
//   </div>
// );

// export default function ConeGlow() {
//   const [hue, setHue] = useState<number>(285); // Violet-pink for streams
//   const [speed, setSpeed] = useState<number>(0.2); // Slower, fluid wind
//   const [intensity, setIntensity] = useState<number>(0.8); // Lower for soft glow, no bright spots
//   const [complexity, setComplexity] = useState<number>(4.0); // Fewer layers for wispy
//   const [warp, setWarp] = useState<number>(0.1); // Minimal warp

//   return (
//     <div className="relative w-screen h-screen bg-black font-sans overflow-hidden">
//       <ShaderCanvas
//         hue={hue}
//         speed={speed}
//         intensity={intensity}
//         complexity={complexity}
//         warp={warp}
//       />

//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <h1 className="text-5xl md:text-8xl font-bold text-white/80 mix-blend-screen text-center select-none tracking-wider">
//           Energy Flow
//         </h1>
//       </div>

//       <div className="absolute bottom-4 left-4 w-72 p-4">
//         <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-4 border border-white/10">
//           <ControlSlider
//             label="Hue"
//             value={hue}
//             onChange={(e) => setHue(parseFloat(e.target.value))}
//             min="0"
//             max="360"
//             step="1"
//           />
//           <ControlSlider
//             label="Speed"
//             value={speed}
//             onChange={(e) => setSpeed(parseFloat(e.target.value))}
//             min="0.0"
//             max="1.0"
//             step="0.01"
//           />
//           <ControlSlider
//             label="Intensity"
//             value={intensity}
//             onChange={(e) => setIntensity(parseFloat(e.target.value))}
//             min="0.1"
//             max="3.0"
//             step="0.01"
//           />
//           <ControlSlider
//             label="Complexity"
//             value={complexity}
//             onChange={(e) => setComplexity(parseFloat(e.target.value))}
//             min="1.0"
//             max="8.0"
//             step="0.1"
//           />
//           <ControlSlider
//             label="Warp"
//             value={warp}
//             onChange={(e) => setWarp(parseFloat(e.target.value))}
//             min="0.0"
//             max="1.0"
//             step="0.01"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import * as THREE from "three";

// // --- Types ---
// interface ShaderProps {
//   hue: number;
//   speed: number;
//   intensity: number;
//   complexity: number;
//   warp: number;
// }

// interface ThreeRef {
//   renderer: THREE.WebGLRenderer;
//   scene: THREE.Scene;
//   camera: THREE.OrthographicCamera;
//   material: THREE.ShaderMaterial;
// }

// // --- Custom Hook for Shader Animation ---
// const useShaderAnimation = (
//   mountRef: React.RefObject<HTMLDivElement | null>,
//   shaderProps: ShaderProps
// ) => {
//   const threeRef = useRef<ThreeRef | null>(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     // --- Three.js Core Setup ---
//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(mount.clientWidth, mount.clientHeight);
//     mount.appendChild(renderer.domElement);

//     // --- Shader Material Setup ---
//     const uniforms = {
//       u_time: { value: 0.0 },
//       u_resolution: {
//         value: new THREE.Vector2(mount.clientWidth, mount.clientHeight),
//       },
//       u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
//       u_hue: { value: shaderProps.hue },
//       u_speed: { value: shaderProps.speed },
//       u_intensity: { value: shaderProps.intensity },
//       u_complexity: { value: shaderProps.complexity },
//       u_warp: { value: shaderProps.warp },
//     };

//     const vertexShader = `
//       void main() {
//         gl_Position = vec4(position, 1.0);
//       }
//     `;

//     const fragmentShader = `
//       precision highp float;
//       uniform vec2 u_resolution;
//       uniform float u_time;
//       uniform vec2 u_mouse;
//       uniform float u_hue;
//       uniform float u_speed;
//       uniform float u_intensity;
//       uniform float u_complexity;
//       uniform float u_warp;

//       vec3 hsv2rgb(vec3 c) {
//         vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//         vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//         return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
//       }

//       float random(vec2 st) {
//         return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
//       }

//       float noise(vec2 st) {
//         vec2 i = floor(st);
//         vec2 f = fract(st);
//         vec2 u = f * f * (3.0 - 2.0 * f);
//         return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
//                    mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
//       }

//       float fbm(vec2 st) {
//         float value = 0.0;
//         float amplitude = 0.5;
//         for (int i = 0; i < 10; i++) {
//           if (i >= int(u_complexity)) break;
//           value += amplitude * noise(st);
//           st *= 2.0;
//           amplitude *= 0.5;
//         }
//         return value;
//       }

//       mat2 rotate(float angle) {
//         return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
//       }

//       // Grok-style energy flow from right to left
//       float energyFlow(vec2 uv, float time) {
//         // Create energy source on the right side
//         vec2 energySource = vec2(1.4, 0.0); // Off-screen right

//         // Distance from energy source
//         float dist = distance(uv, energySource);

//         // Create flowing effect from right to left
//         vec2 flowDir = normalize(vec2(-1.0, sin(uv.y * 2.0 + time) * 0.3)); // Flow left with wave
//         vec2 flowPos = uv + flowDir * time * u_speed * 2.0;

//         // Multiple layers of noise for complex flow
//         float flow1 = fbm(flowPos * 1.5 + time * 0.5);
//         float flow2 = fbm(flowPos * 2.8 + time * 0.3 + vec2(100.0));
//         float flow3 = fbm(flowPos * 4.2 + time * 0.7 + vec2(200.0));

//         float combinedFlow = flow1 * 0.5 + flow2 * 0.3 + flow3 * 0.2;

//         // Create bright source area on the right
//         float sourceGlow = 1.0 - smoothstep(0.0, 2.5, dist);
//         sourceGlow = pow(sourceGlow, 0.8);

//         // Create streaming effect flowing left
//         float streamMask = 1.0 - smoothstep(0.0, 0.6, abs(uv.y)); // Horizontal stream
//         float horizontalFalloff = smoothstep(1.5, -1.0, uv.x); // Fades as it goes left

//         // Turbulent flow pattern
//         float turbulence = fbm(uv * 3.0 + vec2(-time * 2.0, time * 0.5));
//         streamMask *= (0.7 + turbulence * 0.5);

//         // Combine source glow with flowing stream
//         float energy = sourceGlow + (combinedFlow * streamMask * horizontalFalloff * 0.8);

//         // Add bright hotspots
//         float hotspot1 = 1.0 - smoothstep(0.0, 0.4, distance(uv, vec2(0.8, sin(time * 1.5) * 0.2)));
//         float hotspot2 = 1.0 - smoothstep(0.0, 0.3, distance(uv, vec2(0.4, sin(time * 2.0 + 1.0) * 0.15)));

//         energy += hotspot1 * 0.6 + hotspot2 * 0.4;

//         return clamp(energy, 0.0, 1.0);
//       }

//       void main() {
//         vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//         float t = u_time * u_speed;

//         // Mouse interaction
//         vec2 mouse_uv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//         float warp_effect = smoothstep(0.7, 0.0, distance(uv, mouse_uv)) * u_warp;

//         // Get energy flow
//         float energy = energyFlow(uv + warp_effect * 0.5, t);

//         // Enhanced noise for more detail
//         vec2 p = uv * rotate(t * 0.05) + warp_effect;
//         p += energy * 0.3; // Flow affects noise sampling

//         float n1 = fbm(p * 1.8 + vec2(t * 0.8, t * 0.4));
//         float n2 = fbm(p * 3.2 + n1 * 0.5 + vec2(-t * 0.6, t * 0.9));
//         float n3 = fbm(p * 5.5 + n2 * 0.3 + vec2(t * 0.4, -t * 0.7));

//         float final_noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

//         // Color calculation with energy influence
//         float hue_shift = (final_noise + energy) * 0.15;
//         float saturation = 0.4 + (final_noise + energy * 0.5) * 0.6;
//         float value = 0.1 + energy * u_intensity * 1.5;

//         // Boost brightness in high-energy areas
//         value += pow(energy, 1.5) * u_intensity * 2.0;
//         value += pow(smoothstep(0.6, 1.0, final_noise), 2.0) * energy * 0.8;

//         // Create the main color
//         vec3 color = hsv2rgb(vec3((u_hue / 360.0) + hue_shift, saturation, value));

//         // Add bright white/blue core to the energy source
//         float coreGlow = pow(energy, 3.0);
//         vec3 coreColor = mix(color, vec3(1.0, 1.0, 1.2), coreGlow * 0.8);

//         // Add subtle background glow
//         float backgroundGlow = pow(energy, 0.5) * 0.3;
//         vec3 glowColor = hsv2rgb(vec3(u_hue / 360.0, 0.3, 0.4));

//         // Final composition
//         vec3 finalColor = mix(vec3(0.0), glowColor, backgroundGlow);
//         finalColor = mix(finalColor, coreColor, smoothstep(0.0, 0.5, energy));

//         // Add atmospheric perspective (darker toward left edge)
//         float atmosphere = smoothstep(-1.2, 0.0, uv.x);
//         finalColor *= (0.2 + atmosphere * 0.8);

//         // Additional masking to ensure clean left-half constraint
//         float finalMask = smoothstep(0.05, -0.05, uv.x);
//         finalColor *= finalMask;

//         gl_FragColor = vec4(finalColor, 1.0);
//       }
//     `;

//     const geometry = new THREE.PlaneGeometry(2, 2);
//     const material = new THREE.ShaderMaterial({
//       uniforms,
//       vertexShader,
//       fragmentShader,
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     threeRef.current = { renderer, scene, camera, material };

//     // --- Animation & Event Listeners ---
//     const clock = new THREE.Clock();
//     let animationFrameId: number;
//     const animate = () => {
//       uniforms.u_time.value = clock.getElapsedTime();
//       renderer.render(scene, camera);
//       animationFrameId = requestAnimationFrame(animate);
//     };
//     animate();

//     const handleResize = () => {
//       if (!mountRef.current) return;
//       const { clientWidth, clientHeight } = mountRef.current;
//       renderer.setSize(clientWidth, clientHeight);
//       uniforms.u_resolution.value.set(clientWidth, clientHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     const handleMouseMove = (e: MouseEvent) => {
//       uniforms.u_mouse.value.x = e.clientX;
//       uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // --- Cleanup ---
//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("mousemove", handleMouseMove);
//       mount.removeChild(renderer.domElement);
//       geometry.dispose();
//       material.dispose();
//       renderer.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     if (threeRef.current) {
//       const { material } = threeRef.current;
//       material.uniforms.u_hue.value = shaderProps.hue;
//       material.uniforms.u_speed.value = shaderProps.speed;
//       material.uniforms.u_intensity.value = shaderProps.intensity;
//       material.uniforms.u_complexity.value = shaderProps.complexity;
//       material.uniforms.u_warp.value = shaderProps.warp;
//     }
//   }, [shaderProps]);
// };

// // --- React Components ---
// interface ShaderCanvasProps extends ShaderProps {}

// export const ShaderCanvas: React.FC<ShaderCanvasProps> = (props) => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   useShaderAnimation(mountRef, props);
//   return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
// };

// interface ControlSliderProps {
//   label: string;
//   value: number;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   min: string;
//   max: string;
//   step: string;
// }

// export const ControlSlider: React.FC<ControlSliderProps> = ({
//   label,
//   value,
//   onChange,
//   min,
//   max,
//   step,
// }) => (
//   <div className="flex flex-col text-white/90">
//     <div className="flex justify-between items-center mb-2">
//       <label className="text-sm font-medium tracking-wide">{label}</label>
//       <span className="text-xs bg-white/10 px-2 py-1 rounded-full font-mono">
//         {Number(value).toFixed(2)}
//       </span>
//     </div>
//     <input
//       type="range"
//       min={min}
//       max={max}
//       step={step}
//       value={value}
//       onChange={onChange}
//       className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-violet-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
//     />
//   </div>
// );

// export default function ConeGlow() {
//   const [hue, setHue] = useState<number>(210);
//   const [speed, setSpeed] = useState<number>(0.25);
//   const [intensity, setIntensity] = useState<number>(1.2);
//   const [complexity, setComplexity] = useState<number>(6.0);
//   const [warp, setWarp] = useState<number>(0.3);

//   return (
//     <div className="relative w-screen h-screen bg-black font-sans overflow-hidden">
//       <ShaderCanvas
//         hue={hue}
//         speed={speed}
//         intensity={intensity}
//         complexity={complexity}
//         warp={warp}
//       />

//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <h1 className="text-5xl md:text-8xl font-bold text-white/80 mix-blend-screen text-center select-none tracking-wider">
//           {/* Energy Flow */}
//         </h1>
//       </div>

//       {/* <div className="absolute bottom-4 left-4 w-72 p-4">
//         <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-4 border border-white/10">
//           <ControlSlider
//             label="Hue"
//             value={hue}
//             onChange={(e) => setHue(parseFloat(e.target.value))}
//             min="0"
//             max="360"
//             step="1"
//           />
//           <ControlSlider
//             label="Speed"
//             value={speed}
//             onChange={(e) => setSpeed(parseFloat(e.target.value))}
//             min="0.0"
//             max="1.0"
//             step="0.01"
//           />
//           <ControlSlider
//             label="Intensity"
//             value={intensity}
//             onChange={(e) => setIntensity(parseFloat(e.target.value))}
//             min="0.1"
//             max="3.0"
//             step="0.01"
//           />
//           <ControlSlider
//             label="Complexity"
//             value={complexity}
//             onChange={(e) => setComplexity(parseFloat(e.target.value))}
//             min="1.0"
//             max="8.0"
//             step="0.1"
//           />
//           <ControlSlider
//             label="Warp"
//             value={warp}
//             onChange={(e) => setWarp(parseFloat(e.target.value))}
//             min="0.0"
//             max="1.0"
//             step="0.01"
//           />
//         </div>
//       </div> */}
//     </div>
//   );
// }

// full circle
// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import * as THREE from "three";

// // --- Custom Hook for Shader Animation ---
// const useShaderAnimation = (mountRef: any, shaderProps: any) => {
//   const threeRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     // --- Three.js Core Setup ---
//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(mount.clientWidth, mount.clientHeight);
//     mount.appendChild(renderer.domElement);

//     // --- Shader Material Setup ---
//     const uniforms = {
//       u_time: { value: 0.0 },
//       u_resolution: {
//         value: new THREE.Vector2(mount.clientWidth, mount.clientHeight),
//       },
//       u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
//       u_hue: { value: shaderProps.hue },
//       u_speed: { value: shaderProps.speed },
//       u_intensity: { value: shaderProps.intensity },
//       u_complexity: { value: shaderProps.complexity },
//       u_warp: { value: shaderProps.warp },
//     };

//     const vertexShader = `
//       void main() {
//         gl_Position = vec4(position, 1.0);
//       }
//     `;

//     const fragmentShader = `
//       precision highp float;
//       uniform vec2 u_resolution;
//       uniform float u_time;
//       uniform vec2 u_mouse;
//       uniform float u_hue;
//       uniform float u_speed;
//       uniform float u_intensity;
//       uniform float u_complexity;
//       uniform float u_warp;

//       vec3 hsv2rgb(vec3 c) {
//         vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//         vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//         return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
//       }

//       float random(vec2 st) {
//         return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
//       }

//       float noise(vec2 st) {
//         vec2 i = floor(st);
//         vec2 f = fract(st);
//         vec2 u = f * f * (3.0 - 2.0 * f);
//         return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
//                    mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
//       }

//       float fbm(vec2 st) {
//         float value = 0.0;
//         float amplitude = 0.5;
//         for (int i = 0; i < 10; i++) {
//           if (i >= int(u_complexity)) break;
//           value += amplitude * noise(st);
//           st *= 2.0;
//           amplitude *= 0.5;
//         }
//         return value;
//       }

//       mat2 rotate(float angle) {
//         return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
//       }

//       // Grok-style energy flow from right to left
//       float energyFlow(vec2 uv, float time) {
//         // Create energy source on the right side
//         vec2 energySource = vec2(1.4, 0.0); // Off-screen right

//         // Distance from energy source
//         float dist = distance(uv, energySource);

//         // Create flowing effect from right to left
//         vec2 flowDir = normalize(vec2(-1.0, sin(uv.y * 2.0 + time) * 0.3)); // Flow left with wave
//         vec2 flowPos = uv + flowDir * time * u_speed * 2.0;

//         // Multiple layers of noise for complex flow
//         float flow1 = fbm(flowPos * 1.5 + time * 0.5);
//         float flow2 = fbm(flowPos * 2.8 + time * 0.3 + vec2(100.0));
//         float flow3 = fbm(flowPos * 4.2 + time * 0.7 + vec2(200.0));

//         float combinedFlow = flow1 * 0.5 + flow2 * 0.3 + flow3 * 0.2;

//         // Create bright source area on the right
//         float sourceGlow = 1.0 - smoothstep(0.0, 2.5, dist);
//         sourceGlow = pow(sourceGlow, 0.8);

//         // Create streaming effect flowing left
//         float streamMask = 1.0 - smoothstep(0.0, 0.6, abs(uv.y)); // Horizontal stream
//         float horizontalFalloff = smoothstep(1.5, -1.0, uv.x); // Fades as it goes left

//         // Turbulent flow pattern
//         float turbulence = fbm(uv * 3.0 + vec2(-time * 2.0, time * 0.5));
//         streamMask *= (0.7 + turbulence * 0.5);

//         // Combine source glow with flowing stream
//         float energy = sourceGlow + (combinedFlow * streamMask * horizontalFalloff * 0.8);

//         // Add bright hotspots
//         float hotspot1 = 1.0 - smoothstep(0.0, 0.4, distance(uv, vec2(0.8, sin(time * 1.5) * 0.2)));
//         float hotspot2 = 1.0 - smoothstep(0.0, 0.3, distance(uv, vec2(0.4, sin(time * 2.0 + 1.0) * 0.15)));

//         energy += hotspot1 * 0.6 + hotspot2 * 0.4;

//         return clamp(energy, 0.0, 1.0);
//       }

//       void main() {
//         vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//         float t = u_time * u_speed;

//         // Mouse interaction
//         vec2 mouse_uv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
//         float warp_effect = smoothstep(0.7, 0.0, distance(uv, mouse_uv)) * u_warp;

//         // Get energy flow
//         float energy = energyFlow(uv + warp_effect * 0.5, t);

//         // Enhanced noise for more detail
//         vec2 p = uv * rotate(t * 0.05) + warp_effect;
//         p += energy * 0.3; // Flow affects noise sampling

//         float n1 = fbm(p * 1.8 + vec2(t * 0.8, t * 0.4));
//         float n2 = fbm(p * 3.2 + n1 * 0.5 + vec2(-t * 0.6, t * 0.9));
//         float n3 = fbm(p * 5.5 + n2 * 0.3 + vec2(t * 0.4, -t * 0.7));

//         float final_noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

//         // Color calculation with energy influence
//         float hue_shift = (final_noise + energy) * 0.15;
//         float saturation = 0.4 + (final_noise + energy * 0.5) * 0.6;
//         float value = 0.1 + energy * u_intensity * 1.5;

//         // Boost brightness in high-energy areas
//         value += pow(energy, 1.5) * u_intensity * 2.0;
//         value += pow(smoothstep(0.6, 1.0, final_noise), 2.0) * energy * 0.8;

//         // Create the main color
//         vec3 color = hsv2rgb(vec3((u_hue / 360.0) + hue_shift, saturation, value));

//         // Add bright white/blue core to the energy source
//         float coreGlow = pow(energy, 3.0);
//         vec3 coreColor = mix(color, vec3(1.0, 1.0, 1.2), coreGlow * 0.8);

//         // Add subtle background glow
//         float backgroundGlow = pow(energy, 0.5) * 0.3;
//         vec3 glowColor = hsv2rgb(vec3(u_hue / 360.0, 0.3, 0.4));

//         // Final composition
//         vec3 finalColor = mix(vec3(0.0), glowColor, backgroundGlow);
//         finalColor = mix(finalColor, coreColor, smoothstep(0.0, 0.5, energy));

//         // Add atmospheric perspective (darker toward left edge)
//         float atmosphere = smoothstep(-1.2, 0.0, uv.x);
//         finalColor *= (0.2 + atmosphere * 0.8);

//         gl_FragColor = vec4(finalColor, 1.0);
//       }
//     `;

//     const geometry = new THREE.PlaneGeometry(2, 2);
//     const material = new THREE.ShaderMaterial({
//       uniforms,
//       vertexShader,
//       fragmentShader,
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     threeRef.current = { renderer, scene, camera, material };

//     // --- Animation & Event Listeners ---
//     const clock = new THREE.Clock();
//     let animationFrameId;
//     const animate = () => {
//       uniforms.u_time.value = clock.getElapsedTime();
//       renderer.render(scene, camera);
//       animationFrameId = requestAnimationFrame(animate);
//     };
//     animate();

//     const handleResize = () => {
//       if (!mountRef.current) return;
//       const { clientWidth, clientHeight } = mountRef.current;
//       renderer.setSize(clientWidth, clientHeight);
//       uniforms.u_resolution.value.set(clientWidth, clientHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     const handleMouseMove = (e) => {
//       uniforms.u_mouse.value.x = e.clientX;
//       uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // --- Cleanup ---
//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("mousemove", handleMouseMove);
//       mount.removeChild(renderer.domElement);
//       geometry.dispose();
//       material.dispose();
//       renderer.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     if (threeRef.current) {
//       const { material } = threeRef.current;
//       material.uniforms.u_hue.value = shaderProps.hue;
//       material.uniforms.u_speed.value = shaderProps.speed;
//       material.uniforms.u_intensity.value = shaderProps.intensity;
//       material.uniforms.u_complexity.value = shaderProps.complexity;
//       material.uniforms.u_warp.value = shaderProps.warp;
//     }
//   }, [shaderProps]);
// };

// // --- React Components ---
// export const ShaderCanvas = (props) => {
//   const mountRef = useRef(null);
//   useShaderAnimation(mountRef, props);
//   return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
// };

// export const ControlSlider = ({ label, value, onChange, min, max, step }) => (
//   <div className="flex flex-col text-white/90">
//     <div className="flex justify-between items-center mb-2">
//       <label className="text-sm font-medium tracking-wide">{label}</label>
//       <span className="text-xs bg-white/10 px-2 py-1 rounded-full font-mono">
//         {Number(value).toFixed(2)}
//       </span>
//     </div>
//     <input
//       type="range"
//       min={min}
//       max={max}
//       step={step}
//       value={value}
//       onChange={onChange}
//       className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-violet-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
//     />
//   </div>
// );

// export default function ConeGlow() {
//   const [hue, setHue] = useState(210);
//   const [speed, setSpeed] = useState(0.25);
//   const [intensity, setIntensity] = useState(1.2);
//   const [complexity, setComplexity] = useState(6.0);
//   const [warp, setWarp] = useState(0.3);

//   return (
//     <div className="relative w-screen h-screen bg-black font-sans overflow-hidden">
//       <ShaderCanvas
//         hue={hue}
//         speed={speed}
//         intensity={intensity}
//         complexity={complexity}
//         warp={warp}
//       />

//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <h1 className="text-5xl md:text-8xl font-bold text-white/80 mix-blend-screen text-center select-none tracking-wider">
//           Energy Flow
//         </h1>
//       </div>

//       <div className="absolute bottom-4 left-4 w-72 p-4">
//         <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-4 border border-white/10">
//           <ControlSlider
//             label="Hue"
//             value={hue}
//             onChange={(e) => setHue(parseFloat(e.target.value))}
//             min="0"
//             max="360"
//             step="1"
//           />
//           <ControlSlider
//             label="Speed"
//             value={speed}
//             onChange={(e) => setSpeed(parseFloat(e.target.value))}
//             min="0.0"
//             max="1.0"
//             step="0.01"
//           />
//           <ControlSlider
//             label="Intensity"
//             value={intensity}
//             onChange={(e) => setIntensity(parseFloat(e.target.value))}
//             min="0.1"
//             max="3.0"
//             step="0.01"
//           />
//           <ControlSlider
//             label="Complexity"
//             value={complexity}
//             onChange={(e) => setComplexity(parseFloat(e.target.value))}
//             min="1.0"
//             max="8.0"
//             step="0.1"
//           />
//           <ControlSlider
//             label="Warp"
//             value={warp}
//             onChange={(e) => setWarp(parseFloat(e.target.value))}
//             min="0.0"
//             max="1.0"
//             step="0.01"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
