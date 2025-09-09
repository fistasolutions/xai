// "use client";

// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const BurgerMenu = () => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const burgerRef = useRef<HTMLDivElement | null>(null);
//   const burgerTopRef = useRef<HTMLSpanElement | null>(null);
//   const burgerMidRef = useRef<HTMLSpanElement | null>(null);
//   const burgerBotRef = useRef<HTMLSpanElement | null>(null);
//   const sidebarRef = useRef<HTMLDivElement | null>(null);
//   const sideTextRefs = useRef<HTMLLIElement[]>([]);

//   useEffect(() => {
//     const tl = gsap.timeline({
//       paused: true,
//       reversed: true,
//     });

//     tl.to(burgerTopRef.current, { y: 11, duration: 0.7, ease: "power1.inOut" })
//       .to(
//         burgerBotRef.current,
//         { y: -11, duration: 0.7, ease: "power1.inOut" },
//         "-=0.7"
//       )
//       .to(burgerTopRef.current, { rotation: 585, duration: 0.5 })
//       .to(burgerMidRef.current, { rotation: 585, duration: 0.5 }, "-=0.5")
//       .to(burgerBotRef.current, { rotation: 675, duration: 0.5 }, "-=0.5")
//       .to(burgerRef.current, { translateX: 350 })
//       .to(
//         [burgerTopRef.current, burgerMidRef.current, burgerBotRef.current],
//         { borderColor: "#ffffff", duration: 0.1, ease: "power1.out" },
//         "-=1"
//       )
//       .to(
//         sidebarRef.current,
//         { x: 550, duration: 1, ease: "power2.out" },
//         "-=1"
//       );

//     tlRef.current = tl;
//   }, []);

//   const haminate = () => {
//     if (tlRef.current) {
//       tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
//     }
//   };

//   const addToSideTextRefs = (el: HTMLLIElement | null) => {
//     if (el && !sideTextRefs.current.includes(el)) {
//       sideTextRefs.current.push(el);
//     }
//   };

//   return (
//     <>
//       <div className="w-full h-96 mx-auto overflow-hidden z-50 absolute">
//         <div className="relative w-36 h-8 mx-auto mt-8 -ml-16 text-gray-600 uppercase z-50">
//           <div
//             ref={burgerRef}
//             className="absolute left-24 w-10 h-8 cursor-pointer"
//             onClick={haminate}
//           >
//             <span ref={burgerTopRef} className="burger-menu-piece mt-0"></span>
//             <span
//               ref={burgerMidRef}
//               className="burger-menu-piece mt-[5px]"
//             ></span>
//             <span
//               ref={burgerBotRef}
//               className="burger-menu-piece mt-[5px]"
//             ></span>
//           </div>
//         </div>

//         <div ref={sidebarRef} className="sidebar mt-[-60px]">
//           <div className="mt-24 ml-10 lg:ml-20">
//             <li className="sidetext font-sans list-none text-6xl mb-5 text-left font-bold cursor-pointer min-w-full">
//               Home
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="sidetext font-sans list-none text-6xl mb-5 text-left font-bold cursor-pointer min-w-full"
//             >
//               About
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="sidetext font-sans list-none text-6xl mb-5 text-left font-bold cursor-pointer min-w-full"
//             >
//               Shop
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="sidetext font-sans list-none text-6xl mb-5 text-left font-bold cursor-pointer min-w-full"
//             >
//               Contact
//             </li>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BurgerMenu;

// "use client";
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const BurgerMenu = () => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const burgerRef = useRef<HTMLDivElement | null>(null);
//   const burgerTopRef = useRef<HTMLSpanElement | null>(null);
//   const burgerMidRef = useRef<HTMLSpanElement | null>(null);
//   const burgerBotRef = useRef<HTMLSpanElement | null>(null);
//   const sidebarRef = useRef<HTMLDivElement | null>(null);
//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const sideTextRefs = useRef<HTMLLIElement[]>([]);

//   useEffect(() => {
//     const tl = gsap.timeline({
//       paused: true,
//       reversed: true,
//     });

