// everything is good

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

//Star brightness
#define STAR 5.0
//Flare brightness
#define FLARE 4.0
// Star color
#define COLOR vec3(0.2, 0.3, 0.8)

// Star turbulence parameters
#define STAR_NUM 12.0
#define STAR_AMP 0.5
#define STAR_SPEED 0.01
#define STAR_VEL vec2(1.0, 0.0)
#define STAR_FREQ 8.0
#define STAR_EXP 1.5

// Logo size (relative to screen-y)
// Set in both shaders!
#define LOGO_SCALE 0.5
// Aspect ratio (w / h)
#define LOGO_RATIO 2.08

// Glow strength - increased for better visibility
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

 //Horizontal stretching factor (1 / scale)
 #define STAR_STRETCH 0.7
 #define STAR_CURVE 0.5

 // Signed range [-1, 1]
 vec2 suv = p * 2.0 - 1.0;
 // Coordinates relative to right side
 vec2 right = suv - vec2(1.0, 0.0);

 // Aspect corrected
 right.x *= STAR_STRETCH * uResolution.x / uResolution.y;
 // Apply turbulence
 // Variable turbulence intensity
 float factor = 1.0 + 0.4 * sin(9.0 * suv.y) * sin(5.0 * (suv.x + 5.0 * uTime * STAR_SPEED));
 vec2 turb = right + factor * STAR_AMP * turbulence(right, STAR_FREQ, STAR_NUM);
 // Shift top and bottom edges
 turb.x -= STAR_CURVE * suv.y * suv.y;

 // Attenuate slower inside
 float fade = max(4.0 * suv.y * suv.y - suv.x + 1.2, 0.001);
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

 // Compute logo scale (aspect ratio corrected) - Modified for better positioning
 float aspectRatio = uResolution.x / uResolution.y;
 vec2 scale = max(uLogoScale, 1.0 - (LOGO_RATIO / 4.0)) * ratio * vec2(LOGO_RATIO, -1.0);
 
 // Adjusted logo positioning - keep it more centered on larger screens
 vec2 logoUv = 0.5 + (vUv - 0.5) / scale;

 // Logo texture + turbulent samples
 vec4 logo = vec4(0);
 vec4 logoTurb = vec4(0);
 // Signed direction vector from logo
 vec2 dir = vec2(0);
 // Glow intensity
 float glow = 0.0;
 // UV distortions - use adjusted offset
 vec2 distort = uOffset * min(1.0, aspectRatio / 2.0); // Scale offset based on aspect ratio

 // Bounding box check
 if (logoUv.x >= 0.0 && logoUv.x <= 1.0 && logoUv.y >= 0.0 && logoUv.y <= 1.0) {
 // Sample logo
 logo = texture2D(uLogoTexture, logoUv);

 // Direction vector (flipped x)
 dir = (logo.rg - 0.6);
 dir.x = -dir.x;

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

 // Glow - Enhanced for better visibility
 // Horizontal fade
 float xx = logoUv.x;
 // Vertical fade
 float yy = (logoUv.y - 0.5);
 // Glow intensity - made more generous
 glow = max(logoTurb.b - (xx * xx * 0.5 + 4.0 * yy * yy) * logoTurb.b, 0.0);

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
 // Horizontal fade - adjusted for wider screens
 vig *= 0.5 + 0.5 * min(suv.x, 0.5); // Cap the horizontal fade
 // Apply vignette
 col *= vig * vig;

 // Tonemap and gamma encode
 col /= 1.0 + col;
 col = clamp(col, 0.0, 1.0);
 col = gamma_encode(col);

 // Light gradient - Enhanced for better glow visibility
 float yy = suv.y + 0.03;
 yy = max(1.0 - 1e1 * yy * yy / max(0.5 + 1.5 * starUv.x, 0.1), 0.0);
 float light = max(0.5 + 0.5 * starUv.x, 0.0) * yy;
 // Enhanced glow contribution
 light += 3.0 * (1.0 - light) * glow;

 // Rim
 float tint = GLOW_TINT * dir.x * glow;
 vec3 hue = mix(GLOW_RED, GLOW_BLUE, 1.0 + suv.x + tint);
 float alpha = 1.0 - (1.0 - pow(yy, LIGHT_EXP)) * glow;
 // Enhanced rim glow
 vec3 rim = GLOW_STRENGTH * light * light * light * light * alpha * (0.3 + 0.7 * max(suv.x, -0.5)) * hue;

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
#define TURB_VEL vec2(0.1, 0.0)
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
 float aspectRatio = uResolution.x / uResolution.y;

 // Compute logo scale (aspect ratio corrected) - Match the composition shader
 vec2 scale = max(uLogoScale, 1.0 - (LOGO_RATIO / 4.0)) * ratio * vec2(LOGO_RATIO, -1.0);
 
// Keep logo centered
vec2 logoUV = 0.5 + (vUv - 0.5) / scale;
 // Sample logo
 vec4 logo = vec4(0);
 if (logoUV.x >= 0.0 && logoUV.x <= 1.0 && logoUV.y >= 0.0 && logoUV.y <= 1.0) {
 logo = texture2D(uLogoTexture, logoUV);
 }

 // Delta rate
 float delta = 144.0 * uDeltaTime;
 // Scroll velocity
 vec2 scroll = SCROLL_SPEED * vec2(1.0, vUv.y - 0.5) * ratio;
 // Turbulent distortion vector
 vec2 turb = turbulence((vUv + scroll) / ratio);
 // Distortion velocity
 vec2 distort = DISTORT_SPEED * turb;
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

 //Set output color
 vec4 col = decay;

 //Trail velocity
 vec2 vel = (-trailB) / (0.01 + length(trailB));
 //Add trail velocity (smooth blended)
 col.rg -= (0.5 - abs(decay.rg - 0.5)) * (falloff * vel);
 //Add trail falloff (smooth blended)
 col.ba += falloff * (1.0 - decay.ba) * vec2(1.0, vig * vig);

 //Stochastic dithering
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
    let compositionProgram = createProgram(
      vertexShaderSrc,
      compositionFragmentShader
    );
    let trailProgram = createProgram(vertexShaderSrc, trailFragmentShader);

    if (!compositionProgram || !trailProgram) {
      console.warn("Using fallback shaders due to compilation errors");
      const fallbackVs = `
attribute vec2 aPosition;
void main() {
 gl_Position = vec4(aPosition, 0.0, 1.0);
 }
 `;
      const fallbackFs = `
 precision mediump float;
 void main() {
 gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);
 }
 `;
      compositionProgram =
        compositionProgram || createProgram(fallbackVs, fallbackFs);
      trailProgram = trailProgram || createProgram(fallbackVs, fallbackFs);
    }

    bindQuad(compositionProgram!);
    bindQuad(trailProgram!);

    // Uniform locations for composition
    const compUniforms = {
      time: gl.getUniformLocation(compositionProgram!, "uTime"),
      resolution: gl.getUniformLocation(compositionProgram!, "uResolution"),
      logoScale: gl.getUniformLocation(compositionProgram!, "uLogoScale"),
      offset: gl.getUniformLocation(compositionProgram!, "uOffset"),
      noiseTexture: gl.getUniformLocation(compositionProgram!, "uNoiseTexture"),
      logoTexture: gl.getUniformLocation(compositionProgram!, "uLogoTexture"),
      trailTexture: gl.getUniformLocation(compositionProgram!, "uTrailTexture"),
    };

    // Uniform locations for trail
    const trailUniforms = {
      time: gl.getUniformLocation(trailProgram!, "uTime"),
      deltaTime: gl.getUniformLocation(trailProgram!, "uDeltaTime"),
      resolution: gl.getUniformLocation(trailProgram!, "uResolution"),
      logoScale: gl.getUniformLocation(trailProgram!, "uLogoScale"),
      mouse: gl.getUniformLocation(trailProgram!, "uMouse"),
      mouseVelocity: gl.getUniformLocation(trailProgram!, "uMouseVelocity"),
      noiseTexture: gl.getUniformLocation(trailProgram!, "uNoiseTexture"),
      previousFrame: gl.getUniformLocation(trailProgram!, "uPreviousFrame"),
      logoTexture: gl.getUniformLocation(trailProgram!, "uLogoTexture"),
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
      // const width = canvas.clientWidth;
      // if (width >= 900) return "/images/logo.png";
      // if (width >= 450) return "/images/logoHalf.png";
      return "/images/logo2.png"; // Use your logo for small
    };

    let logoPath = chooseLogo();

    // Load textures
    Promise.all([
      loadTexture("/images/texture.png", true), // Your noise image
      loadTexture(logoPath, false),
    ])
      .then(([noiseTex, logoTex]) => {
        // Resize function
        const updateSize = () => {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);

          // Update render textures
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

          // Compute logo scale and offset based on screen size
          const logoScale = 0.5;
          const aspectRatio = canvas.width / canvas.height;

          // Adjust offset based on aspect ratio to keep glow visible
          let offsetX = -0.2; // Less aggressive offset
          if (aspectRatio > 2.0) {
            offsetX = -0.1; // Very wide screens
          } else if (aspectRatio > 1.5) {
            offsetX = -0.15; // Wide screens
          }

          gl.useProgram(compositionProgram);
          gl.uniform2f(compUniforms.resolution, canvas.width, canvas.height);
          gl.uniform1f(compUniforms.logoScale, logoScale);
          gl.uniform2f(compUniforms.offset, offsetX, 0);

          gl.useProgram(trailProgram);
          gl.uniform2f(trailUniforms.resolution, canvas.width, canvas.height);
          gl.uniform1f(trailUniforms.logoScale, logoScale);

          // Check if logo needs update
          const newLogoPath = chooseLogo();
          if (newLogoPath !== logoPath) {
            logoPath = newLogoPath;
            loadTexture(logoPath, false).then((newLogoTex) => {
              logoTex = newLogoTex;
            });
          }
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

        const animate = (time: number) => {
          const deltaTime = Math.min((time - lastTime) * 0.001, 0.05);
          lastTime = time;
          frameCount++;

          if (time - fpsTime >= 1000) {
            const fps = (1000 * frameCount) / (time - fpsTime);
            fpsTime = time;
            frameCount = 0;
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

        window.addEventListener("resize", updateSize);
        requestAnimationFrame(animate);

        setIsLoaded(true);

        // Cleanup
        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("resize", updateSize);
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
    <div className="absolute inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1s",
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default AnimationComponent;
