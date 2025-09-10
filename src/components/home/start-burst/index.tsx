// import React from "react";
// import StarburstAnimation from "../feature-animation";

// function StarBurst() {
//   return (
//     <div className="relative flex justify-center overflow-hidden pb-24">
//       <div className="relative h-[600px] lg:h-[1000px] xl:h-[1200px]">
//         <div className="absolute left-1/2 top-28 lg:top-56 size-[600px] -translate-x-1/2 lg:size-[1000px] xl:size-[1200px] [&>canvas]:!h-full [&>canvas]:!w-full">
//           <StarburstAnimation />
//         </div>
//       </div>
//       <div className="pointer-events-none absolute inset-6 flex flex-col justify-center">
//         <div className="mx-auto flex w-full max-w-7xl">
//           <div className="from-secondary to-primary inline-block text-balance bg-gradient-to-l bg-clip-text py-2 text-4xl leading-[2.25rem] tracking-tight text-transparent md:text-[5rem] md:leading-[5rem]">
//             Understand
//           </div>
//         </div>
//         <div className="mx-auto flex w-full max-w-7xl justify-end">
//           <div className="from-secondary to-primary inline-block text-balance bg-gradient-to-r bg-clip-text py-2 text-4xl leading-[2.25rem] tracking-tight text-transparent md:text-[5rem] md:leading-[5rem]">
//             The Universe
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StarBurst;
"use client";
import React, { useEffect, useRef } from "react";
import StarburstAnimation from "../feature-animation";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export default function StarBurst() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const maxOffset = 120; // how many px the lines can move (increase if you want more)
  const scrollFactor = 0.22; // multiplier for how strongly the section's offset affects translation

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerOffset =
        window.innerHeight / 2 - (rect.top + rect.height / 2);

      const tx = clamp(centerOffset * scrollFactor, -maxOffset, maxOffset);

      if (leftRef.current) {
        leftRef.current.style.transform = `translateX(${-tx}px)`;
        leftRef.current.style.willChange = "transform";
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translateX(${tx}px)`;
        rightRef.current.style.willChange = "transform";
      }
    };

    const loop = () => {
      update();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => update();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [maxOffset, scrollFactor]);

  return (
    <div
      className="relative flex justify-center overflow-hidden pb-24"
      ref={containerRef}
    >
      <div className="relative h-[600px] lg:h-[1000px] xl:h-[1200px] w-full">
        <div className="absolute left-1/2 top-28 lg:top-56 size-[400px] -translate-x-1/2 lg:size-[1000px] xl:size-[1200px] [&>canvas]:!h-full [&>canvas]:!w-full">
          <StarburstAnimation />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-6 flex flex-col justify-center">
        <div className="mx-auto flex w-full max-w-7xl">
          <div
            ref={leftRef}
            className="from-secondary to-primary inline-block text-balance bg-gradient-to-l bg-clip-text py-2 text-4xl leading-[2.25rem] tracking-tight text-transparent md:text-[5rem] md:leading-[5rem] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(0px)`, willChange: "transform" }}
          >
            Understand
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-7xl justify-end">
          <div
            ref={rightRef}
            className="from-secondary to-primary inline-block text-balance bg-gradient-to-r bg-clip-text py-2 text-4xl leading-[2.25rem] tracking-tight text-transparent md:text-[5rem] md:leading-[5rem] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(0px)`, willChange: "transform" }}
          >
            The Universe
          </div>
        </div>
      </div>
    </div>
  );
}