//     tl.to(burgerTopRef.current, {
//       y: 11,
//       duration: 0.7,
//       ease: "power1.inOut",
//     })
//       .to(
//         burgerBotRef.current,
//         {
//           y: -11,
//           duration: 0.7,
//           ease: "power1.inOut",
//         },
//         "-=0.7"
//       )
//       .to(burgerTopRef.current, {
//         rotation: 585,
//         duration: 0.5,
//       })
//       .to(
//         burgerMidRef.current,
//         {
//           rotation: 585,
//           duration: 0.5,
//         },
//         "-=0.5"
//       )
//       .to(
//         burgerBotRef.current,
//         {
//           rotation: 675,
//           duration: 0.5,
//         },
//         "-=0.5"
//       )
//       .to(burgerRef.current, {
//         translateX: 350,
//       })
//       .to(
//         [burgerTopRef.current, burgerMidRef.current, burgerBotRef.current],
//         {
//           borderColor: "#ffffff",
//           duration: 0.1,
//           ease: "power1.out",
//         },
//         "-=1"
//       )
//       // Add overlay animation
//       .to(
//         overlayRef.current,
//         {
//           opacity: 1,
//           duration: 0.5,
//           ease: "power2.out",
//         },
//         "-=1"
//       )
//       .to(
//         sidebarRef.current,
//         {
//           x: 550,
//           duration: 1,
//           ease: "power2.out",
//         },
//         "-=0.8"
//       );

//     tlRef.current = tl;
//   }, []);

//   const haminate = () => {
//     if (tlRef.current) {
//       tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
//     }
//   };

//   const addToSideTextRefs = (el: HTMLLIElement | null) => {
//     if (el && !sideTextRefs.current.includes(el)) {
//       sideTextRefs.current.push(el);
//     }
//   };

//   return (
//     <>
//       {/* Transparent overlay */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-white/70  opacity-0 z-40 pointer-events-none"
//       />

//       <div className="w-full mb-4 ml-6 rounded-3xl mt-4 h-full mx-auto overflow-hidden z-50 absolute">
//         <div className="relative w-36 h-8 mx-auto mt-8 -ml-16 text-gray-600 uppercase z-50">
//           <div
//             ref={burgerRef}
//             className="absolute left-24 w-10 h-8 cursor-pointer"
//             onClick={haminate}
//           >
//             <span ref={burgerTopRef} className="burger-menu-piece mt-0"></span>
//             <span
//               ref={burgerMidRef}
//               className="burger-menu-piece mt-[5px]"
//             ></span>
//             <span
//               ref={burgerBotRef}
//               className="burger-menu-piece mt-[5px]"
//             ></span>
//           </div>
//         </div>

//         <div ref={sidebarRef} className="sidebar">
//           {/* Added margins from all sides: top (mt-8), left (ml-8), bottom (mb-8), and proper spacing */}
//           <div className="mt-8 ml-8 mr-4 mb-8  overflow-y-auto">
//             <li className="sidetext font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full">
//               Home
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="sidetext font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full"
//             >
//               About
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="sidetext font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full"
//             >
//               Shop
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="sidetext font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full"
//             >
//               Contact
//             </li>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BurgerMenu;
// "use client";
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const BurgerMenu = () => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const burgerRef = useRef<HTMLDivElement | null>(null);
//   const burgerTopRef = useRef<HTMLSpanElement | null>(null);
//   const burgerMidRef = useRef<HTMLSpanElement | null>(null);
//   const burgerBotRef = useRef<HTMLSpanElement | null>(null);
//   const sidebarRef = useRef<HTMLDivElement | null>(null);
//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const sideTextRefs = useRef<HTMLLIElement[]>([]);

//   useEffect(() => {
//     const tl = gsap.timeline({
//       paused: true,
//       reversed: true,
//     });

