// "use client";
// import { useRef, useEffect } from "react";

// // Basic Vertex Shader (usually consistent for full-screen effects)
// const vertexShader = `
//   attribute vec2 position;
//   varying vec2 vUv;
//   void main() {
//     vUv = position * 0.5 + 0.5; // Map [-1, 1] to [0, 1]
//     gl_Position = vec4(position, 0.0, 1.0);
//   }
// `;

// // Conceptual Fragment Shader for Smoke (simplified)
// // This is where the magic happens for smoke generation.
// // You'll need to expand this significantly with noise functions and animation.
// // Updated Fragment Shader for detailed, slow smoke
// const fragmentShader = `
//   precision highp float;
//   varying vec2 vUv;
//   uniform float uTime;
//   uniform vec2 uResolution;

//   // --- 2D Simplex Noise by Ashima Arts ---
//   // This is a high-quality noise function that creates organic patterns.
//   vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
//   vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
//   vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//   float snoise(vec2 v) {
//     const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
//     vec2 i  = floor(v + dot(v, C.yy) );
//     vec2 x0 = v - i + dot(i, C.xx);
//     vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//     vec4 x12 = x0.xyxy + C.xxzz;
//     x12.xy -= i1;
//     i = mod289(i);
//     vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
//     vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
//     m = m*m;
//     m = m*m;
//     vec3 x = 2.0 * fract(p * C.www) - 1.0;
//     vec3 h = abs(x) - 0.5;
//     vec3 ox = floor(x + 0.5);
//     vec3 a0 = x - ox;
//     m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
//     vec3 g;
//     g.x  = a0.x  * x0.x  + h.x  * x0.y;
//     g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//     return 130.0 * dot(m, g);
//   }
//   // --- End Simplex Noise ---

//   // Fractional Brownian Motion (FBM) - layering noise for detail
//   float fbm(vec2 st) {
//       float value = 0.0;
//       float amplitude = 0.5;
//       // Loop to add layers of noise (octaves)
//       for (int i = 0; i < 6; i++) {
//           value += amplitude * snoise(st);
//           st *= 2.0;
//           amplitude *= 0.5;
//       }
//       return value;
//   }

//   void main() {
//       vec2 uv = vUv;

//       // A mask to create the light source effect from the right
//       float rightEdgeInfluence = smoothstep(0.5, 1.0, uv.x);
//       rightEdgeInfluence = pow(rightEdgeInfluence, 3.0); // Sharpen the light source falloff

//       // --- Create complex, swirling motion ---
//       vec2 st = uv * 3.0; // Scale the coordinates for noise

//       // 1. Create a "warping" field (q) using noise that moves very slowly.
//       // This makes the smoke flow and curl unpredictably.
//       vec2 q = vec2(fbm(st + uTime * 0.03), fbm(st + vec2(4.2, 6.3)));

//       // 2. Create the main smoke shape (r) by distorting the coordinates with the warp field.
//       vec2 r = vec2(fbm(st + 4.0 * q), fbm(st + vec2(8.3, 2.8)));

//       // 3. Animate the main smoke pattern with a slow horizontal drift.
//       st.x -= uTime * 0.06;

//       // 4. Get the final smoke density by distorting the animated coordinates with 'r'.
//       float smokeDensity = fbm(st + 5.0 * r);

//       // --- Shaping and Coloring ---

//       // Remap the noise to sharpen the tendrils. A tighter range creates wispier smoke.
//       smokeDensity = smoothstep(0.45, 0.55, smokeDensity);

//       // Apply the light source mask
//       smokeDensity *= rightEdgeInfluence;

//       // Set the color to a blueish-white, controlled by density
//       vec3 smokeColor = mix(vec3(0.0), vec3(0.8, 0.9, 1.0), smokeDensity);
//       smokeColor += smokeDensity * 0.25; // Add a subtle glow

//       // Final color with alpha based on density for smooth blending
//       gl_FragColor = vec4(smokeColor, smokeDensity);
//   }
// `;
// const AiApplicationSmokeAnimation = () => {
//   const canvasRef = useRef(null);
//   const animationFrameId = useRef(null);
//   const startTime = useRef(Date.now());

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const gl =
//       canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
//     if (!gl) {
//       console.error("WebGL not supported");
//       return;
//     }

//     // Set canvas size
//     const resizeCanvas = () => {
//       canvas.width = canvas.parentElement.clientWidth;
//       canvas.height = canvas.parentElement.clientHeight;
//       gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Compile shaders
//     const createShader = (type, source) => {
//       const shader = gl.createShader(type);
//       gl.shaderSource(shader, source);
//       gl.compileShader(shader);
//       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.error("Shader compile error:", gl.getShaderInfoLog(shader));
//         gl.deleteShader(shader);
//         return null;
//       }
//       return shader;
//     };

