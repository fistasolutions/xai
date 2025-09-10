// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
// import ScrambleText from "../ui/scramble-text";

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

//     textsRef.current = sideTextRefs.current.map((el) => el.textContent || "");

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
//       .set(sideTextRefs.current, { text: "" });

//     sideTextRefs.current.forEach((el, i) => {
//       tl.to(
//         el,
//         {
//           duration: 0.8,
//           scrambleText: {
//             text: textsRef.current[i],
//             chars: "upperCase",
//             revealDelay: 0.3,
//             speed: 0.4,
//           },
//         },
//         i === 0 ? "-=0.5" : "<0.1"
//       );
//     });

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

//   const menuItems = ["HOME", "CONTACT", "PRICING", "BLOG", "ABOUT"];

//   return (
//     <>
//       {/* Transparent overlay */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-white/70 opacity-0 z-40 pointer-events-none"
//       />

//       <div className="w-full mb-4 mt-5 ml-5 rounded-3xl h-full mx-auto overflow-hidden z-50 absolute">
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

//         <div
//           ref={sidebarRef}
//           className="bg-black w-[max(250px,42%)] fixed -ml-[550px] flex"
//         >
//           <div className=" mt-8 ml-5 mr-4 mb-8 w-[15%] ">
//             <div className=" flex gap-3 items-center">
//               <div className="size-[5px] bg-white"></div>
//               <ScrambleText
//                 text="Discover"
//                 className="text-[8px] uppercase text-white font-medium"
//               />
//             </div>
//           </div>
//           <div className="mt-7 ml-8 mr-4 mb-7 overflow-y-auto relative">
//             {menuItems.map((item) => (
//               <li
//                 key={item}
//                 ref={addToSideTextRefs}
//                 className={` list-none text-2xl lg:text-6xl pl-2  pr-3 mb-3 text-left font-extrabold cursor-pointer w-fit opacity-100 transition-opacity duration-1000 ease-in-out ${
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

// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
// import ScrambleText from "../ui/scramble-text";

// const BurgerMenu = () => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const burgerRef = useRef<HTMLDivElement | null>(null);
//   const burgerTopRef = useRef<HTMLSpanElement | null>(null);
//   const burgerMidRef = useRef<HTMLSpanElement | null>(null);
//   const burgerBotRef = useRef<HTMLSpanElement | null>(null);
//   const sidebarRef = useRef<HTMLDivElement | null>(null);
//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const titleRefs = useRef<HTMLSpanElement[]>([]);
//   const pageRefs = useRef<HTMLSpanElement[]>([]);
//   const titleTexts = useRef<string[]>([]);
//   const [active, setActive] = useState("HOME");
//   const [isInitial, setIsInitial] = useState(true);

//   const menuData = [
//     { text: "HOME", page: "001" },
//     { text: "CONTACT", page: "002" },
//     { text: "PRICING", page: "003" },
//     { text: "BLOG", page: "004" },
//     { text: "ABOUT", page: "005" },
//   ];

//   const pageTexts = menuData.map((item) => `PAGE ${item.page}`);

//   useEffect(() => {
//     if (isInitial) {
//       setIsInitial(false);
//       return;
//     }

//     const newIndex = menuData.findIndex((item) => item.text === active);
//     if (newIndex !== -1) {
//       pageRefs.current.forEach((el, i) => {
//         if (i !== newIndex && el) {
//           gsap.to(el, { opacity: 0, duration: 0.2 });
//         }
//       });
//       const newPageEl = pageRefs.current[newIndex];
//       if (newPageEl) {
//         gsap.set(newPageEl, { text: "", opacity: 0 });
//         gsap.to(newPageEl, {
//           duration: 0.5,
//           opacity: 1,
//           scrambleText: {
//             text: pageTexts[newIndex],
//             chars: "upperCase",
//             revealDelay: 0.25,
//             speed: 0.8,
//           },
//         });
//       }
//     }
//   }, [active]);

//   useEffect(() => {
//     gsap.registerPlugin(ScrambleTextPlugin);

//     titleTexts.current = titleRefs.current.map((el) => el.textContent || "");

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
//       .set(titleRefs.current, { text: "" });