//     tl.to(burgerTopRef.current, {
//       y: 11,
//       duration: 0.7,
//       ease: "power1.inOut",
//     })
//       .to(
//         burgerBotRef.current,
//         {
//           y: -11,
//           duration: 0.7,
//           ease: "power1.inOut",
//         },
//         "-=0.7"
//       )
//       .to(burgerTopRef.current, {
//         rotation: 585,
//         duration: 0.5,
//       })
//       .to(
//         burgerMidRef.current,
//         {
//           rotation: 585,
//           duration: 0.5,
//         },
//         "-=0.5"
//       )
//       .to(
//         burgerBotRef.current,
//         {
//           rotation: 675,
//           duration: 0.5,
//         },
//         "-=0.5"
//       )
//       .to(burgerRef.current, {
//         translateX: 350,
//       })
//       .to(
//         [burgerTopRef.current, burgerMidRef.current, burgerBotRef.current],
//         {
//           borderColor: "#ffffff",
//           duration: 0.1,
//           ease: "power1.out",
//         },
//         "-=1"
//       )
//       // Add overlay animation
//       .to(
//         overlayRef.current,
//         {
//           opacity: 1,
//           duration: 0.5,
//           ease: "power2.out",
//         },
//         "-=1"
//       )
//       .to(
//         sidebarRef.current,
//         {
//           x: 550,
//           duration: 1,
//           ease: "power2.out",
//         },
//         "-=0.8"
//       );

//     tlRef.current = tl;
//   }, []);

//   const haminate = () => {
//     if (tlRef.current) {
//       tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
//     }
//   };

//   const addToSideTextRefs = (el: HTMLLIElement | null) => {
//     if (el && !sideTextRefs.current.includes(el)) {
//       sideTextRefs.current.push(el);
//     }
//   };

//   return (
//     <>
//       {/* Transparent overlay */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-white/70 opacity-0 z-40 pointer-events-none"
//       />

//       <div className="w-full mb-4 mt-8 ml-6 rounded-3xl h-full mx-auto overflow-hidden z-50 absolute">
//         <div className="absolute mt-8">
//           <div className="relative w-36 h-8 mx-auto -ml-16 text-gray-600 uppercase z-50 ">
//             <div
//               ref={burgerRef}
//               className="absolute left-24 w-10 h-8 cursor-pointer z-60"
//               onClick={haminate}
//             >
//               {/* burger-menu-piece styles converted to Tailwind */}
//               <span
//                 ref={burgerTopRef}
//                 className="block relative w-10 border-t-[6px] border-blue-500 mt-0"
//               ></span>
//               <span
//                 ref={burgerMidRef}
//                 className="block relative w-10 border-t-[6px] border-blue-500 mt-[5px]"
//               ></span>
//               <span
//                 ref={burgerBotRef}
//                 className="block relative w-10 border-t-[6px] border-blue-500 mt-[5px]"
//               ></span>
//             </div>
//           </div>
//         </div>

//         {/* sidebar styles converted to Tailwind */}
//         <div
//           ref={sidebarRef}
//           className="bg-black w-[max(250px,35%)] fixed -ml-[550px]"
//         >
//           {/* Added margins from all sides: top (mt-8), left (ml-8), bottom (mb-8), and proper spacing */}
//           <div className="mt-8 ml-8 mr-4 mb-8 overflow-y-auto">
//             {/* sidetext styles converted to Tailwind */}
//             <li className="opacity-100 text-white transition-all duration-1000 ease-in-out font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full">
//               Home
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="opacity-100 text-white transition-all duration-1000 ease-in-out font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full"
//             >
//               About
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="opacity-100 text-white transition-all duration-1000 ease-in-out font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full"
//             >
//               Shop
//             </li>
//             <li
//               ref={addToSideTextRefs}
//               className="opacity-100 text-white transition-all duration-1000 ease-in-out font-sans list-none text-6xl mb-8 text-left font-bold cursor-pointer min-w-full"
//             >
//               Contact
//             </li>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BurgerMenu;
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