//     const vertShader = createShader(gl.VERTEX_SHADER, vertexShader);
//     const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);

//     const program = gl.createProgram();
//     gl.attachShader(program, vertShader);
//     gl.attachShader(program, fragShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       console.error("Program link error:", gl.getProgramInfoLog(program));
//       gl.deleteProgram(program);
//       return null;
//     }

//     gl.useProgram(program);

//     // Create a buffer for a full-screen quad
//     const positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]; // Two triangles forming a quad
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//     // Link position buffer to shader attribute
//     const positionAttributeLocation = gl.getAttribLocation(program, "position");
//     gl.enableVertexAttribArray(positionAttributeLocation);
//     gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

//     // Get uniform locations
//     const timeUniformLocation = gl.getUniformLocation(program, "uTime");
//     const resolutionUniformLocation = gl.getUniformLocation(
//       program,
//       "uResolution"
//     );

//     // Animation loop
//     const animate = () => {
//       const currentTime = (Date.now() - startTime.current) * 0.001; // Time in seconds
//       gl.uniform1f(timeUniformLocation, currentTime);
//       gl.uniform2f(
//         resolutionUniformLocation,
//         gl.canvas.width,
//         gl.canvas.height
//       );

//       gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear with transparent black
//       gl.clear(gl.COLOR_BUFFER_BIT);

//       gl.drawArrays(gl.TRIANGLES, 0, 6); // Draw the quad

//       animationFrameId.current = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resizeCanvas);
//       cancelAnimationFrame(animationFrameId.current);
//       gl.deleteProgram(program);
//       gl.deleteShader(vertShader);
//       gl.deleteShader(fragShader);
//       gl.deleteBuffer(positionBuffer);
//     };
//   }, []);

//   return (
//     <div className="absolute inset-0 z-0 overflow-hidden">
//       <canvas ref={canvasRef} className="w-full h-full block" />
//     </div>
//   );
// };

// export default AiApplicationSmokeAnimation;

"use client";

import { useRef, useEffect } from "react";

// Basic Vertex Shader (unchanged)
const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5; // Map [-1, 1] to [0, 1]
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Improved Fragment Shader for smoother, slower smoke with blue glow
const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // Pseudo-random hash function (unchanged)
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Smooth 2D value noise function (new: interpolated for smoothness)
  float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
  }

  // Fractional Brownian motion with rotation (updated: uses smooth noise, added octaves for detail)
  float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

    for (int i = 0; i < 6; ++i) { // Increased octaves for more detail
      value += amplitude * noise(st);
      st = rot * st * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv; // UV from 0 to 1
    vec2 st = uv * 8.0; // Increased scale for finer, less blurry details

    // Slow animation: subtle drift and rise
    st.x += uTime * 0.02; // Slow horizontal drift (was 0.1)
    st.y -= uTime * 0.05; // Slow upward rise for smoke-like motion

    // Gradient from right to left (source on right, higher influence on right)
    float rightEdgeInfluence = smoothstep(0.4, 1.0, uv.x);
    rightEdgeInfluence = pow(rightEdgeInfluence, 3.0); // Sharper near the source

    // Generate smooth smoke density
    float smokeDensity = fbm(st);
    smokeDensity = smoothstep(0.2, 0.8, smokeDensity); // Adjusted for better distribution
    smokeDensity *= rightEdgeInfluence;

    // Blue-white glow color with added brightness
  vec3 smokeColor = mix(vec3(0.04, 0.04, 0.04), vec3(1.0, 1.0, 1.0), smokeDensity);
    smokeColor += smokeDensity * 0.8 * vec3(0.3, 0.5, 1.0); // Blue tint glow
    smokeColor = clamp(smokeColor, 0.0, 1.0); // Prevent over-brightness

    // Alpha for transparency (less opaque for ethereal feel)
    gl_FragColor = vec4(smokeColor, smokeDensity * 0.6);
  }
`;

const AiApplicationSmokeAnimation = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Compile shaders
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShader);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    gl.useProgram(program);

    // Create a buffer for a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]; // Two triangles forming a quad
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Link position buffer to shader attribute
    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeUniformLocation = gl.getUniformLocation(program, "uTime");
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "uResolution"
    );

    // Animation loop
    const animate = () => {
      const currentTime = (Date.now() - startTime.current) * 0.001; // Time in seconds
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(
        resolutionUniformLocation,
        gl.canvas.width,
        gl.canvas.height
      );

      gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear with transparent black
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6); // Draw the quad

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default AiApplicationSmokeAnimation;