//     titleRefs.current.forEach((el, i) => {
//       tl.to(
//         el,
//         {
//           duration: 0.8,
//           scrambleText: {
//             text: titleTexts.current[i],
//             chars: "upperCase",
//             revealDelay: 0.3,
//             speed: 0.4,
//           },
//         },
//         i === 0 ? "-=0.5" : "<0.1"
//       );
//     });

//     // Initial active page scramble
//     const initialActiveIndex = menuData.findIndex(
//       (item) => item.text === active
//     );
//     if (initialActiveIndex !== -1 && pageRefs.current[initialActiveIndex]) {
//       tl.set(pageRefs.current[initialActiveIndex], { text: "", opacity: 0 }).to(
//         pageRefs.current[initialActiveIndex],
//         {
//           duration: 0.8,
//           opacity: 1,
//           scrambleText: {
//             text: pageTexts[initialActiveIndex],
//             chars: "upperCase",
//             revealDelay: 0.3,
//             speed: 0.4,
//           },
//         },
//         "-=0.5"
//       );
//     }

//     tlRef.current = tl;
//   }, []);

//   const haminate = () => {
//     if (tlRef.current) {
//       tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
//     }
//   };

//   const addToTitleRefs = (el: HTMLSpanElement | null) => {
//     if (el && !titleRefs.current.includes(el)) {
//       titleRefs.current.push(el);
//     }
//   };

//   const addToPageRefs = (el: HTMLSpanElement | null) => {
//     if (el && !pageRefs.current.includes(el)) {
//       pageRefs.current.push(el);
//     }
//   };

//   const handleHover = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
//     const titleEl = titleRefs.current[index];
//     if (titleEl && active !== menuData[index].text) {
//       gsap.to(titleEl, {
//         duration: 0.5,
//         overwrite: true,
//         scrambleText: {
//           text: titleTexts.current[index],
//           chars: "upperCase",
//           revealDelay: 0.25,
//           speed: 0.8,
//         },
//       });
//     }

//     if (active !== menuData[index].text) {
//       const pageEl = pageRefs.current[index];
//       if (pageEl) {
//         gsap.set(pageEl, { text: "", opacity: 0 });
//         gsap.to(pageEl, {
//           duration: 0.5,
//           opacity: 1,
//           scrambleText: {
//             text: pageTexts[index],
//             chars: "upperCase",
//             revealDelay: 0.25,
//             speed: 0.8,
//           },
//         });
//       }
//     }
//   };

//   const handleMouseLeave = (
//     e: React.MouseEvent<HTMLLIElement>,
//     index: number
//   ) => {
//     if (active !== menuData[index].text) {
//       const pageEl = pageRefs.current[index];
//       if (pageEl) {
//         gsap.to(pageEl, { opacity: 0, duration: 0.3 });
//       }
//     }
//   };

//   return (
//     <>
//       {/* Transparent overlay */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-white/70 opacity-0 z-40 pointer-events-none"
//       />

//       <div className="w-full mb-4 mt-5 ml-5 rounded-3xl h-full mx-auto overflow-hidden z-50 absolute">
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

//         <div
//           ref={sidebarRef}
//           className="bg-black w-[max(250px,42%)] fixed -ml-[550px] flex"
//         >
//           <div className=" mt-8 ml-5 mr-4 mb-8 w-[15%] ">
//             <div className=" flex gap-3 items-center">
//               <div className="size-[5px] bg-white"></div>
//               <ScrambleText
//                 text="Discover"
//                 className="text-[8px] uppercase text-white font-medium"
//               />
//             </div>
//           </div>
//           <div className="mt-7 ml-8 mr-4 mb-7 overflow-y-auto relative">
//             {menuData.map((item, index) => (
//               <li
//                 key={item.text}
//                 className={`list-none text-2xl lg:text-6xl pl-2 pr-3 mb-3 text-left font-extrabold cursor-pointer w-fit opacity-100 transition-opacity duration-1000 ease-in-out ${
//                   active === item.text ? "active" : "inactive"
//                 }`}
//                 onClick={() => setActive(item.text)}
//                 onMouseEnter={(e) => handleHover(e, index)}
//                 onMouseLeave={(e) => handleMouseLeave(e, index)}
//               >
//                 <span ref={addToTitleRefs} className="title inline-block">
//                   {item.text}
//                 </span>
//                 <span
//                   ref={addToPageRefs}
//                   className="page opacity-0 text-xs lg:text-sm ml-2 font-bold inline-block"
//                 >
//                   {`PAGE ${item.page}`}
//                 </span>
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
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
// import ScrambleText from "../ui/scramble-text";