// const BurgerMenu = () => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const burgerRef = useRef<HTMLDivElement | null>(null);
//   const burgerTopRef = useRef<HTMLSpanElement | null>(null);
//   const burgerMidRef = useRef<HTMLSpanElement | null>(null);
//   const burgerBotRef = useRef<HTMLSpanElement | null>(null);
//   const sidebarRef = useRef<HTMLDivElement | null>(null);
//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const sideTextRefs = useRef<HTMLLIElement[]>([]);
//   const textsRef = useRef<string[]>([]);
//   const [active, setActive] = useState("STORY");

//   useEffect(() => {
//     gsap.registerPlugin(ScrambleTextPlugin);

//     const tl = gsap.timeline({
//       paused: true,
//       reversed: true,
//     });

//     tl.to(burgerTopRef.current, {
//       y: 11,
//       duration: 0.7,
//       ease: "power1.inOut",
//     })
//       .to(
//         burgerBotRef.current,
//         {
//           y: -11,
//           duration: 0.7,
//           ease: "power1.inOut",
//         },
//         "-=0.7"
//       )
//       .to(burgerTopRef.current, {
//         rotation: 585,
//         duration: 0.5,
//       })
//       .to(
//         burgerMidRef.current,
//         {
//           rotation: 585,
//           duration: 0.5,
//         },
//         "-=0.5"
//       )
//       .to(
//         burgerBotRef.current,
//         {
//           rotation: 675,
//           duration: 0.5,
//         },
//         "-=0.5"
//       )
//       .to(burgerRef.current, {
//         translateX: 350,
//       })
//       .to(
//         [burgerTopRef.current, burgerMidRef.current, burgerBotRef.current],
//         {
//           borderColor: "#ffffff",
//           duration: 0.1,
//           ease: "power1.out",
//         },
//         "-=1"
//       )
//       // Add overlay animation
//       .to(
//         overlayRef.current,
//         {
//           opacity: 1,
//           duration: 0.5,
//           ease: "power2.out",
//         },
//         "-=1"
//       )
//       .to(
//         sidebarRef.current,
//         {
//           x: 550,
//           duration: 1,
//           ease: "power2.out",
//         },
//         "-=0.8"
//       )
//       .set(sideTextRefs.current, { text: "" })
//       .to(
//         sideTextRefs.current,
//         {
//           duration: 0.8,
//           scrambleText: {
//             text: (i) => textsRef.current[i],
//             chars: "upperCase",
//             revealDelay: 0.3,
//             speed: 0.4,
//           },
//           stagger: 0.1,
//         },
//         "-=0.5"
//       );

//     tlRef.current = tl;

//     textsRef.current = sideTextRefs.current.map((el) => el.textContent || "");
//   }, []);

//   const haminate = () => {
//     if (tlRef.current) {
//       tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
//     }
//   };

//   const addToSideTextRefs = (el: HTMLLIElement | null) => {
//     if (el && !sideTextRefs.current.includes(el)) {
//       sideTextRefs.current.push(el);
//     }
//   };

//   const handleHover = (e: React.MouseEvent<HTMLLIElement>) => {
//     const el = e.currentTarget;
//     const index = sideTextRefs.current.indexOf(el);
//     if (index !== -1 && active !== textsRef.current[index]) {
//       gsap.to(el, {
//         duration: 0.5,
//         overwrite: true,
//         scrambleText: {
//           text: textsRef.current[index],
//           chars: "upperCase",
//           revealDelay: 0.25,
//           speed: 0.8,
//         },
//       });
//     }
//   };

//   const menuItems = [
//     "STORY",
//     "PROTOCOL",
//     "JOURNAL",
//     "MEDIA",
//     "GALLERY",
//     "ABOUT",
//   ];

//   return (
//     <>
//       {/* Transparent overlay */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-white/70 opacity-0 z-40 pointer-events-none"
//       />

