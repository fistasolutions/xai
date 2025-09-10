// "use client";

// import React, { useRef, useMemo, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Html } from "@react-three/drei";
// import * as THREE from "three";
// import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// const MOON_PHRASES = [
//   "Lunar Whisper",
//   "Sea of Tranquility",
//   "Celestial Tide",
//   "Moonlit Orbit",
//   "Dust of the Mare",
//   "Cratered Silence",
//   "Silver Crescent",
//   "Gravity's Dance",
//   "Starlit Far Side",
//   "Eternal Nightfall",
//   "Cosmic Lullaby",
//   "Apollo Echo",
//   "Night's Lantern",
//   "Orbiting Memory",
//   "Meteor Showered Sky",
// ];
// const pointsOnSphere = (num: number, radius: number): THREE.Vector3[] => {
//   const points: THREE.Vector3[] = [];
//   const offset = 2 / num;
//   const increment = Math.PI * (3 - Math.sqrt(5));
//   for (let i = 0; i < num; i++) {
//     const y = i * offset - 1 + offset / 2;
//     const distance = Math.sqrt(1 - Math.pow(y, 2));
//     const theta = i * increment;
//     const x = Math.cos(theta) * distance;
//     const z = Math.sin(theta) * distance;
//     points.push(new THREE.Vector3(x, y, z).multiplyScalar(radius));
//   }
//   return points;
// };

// interface SpecialBoxProps {
//   position: THREE.Vector3;
//   text: string;
//   hoverOver: () => void;
//   hoverOut: () => void;
// }

// const SpecialBox: React.FC<SpecialBoxProps> = ({
//   position,
//   text,
//   hoverOver,
//   hoverOut,
// }) => {
//   const [hovered, setHovered] = useState(false);
//   const meshRef = useRef<THREE.Mesh | null>(null);
//   const hitAreaRef = useRef<THREE.Mesh | null>(null);

//   // Persisted vectors so they are NOT recreated on every render
//   const currentScale = useRef(new THREE.Vector3(1, 1, 1));
//   const targetScale = useRef(1);
//   const targetVec = useRef(new THREE.Vector3(1, 1, 1));

//   const boxSize = 0.06;
//   const hitSize = 0.12; // Larger for easier hover

//   // Update target when hovered changes
//   React.useEffect(() => {
//     targetScale.current = hovered ? 1.2 : 1;
//     targetVec.current.set(
//       targetScale.current,
//       targetScale.current,
//       targetScale.current
//     );
//   }, [hovered]);

//   // Smoothly interpolate every frame (works for both hover in & out)
//   useFrame(() => {
//     if (meshRef.current) {
//       // 0.08 = smoothing factor (0 = no change, 1 = immediate). Tweak to taste (0.02 - 0.2).
//       currentScale.current.lerp(targetVec.current, 0.08);
//       meshRef.current.scale.copy(currentScale.current);
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh
//         ref={hitAreaRef}
//         visible={false}
//         onPointerOver={(e) => {
//           e.stopPropagation();
//           setHovered(true);
//           hoverOver();
//         }}
//         onPointerOut={(e) => {
//           e.stopPropagation();
//           setHovered(false);
//           hoverOut();
//         }}
//       >
//         <boxGeometry args={[hitSize, hitSize, hitSize]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>

//       <mesh ref={meshRef}>
//         <boxGeometry args={[boxSize, boxSize, boxSize]} />
//         <meshBasicMaterial color="white" />
//       </mesh>

//       <Html
//         position={[0, boxSize / 2 + 0.03, 0]}
//         style={{
//           color: "white",
//           background: "0 0% 4%",
//           padding: "5px",
//           borderRadius: "5px",
//           whiteSpace: "nowrap",
//           opacity: hovered ? 1 : 0,
//           transition: "opacity 0.25s ease",
//           textTransform: "uppercase",
//           fontSize: "0.8rem",
//           fontFamily: "monospace",
//           // fontFamily: var(--font-geist-mono),
//           pointerEvents: "none",
//           transform: "translateX(-50%) translateY(-35px)",
//           left: "50%",
//           position: "absolute",
//         }}
//       >
//         {text}
//       </Html>
//     </group>
//   );
// };