// const BurgerMenu = () => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const burgerRef = useRef<HTMLDivElement | null>(null);
//   const burgerTopRef = useRef<HTMLSpanElement | null>(null);
//   const burgerMidRef = useRef<HTMLSpanElement | null>(null);
//   const burgerBotRef = useRef<HTMLSpanElement | null>(null);
//   const sidebarRef = useRef<HTMLDivElement | null>(null);
//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const titleRefs = useRef<HTMLSpanElement[]>([]);
//   const pageRefs = useRef<HTMLSpanElement[]>([]);
//   const titleTexts = useRef<string[]>([]);
//   const [active, setActive] = useState("STORY");
//   const [isInitial, setIsInitial] = useState(true);
//   const [hasOpened, setHasOpened] = useState(false);

//   const menuData = [
//     { text: "STORY", page: "001" },
//     { text: "HOME", page: "002" },
//     { text: "CONTACT", page: "003" },
//     { text: "PRICING", page: "004" },
//     { text: "BLOG", page: "005" },
//     { text: "ABOUT", page: "006" },
//   ];

//   const pageTexts = menuData.map((item) => `PAGE ${item.page}`);

//   useEffect(() => {
//     if (isInitial) {
//       setIsInitial(false);
//       return;
//     }

//     const newIndex = menuData.findIndex((item) => item.text === active);
//     if (newIndex !== -1) {
//       pageRefs.current.forEach((el, i) => {
//         if (i !== newIndex && el) {
//           gsap.to(el, { opacity: 0, duration: 0.2, overwrite: true });
//         }
//       });
//       const newPageEl = pageRefs.current[newIndex];
//       if (newPageEl) {
//         gsap.set(newPageEl, { text: "", opacity: 0 });
//         gsap.to(newPageEl, {
//           duration: 0.5,
//           opacity: 1,
//           scrambleText: {
//             text: pageTexts[newIndex],
//             chars: "upperCase",
//             revealDelay: 0.25,
//             speed: 0.8,
//           },
//           overwrite: true,
//         });
//       }
//     }
//   }, [active]);

//   useEffect(() => {
//     gsap.registerPlugin(ScrambleTextPlugin);

//     titleTexts.current = titleRefs.current.map((el) => el.textContent || "");

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
//       if (tlRef.current.reversed()) {
//         // opening
//         tlRef.current.play();
//         if (!hasOpened) {
//           gsap.set(titleRefs.current, { text: "" });
//           const numItems = menuData.length;
//           const staggerInterval = 0.7;
//           const firstDelay = tlRef.current.duration() - 0.5;
//           titleRefs.current.forEach((el, i) => {
//             const delay = firstDelay + i * staggerInterval;
//             gsap.to(el, {
//               delay,
//               duration: 0.8,
//               scrambleText: {
//                 text: titleTexts.current[i],
//                 chars: "upperCase",
//                 revealDelay: 0.3,
//                 speed: 0.4,
//               },
//             });
//           });

//           // initial page
//           const initialActiveIndex = menuData.findIndex(
//             (item) => item.text === active
//           );
//           if (initialActiveIndex !== -1) {
//             const pageEl = pageRefs.current[initialActiveIndex];
//             if (pageEl) {
//               gsap.set(pageEl, { text: "", opacity: 0 });
//               const lastDelay = firstDelay + (numItems - 1) * staggerInterval;
//               const pageDelay = lastDelay + 0.3;
//               gsap.to(pageEl, {
//                 delay: pageDelay,
//                 duration: 0.8,
//                 opacity: 1,
//                 scrambleText: {
//                   text: pageTexts[initialActiveIndex],
//                   chars: "upperCase",
//                   revealDelay: 0.3,
//                   speed: 0.4,
//                 },
//                 overwrite: true,
//               });
//             }
//           }
//           setHasOpened(true);
//         }
//       } else {
//         // closing
//         tlRef.current.reverse();
//       }
//     }
//   };

//   const addToTitleRefs = (el: HTMLSpanElement | null) => {
//     if (el && !titleRefs.current.includes(el)) {
//       titleRefs.current.push(el);
//     }
//   };