//       <div className="w-full mb-4 mt-8 ml-6 rounded-3xl h-full mx-auto overflow-hidden z-50 absolute">
//         <div className="absolute mt-8">
//           <div className="relative w-36 h-8 mx-auto -ml-16 text-gray-600 uppercase z-50 ">
//             <div
//               ref={burgerRef}
//               className="absolute left-24 w-10 h-8 cursor-pointer z-60"
//               onClick={haminate}
//             >
//               {/* burger-menu-piece styles converted to Tailwind */}
//               <span
//                 ref={burgerTopRef}
//                 className="block relative w-10 border-t-[6px] border-blue-500 mt-0"
//               ></span>
//               <span
//                 ref={burgerMidRef}
//                 className="block relative w-10 border-t-[6px] border-blue-500 mt-[5px]"
//               ></span>
//               <span
//                 ref={burgerBotRef}
//                 className="block relative w-10 border-t-[6px] border-blue-500 mt-[5px]"
//               ></span>
//             </div>
//           </div>
//         </div>

//         {/* sidebar styles converted to Tailwind */}
//         <div
//           ref={sidebarRef}
//           className="bg-black w-[max(250px,35%)] fixed -ml-[550px]"
//         >
//           {/* Added margins from all sides: top (mt-8), left (ml-8), bottom (mb-8), and proper spacing */}
//           <div className="mt-8 ml-8 mr-4 mb-8 overflow-y-auto relative">
//             {menuItems.map((item) => (
//               <li
//                 key={item}
//                 ref={addToSideTextRefs}
//                 className={` list-none text-5xl pl-2  pr-3 mb-4 text-left font-extrabold cursor-pointer w-fit opacity-100 transition-opacity duration-1000 ease-in-out ${
//                   active === item ? "active" : "inactive"
//                 }`}
//                 onClick={() => setActive(item)}
//                 onMouseEnter={handleHover}
//               >
//                 {item}
//               </li>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .active {
//           color: black;
//           position: relative;
//         }
//         .active::before {
//           content: "";
//           position: absolute;
//           inset: 0;
//           border-radius: 2px;
//           background: #bef264; /* lime-400 */
//           z-index: -1;
//           clip-path: polygon(
//             0 0,
//             100% 0,
//             100% calc(100% - 13px),
//             calc(100% - 13px) 100%,
//             0 100%,
//             0 0
//           );
//         }
//         .inactive {
//           color: white;
//         }
//         .inactive:hover {
//           color: black;
//           position: relative;
//         }
//         .inactive:hover::before {
//           content: "";
//           position: absolute;
//           inset: 0;
//           border-radius: 2px;
//           background: white;
//           z-index: -1;
//           clip-path: polygon(
//             0 0,
//             100% 0,
//             100% calc(100% - 13px),
//             calc(100% - 13px) 100%,
//             0 100%,
//             0 0
//           );
//         }
//       `}</style>
//     </>
//   );
// };

// export default BurgerMenu;

"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