// const Starburst: React.FC<{
//   controls: React.RefObject<OrbitControlsImpl | null>;
// }> = ({ controls }) => {
//   const groupRef = useRef<THREE.Group>(null);
//   const [hoverCount, setHoverCount] = useState(0);
//   const hoverOver = () => setHoverCount((prev) => prev + 1);
//   const hoverOut = () => setHoverCount((prev) => Math.max(0, prev - 1));

//   useFrame(() => {
//     if (groupRef.current) {
//       const baseSpeed = hoverCount > 0 ? 0.0002 : 0.001;
//       const polarAngle = controls.current?.getPolarAngle() || 0;
//       const sign = polarAngle > Math.PI / 2 ? -1 : 1;
//       groupRef.current.rotation.y += sign * baseSpeed;
//     }
//   });

//   const points = useMemo(() => {
//     const radius = 3;
//     return pointsOnSphere(60, radius);
//   }, []);

//   return (
//     <group ref={groupRef}>
//       {points.map((point, i) => {
//         const isSpecial = i % 4 === 0;
//         return (
//           <React.Fragment key={i}>
//             <line>
//               <bufferGeometry attach="geometry">
//                 <bufferAttribute
//                   attach="attributes-position"
//                   args={[
//                     new Float32Array([0, 0, 0, point.x, point.y, point.z]),
//                     3,
//                   ]}
//                   count={2}
//                   array={new Float32Array([0, 0, 0, point.x, point.y, point.z])}
//                   itemSize={3}
//                 />
//               </bufferGeometry>
//               <lineBasicMaterial attach="material" color="#333333" />
//             </line>
//             {isSpecial ? (
//               <SpecialBox
//                 position={point}
//                 text={MOON_PHRASES[Math.floor(i / 4) % MOON_PHRASES.length]}
//                 hoverOver={hoverOver}
//                 hoverOut={hoverOut}
//               />
//             ) : (
//               <mesh position={point}>
//                 <boxGeometry args={[0.02, 0.02, 0.02]} />
//                 <meshBasicMaterial color="gray" />
//               </mesh>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </group>
//   );
// };

// const StarburstAnimation: React.FC = () => {
//   const controlsRef = useRef<OrbitControlsImpl>(null);

//   return (
//     <Canvas style={{ background: "0 0% 4%", maxHeight: "100vh" }}>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       <Starburst controls={controlsRef} />
//       <OrbitControls
//         ref={controlsRef}
//         enableZoom={false}
//         autoRotate
//         autoRotateSpeed={0.01}
//         enablePan={false}
//       />
//     </Canvas>
//   );
// };

// export default StarburstAnimation;

// add moon texture
// "use client";

// import React, { useRef, useMemo, useState } from "react";
// import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// import { OrbitControls, Html } from "@react-three/drei";
// import * as THREE from "three";
// import { TextureLoader } from "three";
// import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// const MOON_PHRASES = [
//   "Lunar Whisper",
//   "Sea of Tranquility",
//   "Celestial Tide",
//   "Moonlit Orbit",
//   "Dust of the Mare",
//   "Cratered Silence",
//   "Silver Crescent",
//   "Gravity's Dance",
//   "Starlit Far Side",
//   "Eternal Nightfall",
//   "Cosmic Lullaby",
//   "Apollo Echo",
//   "Night's Lantern",
//   "Orbiting Memory",
//   "Meteor Showered Sky",
// ];
// const pointsOnSphere = (num: number, radius: number): THREE.Vector3[] => {
//   const points: THREE.Vector3[] = [];
//   const offset = 2 / num;
//   const increment = Math.PI * (3 - Math.sqrt(5));
//   for (let i = 0; i < num; i++) {
//     const y = i * offset - 1 + offset / 2;
//     const distance = Math.sqrt(1 - Math.pow(y, 2));
//     const theta = i * increment;
//     const x = Math.cos(theta) * distance;
//     const z = Math.sin(theta) * distance;
//     points.push(new THREE.Vector3(x, y, z).multiplyScalar(radius));
//   }
//   return points;
// };