//   const addToPageRefs = (el: HTMLSpanElement | null) => {
//     if (el && !pageRefs.current.includes(el)) {
//       pageRefs.current.push(el);
//     }
//   };

//   const handleHover = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
//     const titleEl = titleRefs.current[index];
//     if (titleEl && active !== menuData[index].text) {
//       gsap.set(titleEl, { text: "" });
//       gsap.to(titleEl, {
//         duration: 0.5,
//         overwrite: true,
//         scrambleText: {
//           text: titleTexts.current[index],
//           chars: "upperCase",
//           revealDelay: 0.25,
//           speed: 0.8,
//         },
//       });
//     }

//     if (active !== menuData[index].text) {
//       const pageEl = pageRefs.current[index];
//       if (pageEl) {
//         gsap.set(pageEl, { text: "", opacity: 0 });
//         gsap.to(pageEl, {
//           duration: 0.5,
//           opacity: 1,
//           scrambleText: {
//             text: pageTexts[index],
//             chars: "upperCase",
//             revealDelay: 0.25,
//             speed: 0.8,
//           },
//           overwrite: true,
//         });
//       }
//     }
//   };

//   const handleMouseLeave = (
//     e: React.MouseEvent<HTMLLIElement>,
//     index: number
//   ) => {
//     if (active !== menuData[index].text) {
//       const pageEl = pageRefs.current[index];
//       if (pageEl) {
//         gsap.to(pageEl, { opacity: 0, duration: 0.3, overwrite: true });
//       }
//     }
//   };

//   return (
//     <>
//       {/* Transparent overlay */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-white/70 opacity-0 z-40 pointer-events-none"
//       />

//       <div className="w-full mb-4 mt-5 ml-5 rounded-3xl h-full mx-auto overflow-hidden z-50 absolute">
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

//         <div
//           ref={sidebarRef}
//           className="bg-black w-[max(250px,42%)] fixed -ml-[550px] flex"
//         >
//           <div className=" mt-8 ml-5 mr-4 mb-8 w-[15%] ">
//             <div className=" flex gap-3 items-center">
//               <div className="size-[5px] bg-white"></div>
//               <ScrambleText
//                 text="Discover"
//                 className="text-[8px] uppercase text-white font-medium"
//               />
//             </div>
//           </div>
//           <div className="mt-7 ml-8 mr-4 mb-7 overflow-y-auto relative">
//             {menuData.map((item, index) => (
//               <li
//                 key={item.text}
//                 className="list-none text-2xl flex items-start lg:text-6xl pl-2 pr-3 mb-3 text-left font-extrabold cursor-pointer w-fit opacity-100 transition-opacity duration-1000 ease-in-out text-white"
//                 onClick={() => setActive(item.text)}
//                 onMouseEnter={(e) => handleHover(e, index)}
//                 onMouseLeave={(e) => handleMouseLeave(e, index)}
//               >
//                 <span
//                   ref={addToTitleRefs}
//                   className={`title inline-block pl-1  pr-2 lg:pr-3 ${
//                     active === item.text ? "active" : "inactive"
//                   }`}
//                 >
//                   {item.text}
//                 </span>
//                 <span
//                   ref={addToPageRefs}
//                   className="page opacity-0 text-[8px] pt-1  ml-2 font-bold inline-block"
//                 >
//                   {`PAGE `}
//                   <br />
//                   {item.page}
//                 </span>
//               </li>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .title.inactive {
//           color: white;
//         }
//         li:hover .title.inactive {
//           color: black;
//           position: relative;
//         }
//         .title.active {
//           color: black;
//           position: relative;
//         }
//         .title.active::before {
//           content: "";
//           position: absolute;
//           inset: 0;
//           border-radius: 2px;
//           background: #bef264;
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
//         li:hover .title.inactive::before {
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

// speed up animation
"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