const BurgerMenu = () => {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const burgerRef = useRef<HTMLDivElement | null>(null);
  const burgerTopRef = useRef<HTMLSpanElement | null>(null);
  const burgerMidRef = useRef<HTMLSpanElement | null>(null);
  const burgerBotRef = useRef<HTMLSpanElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sideTextRefs = useRef<HTMLLIElement[]>([]);
  const textsRef = useRef<string[]>([]);
  const [active, setActive] = useState("STORY");

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);

    textsRef.current = sideTextRefs.current.map((el) => el.textContent || "");

    const tl = gsap.timeline({
      paused: true,
      reversed: true,
    });

    tl.to(burgerTopRef.current, {
      y: 11,
      duration: 0.7,
      ease: "power1.inOut",
    })
      .to(
        burgerBotRef.current,
        {
          y: -11,
          duration: 0.7,
          ease: "power1.inOut",
        },
        "-=0.7"
      )
      .to(burgerTopRef.current, {
        rotation: 585,
        duration: 0.5,
      })
      .to(
        burgerMidRef.current,
        {
          rotation: 585,
          duration: 0.5,
        },
        "-=0.5"
      )
      .to(
        burgerBotRef.current,
        {
          rotation: 675,
          duration: 0.5,
        },
        "-=0.5"
      )
      .to(burgerRef.current, {
        translateX: 350,
      })
      .to(
        [burgerTopRef.current, burgerMidRef.current, burgerBotRef.current],
        {
          borderColor: "#ffffff",
          duration: 0.1,
          ease: "power1.out",
        },
        "-=1"
      )
      // Add overlay animation
      .to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=1"
      )
      .to(
        sidebarRef.current,
        {
          x: 550,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8"
      )
      .set(sideTextRefs.current, { text: "" });

    sideTextRefs.current.forEach((el, i) => {
      tl.to(
        el,
        {
          duration: 0.8,
          scrambleText: {
            text: textsRef.current[i],
            chars: "upperCase",
            revealDelay: 0.3,
            speed: 0.4,
          },
        },
        i === 0 ? "-=0.5" : "<0.1"
      );
    });

    tlRef.current = tl;
  }, []);

  const haminate = () => {
    if (tlRef.current) {
      tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
    }
  };

  const addToSideTextRefs = (el: HTMLLIElement | null) => {
    if (el && !sideTextRefs.current.includes(el)) {
      sideTextRefs.current.push(el);
    }
  };

  const handleHover = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    const index = sideTextRefs.current.indexOf(el);
    if (index !== -1 && active !== textsRef.current[index]) {
      gsap.to(el, {
        duration: 0.5,
        overwrite: true,
        scrambleText: {
          text: textsRef.current[index],
          chars: "upperCase",
          revealDelay: 0.25,
          speed: 0.8,
        },
      });
    }
  };

  const menuItems = ["HOME", "CONTACT", "PRICING", "BLOG", "ABOUT"];

  return (
    <>
      {/* Transparent overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-white/70 opacity-0 z-40 pointer-events-none"
      />

      <div className="w-full mb-4 mt-8 ml-6 rounded-3xl h-full mx-auto overflow-hidden z-50 absolute">
        <div className="absolute mt-8">
          <div className="relative w-36 h-8 mx-auto -ml-16 text-gray-600 uppercase z-50 ">
            <div
              ref={burgerRef}
              className="absolute left-24 w-10 h-8 cursor-pointer z-60"
              onClick={haminate}
            >
              {/* burger-menu-piece styles converted to Tailwind */}
              <span
                ref={burgerTopRef}
                className="block relative w-10 border-t-[6px] border-blue-500 mt-0"
              ></span>
              <span
                ref={burgerMidRef}
                className="block relative w-10 border-t-[6px] border-blue-500 mt-[5px]"
              ></span>
              <span
                ref={burgerBotRef}
                className="block relative w-10 border-t-[6px] border-blue-500 mt-[5px]"
              ></span>
            </div>
          </div>
        </div>

        {/* sidebar styles converted to Tailwind */}
        <div
          ref={sidebarRef}
          className="bg-black w-[max(250px,35%)] fixed -ml-[550px]"
        >
          {/* Added margins from all sides: top (mt-8), left (ml-8), bottom (mb-8), and proper spacing */}
          <div className="mt-8 ml-8 mr-4 mb-8 overflow-y-auto relative">
            {menuItems.map((item) => (
              <li
                key={item}
                ref={addToSideTextRefs}
                className={` list-none text-5xl pl-2  pr-3 mb-4 text-left font-extrabold cursor-pointer w-fit opacity-100 transition-opacity duration-1000 ease-in-out ${
                  active === item ? "active" : "inactive"
                }`}
                onClick={() => setActive(item)}
                onMouseEnter={handleHover}
              >
                {item}
              </li>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .active {
          color: black;
          position: relative;
        }
        .active::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 2px;
          background: #bef264; /* lime-400 */
          z-index: -1;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 13px),
            calc(100% - 13px) 100%,
            0 100%,
            0 0
          );
        }
        .inactive {
          color: white;
        }
        .inactive:hover {
          color: black;
          position: relative;
        }
        .inactive:hover::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 2px;
          background: white;
          z-index: -1;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 13px),
            calc(100% - 13px) 100%,
            0 100%,
            0 0
          );
        }
      `}</style>
    </>
  );
};

export default BurgerMenu;