// interface SpecialSphereProps {
//   position: THREE.Vector3;
//   text: string;
//   hoverOver: () => void;
//   hoverOut: () => void;
//   texture: THREE.Texture;
// }

// const SpecialSphere: React.FC<SpecialSphereProps> = ({
//   position,
//   text,
//   hoverOver,
//   hoverOut,
//   texture,
// }) => {
//   const [hovered, setHovered] = useState(false);
//   const meshRef = useRef<THREE.Mesh | null>(null);
//   const hitAreaRef = useRef<THREE.Mesh | null>(null);

//   // Persisted vectors so they are NOT recreated on every render
//   const currentScale = useRef(new THREE.Vector3(1, 1, 1));
//   const targetScale = useRef(1);
//   const targetVec = useRef(new THREE.Vector3(1, 1, 1));

//   const radius = 0.04;
//   const hitRadius = 0.08;

//   // Update target when hovered changes
//   React.useEffect(() => {
//     targetScale.current = hovered ? 1.2 : 1;
//     targetVec.current.set(
//       targetScale.current,
//       targetScale.current,
//       targetScale.current
//     );
//   }, [hovered]);

//   // Smoothly interpolate every frame (works for both hover in & out)
//   useFrame(() => {
//     if (meshRef.current) {
//       // 0.08 = smoothing factor (0 = no change, 1 = immediate). Tweak to taste (0.02 - 0.2).
//       currentScale.current.lerp(targetVec.current, 0.08);
//       meshRef.current.scale.copy(currentScale.current);
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh
//         ref={hitAreaRef}
//         visible={false}
//         onPointerOver={(e) => {
//           e.stopPropagation();
//           setHovered(true);
//           hoverOver();
//         }}
//         onPointerOut={(e) => {
//           e.stopPropagation();
//           setHovered(false);
//           hoverOut();
//         }}
//       >
//         <sphereGeometry args={[hitRadius, 32, 32]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>

//       <mesh ref={meshRef}>
//         <sphereGeometry args={[radius, 32, 32]} />
//         <meshStandardMaterial map={texture} />
//       </mesh>

//       <Html
//         position={[0, radius + 0.03, 0]}
//         style={{
//           color: "white",
//           background: "0 0% 4%",
//           padding: "5px",
//           borderRadius: "5px",
//           whiteSpace: "nowrap",
//           opacity: hovered ? 1 : 0,
//           transition: "opacity 0.25s ease",
//           textTransform: "uppercase",
//           fontSize: "0.8rem",
//           fontFamily: "monospace",
//           // fontFamily: var(--font-geist-mono),
//           pointerEvents: "none",
//           transform: "translateX(-50%) translateY(-35px)",
//           left: "50%",
//           position: "absolute",
//         }}
//       >
//         {text}
//       </Html>
//     </group>
//   );
// };

// interface StarburstProps {
//   controls: React.RefObject<OrbitControlsImpl | null>;
//   onHoverChange: (hovered: boolean) => void;
// }

// const Starburst: React.FC<StarburstProps> = ({ controls, onHoverChange }) => {
//   const groupRef = useRef<THREE.Group>(null);
//   const [hoverCount, setHoverCount] = useState(0);
//   const hoverOver = () => {
//     setHoverCount((prev) => {
//       const newCount = prev + 1;
//       if (newCount > 0) onHoverChange(true);
//       return newCount;
//     });
//   };
//   const hoverOut = () => {
//     setHoverCount((prev) => {
//       const newCount = Math.max(0, prev - 1);
//       if (newCount === 0) onHoverChange(false);
//       return newCount;
//     });
//   };

//   useFrame(() => {
//     if (groupRef.current) {
//       const baseSpeed = hoverCount > 0 ? 0 : 0.001;
//       const polarAngle = controls.current?.getPolarAngle() || 0;
//       const sign = polarAngle > Math.PI / 2 ? -1 : 1;
//       groupRef.current.rotation.y += sign * baseSpeed;
//     }
//   });