const BurgerMenu = () => {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  //   const burgerRef = useRef<HTMLDivElement | null>(null);
  const burgerTopRef = useRef<HTMLSpanElement | null>(null);
  const burgerMidRef = useRef<HTMLSpanElement | null>(null);
  const burgerBotRef = useRef<HTMLSpanElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const pageRefs = useRef<HTMLSpanElement[]>([]);
  const closeRef = useRef<HTMLDivElement | null>(null);
  const titleTexts = useRef<string[]>([]);
  const [active, setActive] = useState("HOME");
  const [isInitial, setIsInitial] = useState(true);
  const [hasOpened, setHasOpened] = useState(false);
  //   const widthsSet = useRef(false);

  const menuData = [
    { text: "HOME", page: "001" },
    { text: "CONTACT", page: "002" },
    { text: "PRICING", page: "003" },
    { text: "BLOG", page: "004" },
    { text: "ABOUT", page: "005" },
  ];

  const pageTexts = menuData.map((item) => `PAGE ${item.page}`);

  //   const setTitleWidths = () => {
  //     if (widthsSet.current) return;
  //     titleRefs.current.forEach((el) => {
  //       if (el && !el.style.width) {
  //         el.style.width = el.scrollWidth + 30 + "px";
  //       }
  //     });
  //     widthsSet.current = true;
  //   };

  //   useLayoutEffect(() => {
  //     setTitleWidths();
  //   }, []);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }

    const newIndex = menuData.findIndex((item) => item.text === active);
    if (newIndex !== -1) {
      pageRefs.current.forEach((el, i) => {
        if (i !== newIndex && el) {
          gsap.to(el, { opacity: 0, duration: 0.1, overwrite: true });
        }
      });
      const newPageEl = pageRefs.current[newIndex];
      if (newPageEl) {
        gsap.set(newPageEl, { text: "", opacity: 0 });
        gsap.to(newPageEl, {
          duration: 0.25,
          opacity: 1,
          scrambleText: {
            text: pageTexts[newIndex],
            chars: "upperCase",
            revealDelay: 0.125,
            speed: 1.6,
          },
          overwrite: true,
        });
      }
    }
  }, [active]);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);

    titleTexts.current = titleRefs.current.map((el) => el.textContent || "");

    const tl = gsap.timeline({
      paused: true,
      reversed: true,
    });

    tl.to(burgerTopRef.current, {
      y: 11,
      duration: 0.35,
      ease: "power1.inOut",
    })
      .to(
        burgerBotRef.current,
        {
          y: -11,
          duration: 0.35,
          ease: "power1.inOut",
        },
        "-=0.35"
      )
      .to(burgerTopRef.current, {
        rotation: 585,
        duration: 0.25,
      })
      .to(
        burgerMidRef.current,
        {
          rotation: 585,
          duration: 0.25,
        },
        "-=0.25"
      )
      .to(
        burgerBotRef.current,
        {
          rotation: 675,
          duration: 0.25,
        },
        "-=0.25"
      )
      //   .to(burgerRef.current, {
      //     translateX: "1300%",
      //   })
      .to(
        [burgerTopRef.current, burgerMidRef.current, burgerBotRef.current],
        {
          borderColor: "#ffffff",
          duration: 0.05,
          ease: "power1.out",
        },
        "-=0.5"
      )
      // Add overlay animation
      .to(
        overlayRef.current,
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        sidebarRef.current,
        {
          x: 0,
          duration: 0.5,
          margin: "20px",
          ease: "power2.out",
        },
        "-=0.4"
      );

    tlRef.current = tl;
  }, []);

  const haminate = () => {
    if (tlRef.current) {
      if (tlRef.current.reversed()) {
        // opening
        tlRef.current.play();
        if (!hasOpened) {
          //   setTitleWidths();
          gsap.set(titleRefs.current, { text: "" });
          const numItems = menuData.length;
          const staggerInterval = 0.35;
          const firstDelay = tlRef.current.duration() - 0.25;
          titleRefs.current.forEach((el, i) => {
            const delay = firstDelay + i * staggerInterval;
            gsap.to(el, {
              delay,
              duration: 0.4,
              scrambleText: {
                text: titleTexts.current[i],
                chars: "upperCase",
                revealDelay: 0.15,
                speed: 0.8,
              },
            });
          });

          // initial page
          const initialActiveIndex = menuData.findIndex(
            (item) => item.text === active
          );
          if (initialActiveIndex !== -1) {
            const pageEl = pageRefs.current[initialActiveIndex];
            if (pageEl) {
              gsap.set(pageEl, { text: "", opacity: 0 });
              const lastDelay = firstDelay + (numItems - 1) * staggerInterval;
              const pageDelay = lastDelay + 0.15;
              gsap.to(pageEl, {
                delay: pageDelay,
                duration: 0.4,
                opacity: 1,
                scrambleText: {
                  text: pageTexts[initialActiveIndex],
                  chars: "upperCase",
                  revealDelay: 0.15,
                  speed: 0.8,
                },
                overwrite: true,
              });
            }
          }
          setHasOpened(true);
        }
      } else {
        // closing
        tlRef.current.reverse();
      }
    }
  };

  const addToTitleRefs = (el: HTMLSpanElement | null) => {
    if (el && !titleRefs.current.includes(el)) {
      titleRefs.current.push(el);
    }
  };

  const addToPageRefs = (el: HTMLSpanElement | null) => {
    if (el && !pageRefs.current.includes(el)) {
      pageRefs.current.push(el);
    }
  };

  const handleHover = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    const titleEl = titleRefs.current[index];
    if (titleEl && active !== menuData[index].text) {
      if (!titleEl.style.width) {
        titleEl.style.width = titleEl.scrollWidth + "px";
      }
      gsap.set(titleEl, { text: "" });
      gsap.to(titleEl, {
        duration: 0.25,
        overwrite: true,
        scrambleText: {
          text: titleTexts.current[index],
          chars: "upperCase",
          revealDelay: 0.025,
          speed: 1.6,
        },
      });
    }

    if (active !== menuData[index].text) {
      const pageEl = pageRefs.current[index];
      if (pageEl) {
        gsap.set(pageEl, { text: "", opacity: 0 });
        gsap.to(pageEl, {
          duration: 0.25,
          opacity: 1,
          scrambleText: {
            text: pageTexts[index],
            chars: "upperCase",
            revealDelay: 0.125,
            speed: 1.6,
          },
          overwrite: true,
        });
      }
    }
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    if (active !== menuData[index].text) {
      const pageEl = pageRefs.current[index];
      if (pageEl) {
        gsap.to(pageEl, { opacity: 0, duration: 0.15, overwrite: true });
      }
    }
  };

  return (
    <>
      {/* Transparent overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0  bg-white/10 opacity-0 z-40 pointer-events-none"
      />

      <div className=" mb-4 mt-5 ml-5 rounded-3xl h-full   z-50 fixed">
        <div className="absolute mt-8">
          <div className="relative w-36 h-8 mx-auto -ml-16 text-gray-600 uppercase z-50 ">
            <div
              //   ref={burgerRef}
              className="absolute left-24 w-10 h-8 cursor-pointer "
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

        <div
          ref={sidebarRef}
          className={`bg-black mt-5 fixed flex  top-0 left-0 -translate-x-full z-20 `}
        >
          <div className=" mt-8 ml-5 mr-4 mb-8 w-[15%] ">
            {/* <div className=" flex gap-3 items-center">
              <div className="size-[5px] bg-white"></div>
              <ScrambleText
                text="Discover"
                className="text-[8px] uppercase text-white font-medium"
              />
            </div> */}
          </div>
          <div className="mt-7 ml-8 mb-7 relative w-[240px]  sm:w-[500px]">
            {menuData.map((item, index) => (
              <li
                key={item.text}
                className="list-none text-2xl flex items-start lg:text-6xl pl-2 pr-3 mb-3 text-left font-extrabold cursor-pointer w-fit opacity-100 transition-opacity duration-1000 ease-in-out text-white"
                onClick={() => setActive(item.text)}
                onMouseEnter={(e) => handleHover(e, index)}
                onMouseLeave={(e) => handleMouseLeave(e, index)}
              >
                <span
                  ref={addToTitleRefs}
                  className={`title inline-block pl-1  pr-2 lg:pr-5 ${
                    active === item.text ? "active" : "inactive"
                  }`}
                >
                  {item.text}
                </span>
                <span
                  ref={addToPageRefs}
                  className="page opacity-0 text-[8px] pt-1  ml-2 font-bold inline-block"
                >
                  {`PAGE `}
                  <br />
                  {item.page}
                </span>
              </li>
            ))}
          </div>
          <div className="  ml-5  px-4 border-l border-gray-500">
            <div ref={closeRef}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .title.inactive {
          color: white;
        }
        li:hover .title.inactive {
          color: black;
          position: relative;
        }
        .title.active {
          color: black;
          position: relative;
        }
        .title.active::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 2px;
          background: linear-gradient(to bottom right, #303c66, #96c7ee);
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
        li:hover .title.inactive::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 2px;
          background: #96c7ee;
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
