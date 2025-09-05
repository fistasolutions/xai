// "use client";

// import { useRef, useEffect } from "react";

// // Basic Vertex Shader (unchanged)
// const vertexShader = `
//   attribute vec2 position;
//   varying vec2 vUv;
//   void main() {
//     vUv = position * 0.5 + 0.5; // Map [-1, 1] to [0, 1]
//     gl_Position = vec4(position, 0.0, 1.0);
//   }
// `;

// // Further Improved Fragment Shader: Cone-like glow pointing left, limited to ~half screen, 80% vertical coverage
// const fragmentShader = `
//   precision highp float;
//   varying vec2 vUv;
//   uniform float uTime;
//   uniform vec2 uResolution;

//   // Pseudo-random hash function (unchanged)
//   float random(vec2 st) {
//     return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
//   }

//   // Smooth 2D value noise function (unchanged)
//   float noise(in vec2 st) {
//     vec2 i = floor(st);
//     vec2 f = fract(st);

//     // Four corners in 2D of a tile
//     float a = random(i);
//     float b = random(i + vec2(1.0, 0.0));
//     float c = random(i + vec2(0.0, 1.0));
//     float d = random(i + vec2(1.0, 1.0));

//     // Smooth interpolation
//     vec2 u = f * f * (3.0 - 2.0 * f);

//     return mix(a, b, u.x) +
//            (c - a) * u.y * (1.0 - u.x) +
//            (d - b) * u.x * u.y;
//   }

//   // Fractional Brownian motion with rotation (unchanged)
//   float fbm(in vec2 st) {
//     float value = 0.0;
//     float amplitude = 0.5;
//     vec2 shift = vec2(100.0);
//     mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

//     for (int i = 0; i < 6; ++i) {
//       value += amplitude * noise(st);
//       st = rot * st * 2.0 + shift;
//       amplitude *= 0.5;
//     }
//     return value;
//   }

//   void main() {
//     vec2 uv = vUv; // UV from 0 to 1
//     vec2 st = uv * 8.0; // Scale for detail

//     // Slow animation: subtle drift and rise
//     st.x += uTime * 0.02; // Slow horizontal drift
//     st.y -= uTime * 0.05; // Slow upward rise

//     // Cone-like influence: Simulate a cone from right side pointing left
//     // Apex near right edge (x=1.0), base widening left to ~half screen (x=0.5)
//     vec2 coneOrigin = vec2(1.0, 0.5); // Center vertically on right
//     float distToOrigin = distance(uv, coneOrigin);
//     float coneAngle = atan(uv.y - coneOrigin.y, uv.x - coneOrigin.x); // Angle for cone shape
//     float coneWidth = mix(0.1, 0.8, smoothstep(1.0, 0.5, uv.x)); // Widen as it points left, but limit to x>=0.5
//     float inCone = smoothstep(coneWidth, coneWidth + 0.1, abs(coneAngle)); // Soft cone edges
//     float coneFalloff = smoothstep(0.8, 0.0, distToOrigin) * smoothstep(0.5, 1.0, uv.x); // Stronger on right, fades left, limits to right half

//     // Vertical 80% glow: Fade out top/bottom 10%
//     float verticalFalloff = smoothstep(0.1, 0.0, abs(uv.y - 0.5) - 0.4); // 80% centered vertically (0.1 to 0.9 y)

//     // Generate smooth smoke density
//     float smokeDensity = fbm(st);
//     smokeDensity = smoothstep(0.2, 0.8, smokeDensity); // Density distribution

//     // Apply cone and vertical influences
//     smokeDensity *= coneFalloff * inCone * verticalFalloff;

//     // Blue-white glow color with added brightness
//     vec3 smokeColor = mix(vec3(0, 0, 0), vec3(1.0, 1.0, 1.0), smokeDensity);
//     smokeColor += smokeDensity * 0.8 * vec3(0.3, 0.5, 1.0); // Blue tint glow
//     smokeColor = clamp(smokeColor, 0.0, 1.0);

//     // Alpha for transparency
//     gl_FragColor = vec4(smokeColor, smokeDensity * 0.6);
//   }
// `;

// const HomeHero2 = () => {
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

// export default HomeHero2;

"use client";

import { useRef, useEffect } from "react";

// Basic Vertex Shader (unchanged)
const vertexShader: string = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5; // Map [-1, 1] to [0, 1]
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Further Improved Fragment Shader: Cone-like glow pointing left, limited to ~half screen, 80% vertical coverage
const fragmentShader: string = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // Pseudo-random hash function (unchanged)
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Smooth 2D value noise function (unchanged)
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

  // Fractional Brownian motion with rotation (unchanged)
  float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

    for (int i = 0; i < 6; ++i) {
      value += amplitude * noise(st);
      st = rot * st * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv; // UV from 0 to 1
    vec2 st = uv * 8.0; // Scale for detail

    // Slow animation: subtle drift and rise
    st.x += uTime * 0.02; // Slow horizontal drift
    st.y -= uTime * 0.05; // Slow upward rise

    // Cone-like influence: Simulate a cone from right side pointing left
    // Apex near right edge (x=1.0), base widening left to ~half screen (x=0.5)
    vec2 coneOrigin = vec2(1.0, 0.5); // Center vertically on right
    float distToOrigin = distance(uv, coneOrigin);
    float coneAngle = atan(uv.y - coneOrigin.y, uv.x - coneOrigin.x); // Angle for cone shape
    float coneWidth = mix(0.1, 0.8, smoothstep(1.0, 0.5, uv.x)); // Widen as it points left, but limit to x>=0.5
    float inCone = smoothstep(coneWidth, coneWidth + 0.1, abs(coneAngle)); // Soft cone edges
    float coneFalloff = smoothstep(0.8, 0.0, distToOrigin) * smoothstep(0.5, 1.0, uv.x); // Stronger on right, fades left, limits to right half

    // Vertical 80% glow: Fade out top/bottom 10%
    float verticalFalloff = smoothstep(0.1, 0.0, abs(uv.y - 0.5) - 0.4); // 80% centered vertically (0.1 to 0.9 y)

    // Generate smooth smoke density
    float smokeDensity = fbm(st);
    smokeDensity = smoothstep(0.2, 0.8, smokeDensity); // Density distribution

    // Apply cone and vertical influences
    smokeDensity *= coneFalloff * inCone * verticalFalloff;

    // Blue-white glow color with added brightness
    vec3 smokeColor = mix(vec3(0, 0, 0), vec3(1.0, 1.0, 1.0), smokeDensity);
    smokeColor += smokeDensity * 0.8 * vec3(0.3, 0.5, 1.0); // Blue tint glow
    smokeColor = clamp(smokeColor, 0.0, 1.0);

    // Alpha for transparency
    gl_FragColor = vec4(smokeColor, smokeDensity * 0.6);
  }
`;

const HomeHero2: React.FC = () => {
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
    const positions: number[] = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]; // Two triangles forming a quad
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
      const currentTime: number = (Date.now() - startTime.current) * 0.001; // Time in seconds
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
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default HomeHero2;