//   const points = useMemo(() => {
//     const radius = 3;
//     return pointsOnSphere(60, radius);
//   }, []);

//   const texture = useLoader(TextureLoader, "/textures/moon-texture.jpg");

//   return (
//     <group ref={groupRef}>
//       {points.map((point, i) => {
//         const isSpecial = i % 4 === 0;
//         return (
//           <React.Fragment key={i}>
//             <line>
//               <bufferGeometry attach="geometry">
//                 <bufferAttribute
//                   attach="attributes-position"
//                   args={[
//                     new Float32Array([0, 0, 0, point.x, point.y, point.z]),
//                     3,
//                   ]}
//                   count={2}
//                   array={new Float32Array([0, 0, 0, point.x, point.y, point.z])}
//                   itemSize={3}
//                 />
//               </bufferGeometry>
//               <lineBasicMaterial attach="material" color="#333333" />
//             </line>
//             {isSpecial ? (
//               <SpecialSphere
//                 position={point}
//                 text={MOON_PHRASES[Math.floor(i / 4) % MOON_PHRASES.length]}
//                 hoverOver={hoverOver}
//                 hoverOut={hoverOut}
//                 texture={texture}
//               />
//             ) : (
//               <mesh position={point}>
//                 <sphereGeometry args={[0.03, 32, 32]} />
//                 <meshStandardMaterial color="gray" />
//               </mesh>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </group>
//   );
// };

// const StarburstAnimation: React.FC = () => {
//   const controlsRef = useRef<OrbitControlsImpl>(null);
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Canvas style={{ background: "0 0% 4%", maxHeight: "100vh" }}>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       <Starburst controls={controlsRef} onHoverChange={setIsHovered} />
//       <OrbitControls
//         ref={controlsRef}
//         enableZoom={false}
//         autoRotate={!isHovered}
//         autoRotateSpeed={0.01}
//         enablePan={false}
//       />
//     </Canvas>
//   );
// };

// export default StarburstAnimation;

"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const MOON_PHRASES = [
  "Lunar Whisper",
  "Sea of Tranquility",
  "Celestial Tide",
  "Moonlit Orbit",
  "Dust of the Mare",
  "Cratered Silence",
  "Silver Crescent",
  "Gravity's Dance",
  "Starlit Far Side",
  "Eternal Nightfall",
  "Cosmic Lullaby",
  "Apollo Echo",
  "Night's Lantern",
  "Orbiting Memory",
  "Meteor Showered Sky",
];
const pointsOnSphere = (num: number, radius: number): THREE.Vector3[] => {
  const points: THREE.Vector3[] = [];
  const offset = 2 / num;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < num; i++) {
    const y = i * offset - 1 + offset / 2;
    const distance = Math.sqrt(1 - Math.pow(y, 2));
    const theta = i * increment;
    const x = Math.cos(theta) * distance;
    const z = Math.sin(theta) * distance;
    points.push(new THREE.Vector3(x, y, z).multiplyScalar(radius));
  }
  return points;
};

interface SpecialSphereProps {
  position: THREE.Vector3;
  text: string;
  hoverOver: () => void;
  hoverOut: () => void;
  texture: THREE.Texture;
  isMobile: boolean;
}

