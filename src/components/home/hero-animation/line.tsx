"use client";

import { useRef, useEffect } from "react";

// Basic Vertex Shader (unchanged)
const vertexShader: string = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.1; // Map [-1, 1] to [0, 1]
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Modified Fragment Shader: Consistent cone glow with moving smoke particles
const fragmentShader: string = `precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;

// Pseudo-random hash function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Smooth 2D value noise function
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

// Fractional Brownian motion for smoke texture
float fbm(in vec2 st) {
  float value = 0.0;
  float amplitude = 0.4;
  vec2 shift = vec2(300.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for (int i = 0; i < 6; ++i) {
    value += amplitude * noise(st);
    st = rot * st * 2.0 + shift;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;

  // === SMOKE SHAPE MASK (wavy, tapering trail) ===
  vec2 origin = vec2(1.0, 0.5); // Start from right center
  float distToOrigin = distance(uv, origin);

  // Define a wavy path with downward trend
  float wave = sin((1.0 - uv.x) * 10.0 + uTime * 0.2) * 0.15; // Wavy motion with time
  float targetY = 0.5 - (1.0 - uv.x) * 0.5 + wave; // Downward trend from 0.5 to 0.0
  float yOffset = abs(uv.y - targetY);

  // Soft edge falloff for the trail
  float trailWidth = mix(0.1, 0.05, 1.0 - uv.x); // Narrower as it moves left
  float inTrail = 1.0 - smoothstep(0.0, trailWidth, yOffset);

  // Distance-based fade (tighter range for tapering)
  float trailFalloff = 1.0 - smoothstep(0.0, 0.7, distToOrigin) * smoothstep(0.3, 1.0, uv.x);

  // Combine mask with soft edges
  float trailMask = inTrail * trailFalloff;

  // === MOVING SMOKE PARTICLES ===
  vec2 smokeUV = uv * 6.0; // Fine detail for wavy texture

  // Leftward movement with slight upward drift
  smokeUV.x += uTime * 0.03;
  smokeUV.y -= uTime * 0.05;

  // Generate smoke texture
  float smokeNoise = fbm(smokeUV);
  float smokeDensity = smoothstep(0.2, 0.5, smokeNoise); // Softer density for fade

  // Apply trail mask to smoke
  smokeDensity *= trailMask;

  // === BASE GLOW (minimal) ===
  float baseGlow = trailMask * 0.1; // Subtle base

  // === COMBINE EVERYTHING ===
  // Soft gray-white color scheme
  vec3 baseColor = vec3(0.8, 0.8, 0.8) * baseGlow;
  vec3 smokeColor = vec3(0.9, 0.9, 0.9) * smokeDensity;

  vec3 finalColor = baseColor + smokeColor;

  // Subtle brightness boost with fade
  finalColor += smokeDensity * 0.3 * vec3(1.0, 1.0, 1.0);

  // Final alpha with smooth fade
  float totalAlpha = max(baseGlow, smokeDensity * 0.6);

  gl_FragColor = vec4(finalColor, totalAlpha);
}
`;

const LineEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Set canvas size
    const resizeCanvas = (): void => {
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Compile shaders
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

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShader);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);

    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Create a buffer for a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions: number[] = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
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
    const animate = (): void => {
      const currentTime: number = (Date.now() - startTime.current) * 0.001;
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(
        resolutionUniformLocation,
        gl.canvas.width,
        gl.canvas.height
      );

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Optional: Add some text to see the effect better */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-6xl font-bold text-white/20 select-none">
          AI APPLICATION
        </div>
      </div>
    </div>
  );
};

export default LineEffect;

// "use client";

// import { useRef, useEffect } from "react";

// // Basic Vertex Shader (unchanged)
// const vertexShader: string = `
//   attribute vec2 position;
//   varying vec2 vUv;
//   void main() {
//     vUv = position * 0.5 + 0.1; // Map [-1, 1] to [0, 1]
//     gl_Position = vec4(position, 0.0, 1.0);
//   }
// `;

// // Modified Fragment Shader: Consistent cone glow with moving smoke particles
// const fragmentShader: string = `precision highp float;
// varying vec2 vUv;
// uniform float uTime;
// uniform vec2 uResolution;

// // Pseudo-random hash function
// float random(vec2 st) {
//   return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
// }

// // Smooth 2D value noise function
// float noise(in vec2 st) {
//   vec2 i = floor(st);
//   vec2 f = fract(st);

//   float a = random(i);
//   float b = random(i + vec2(1.0, 0.0));
//   float c = random(i + vec2(0.0, 1.0));
//   float d = random(i + vec2(1.0, 1.0));

//   vec2 u = f * f * (3.0 - 2.0 * f);

//   return mix(a, b, u.x) +
//          (c - a) * u.y * (1.0 - u.x) +
//          (d - b) * u.x * u.y;
// }

// // Fractional Brownian motion for wavy smoke texture
// float fbm(in vec2 st) {
//   float value = 0.0;
//   float amplitude = 0.5;
//   vec2 shift = vec2(100.0);
//   mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