const SpecialSphere: React.FC<SpecialSphereProps> = ({
  position,
  text,
  hoverOver,
  hoverOut,
  texture,
  isMobile,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const hitAreaRef = useRef<THREE.Mesh | null>(null);

  // Persisted vectors so they are NOT recreated on every render
  const currentScale = useRef(new THREE.Vector3(1, 1, 1));
  const targetScale = useRef(1);
  const targetVec = useRef(new THREE.Vector3(1, 1, 1));

  const radius = isMobile ? 0.05 : 0.04;
  const hitRadius = isMobile ? 0.12 : 0.08;

  // Update target when hovered changes
  React.useEffect(() => {
    targetScale.current = hovered ? 1.2 : 1;
    targetVec.current.set(
      targetScale.current,
      targetScale.current,
      targetScale.current
    );
  }, [hovered]);

  // Smoothly interpolate every frame (works for both hover in & out)
  useFrame(() => {
    if (meshRef.current) {
      // 0.08 = smoothing factor (0 = no change, 1 = immediate). Tweak to taste (0.02 - 0.2).
      currentScale.current.lerp(targetVec.current, 0.08);
      meshRef.current.scale.copy(currentScale.current);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={hitAreaRef}
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          hoverOver();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          hoverOut();
        }}
        onPointerDown={(e) => {
          if (isMobile) {
            e.stopPropagation();
            setHovered(true);
            hoverOver();
          }
        }}
        onPointerUp={(e) => {
          if (isMobile) {
            e.stopPropagation();
            setHovered(false);
            hoverOut();
          }
        }}
      >
        <sphereGeometry args={[hitRadius, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      <Html
        position={[0, radius + 0.03, 0]}
        style={{
          color: "white",
          background: "0 0% 4%",
          padding: "5px",
          borderRadius: "5px",
          whiteSpace: "nowrap",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          textTransform: "uppercase",
          fontSize: isMobile ? "0.7rem" : "0.8rem",
          fontFamily: "monospace",
          // fontFamily: var(--font-geist-mono),
          pointerEvents: "none",
          transform: "translateX(-50%) translateY(-35px)",
          left: "50%",
          position: "absolute",
        }}
      >
        {text}
      </Html>
    </group>
  );
};

interface StarburstProps {
  controls: React.RefObject<OrbitControlsImpl | null>;
  onHoverChange: (hovered: boolean) => void;
  isMobile: boolean;
}

const Starburst: React.FC<StarburstProps> = ({
  controls,
  onHoverChange,
  isMobile,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoverCount, setHoverCount] = useState(0);
  const hoverOver = () => {
    setHoverCount((prev) => {
      const newCount = prev + 1;
      if (newCount > 0) onHoverChange(true);
      return newCount;
    });
  };
  const hoverOut = () => {
    setHoverCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) onHoverChange(false);
      return newCount;
    });
  };

  useFrame(() => {
    if (groupRef.current) {
      const baseSpeed = hoverCount > 0 ? 0 : 0.001;
      const polarAngle = controls.current?.getPolarAngle() || 0;
      const sign = polarAngle > Math.PI / 2 ? -1 : 1;
      groupRef.current.rotation.y += sign * baseSpeed;
    }
  });

  const points = useMemo(() => {
    const radius = 3;
    return pointsOnSphere(60, radius);
  }, []);

  const texture = useLoader(TextureLoader, "/textures/moon-texture.jpg");

  const nonSpecialRadius = isMobile ? 0.04 : 0.03;

  return (
    <group ref={groupRef}>
      {points.map((point, i) => {
        const isSpecial = i % 4 === 0;
        return (
          <React.Fragment key={i}>
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([0, 0, 0, point.x, point.y, point.z]),
                    3,
                  ]}
                  count={2}
                  array={new Float32Array([0, 0, 0, point.x, point.y, point.z])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="#333333" />
            </line>
            {isSpecial ? (
              <SpecialSphere
                position={point}
                text={MOON_PHRASES[Math.floor(i / 4) % MOON_PHRASES.length]}
                hoverOver={hoverOver}
                hoverOut={hoverOut}
                texture={texture}
                isMobile={isMobile}
              />
            ) : (
              <mesh position={point}>
                <sphereGeometry args={[nonSpecialRadius, 32, 32]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            )}
          </React.Fragment>
        );
      })}
    </group>
  );
};

const StarburstAnimation: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMemo(
    () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    []
  );

  return (
    <Canvas
      style={{
        overflow: "visible",
        background: "0 0% 4%",
        maxHeight: "100vh",
        touchAction: "pan-y",
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Starburst
        controls={controlsRef}
        onHoverChange={setIsHovered}
        isMobile={isMobile}
      />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        autoRotate={!isHovered}
        autoRotateSpeed={0.01}
        enablePan={false}
        enableRotate={!isMobile}
      />
    </Canvas>
  );
};

export default StarburstAnimation;