//   for (int i = 0; i < 6; ++i) {
//     value += amplitude * noise(st);
//     st = rot * st * 2.0 + shift;
//     amplitude *= 0.5;
//   }
//   return value;
// }

// void main() {
//   vec2 uv = vUv;

//   // === SMOKE PATH MASK (wavy and tapering) ===
//   vec2 coneOrigin = vec2(1.0, 0.5); // Right side, center vertically
//   float distToOrigin = distance(uv, coneOrigin);

//   // Define a wavy path based on x position
//   float wave = sin((1.0 - uv.x) * 6.0 + uTime * 0.2) * 0.2; // Wavy motion with time
//   float targetY = 0.5 + wave - (1.0 - uv.x) * 0.5; // Starts high, slopes down
//   float yDeviation = abs(uv.y - targetY);

//   // Narrower width with distance
//   float pathWidth = mix(0.1, 0.03, 1.0 - smoothstep(0.3, 1.0, uv.x)); // Tapers as it moves left

//   // Soft edge fading
//   float inPath = 1.0 - smoothstep(0.0, pathWidth * 2.0, yDeviation); // Broader range for softer edges

//   // Distance falloff with taper
//   float pathFalloff = 1.0 - smoothstep(0.0, 0.7, distToOrigin) * smoothstep(0.2, 1.0, uv.x);

//   // Combine path mask
//   float pathMask = inPath * pathFalloff;

//   // === MOVING SMOKE PARTICLES ===
//   vec2 smokeUV = uv * 5.0; // Finer noise scale
//   smokeUV.x += uTime * 0.03; // Slow leftward movement
//   smokeUV.y -= uTime * 0.05; // Slight upward drift

//   // Generate smoke texture
//   float smokeNoise = fbm(smokeUV + vec2(wave * 2.0, 0.0)); // Add wave influence
//   float smokeDensity = smoothstep(0.2, 0.5, smokeNoise) * pathMask; // Softer density with mask

//   // === BASE GLOW (minimal) ===
//   float baseGlow = pathMask * 0.1;

//   // === COMBINE EVERYTHING ===
//   // Soft gray-white color scheme
//   vec3 baseColor = vec3(0.8, 0.8, 0.8) * baseGlow;
//   vec3 smokeColor = vec3(0.9, 0.9, 0.9) * smokeDensity;

//   vec3 finalColor = baseColor + smokeColor;

//   // Subtle brightness boost with fading
//   finalColor += smokeDensity * 0.3 * vec3(1.0, 1.0, 1.0);

//   // Final alpha with soft edges
//   float totalAlpha = max(baseGlow, smokeDensity * 0.6);

//   gl_FragColor = vec4(finalColor, totalAlpha);
// }
// `;

// const LineEffect: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const animationFrameId = useRef<number | null>(null);
//   const startTime = useRef<number>(Date.now());

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const gl =
//       (canvas.getContext("webgl") as WebGLRenderingContext) ||
//       (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
//     if (!gl) {
//       console.error("WebGL not supported");
//       return;
//     }

//     // Enable blending for transparency
//     gl.enable(gl.BLEND);
//     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//     // Set canvas size
//     const resizeCanvas = (): void => {
//       canvas.width = canvas.parentElement!.clientWidth;
//       canvas.height = canvas.parentElement!.clientHeight;
//       gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Compile shaders
//     const createShader = (type: number, source: string): WebGLShader | null => {
//       const shader = gl.createShader(type);
//       if (!shader) return null;
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

//     if (!vertShader || !fragShader) return;

//     const program = gl.createProgram();
//     if (!program) return;

//     gl.attachShader(program, vertShader);
//     gl.attachShader(program, fragShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       console.error("Program link error:", gl.getProgramInfoLog(program));
//       gl.deleteProgram(program);
//       return;
//     }

//     gl.useProgram(program);

//     // Create a buffer for a full-screen quad
//     const positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     const positions: number[] = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
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
//     const animate = (): void => {
//       const currentTime: number = (Date.now() - startTime.current) * 0.001;
//       gl.uniform1f(timeUniformLocation, currentTime);
//       gl.uniform2f(
//         resolutionUniformLocation,
//         gl.canvas.width,
//         gl.canvas.height
//       );

//       gl.clearColor(0.0, 0.0, 0.0, 0.0);
//       gl.clear(gl.COLOR_BUFFER_BIT);

//       gl.drawArrays(gl.TRIANGLES, 0, 6);

//       animationFrameId.current = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resizeCanvas);
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }
//       gl.deleteProgram(program);
//       gl.deleteShader(vertShader);
//       gl.deleteShader(fragShader);
//       gl.deleteBuffer(positionBuffer);
//     };
//   }, []);

//   return (
//     <div className="absolute inset-0 z-0 overflow-hidden bg-black">
//       <canvas ref={canvasRef} className="w-full h-full block" />
//       {/* Optional: Add some text to see the effect better */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <div className="text-6xl font-bold text-white/20 select-none">
//           AI APPLICATION
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LineEffect;
