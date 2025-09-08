import React from "react";
import StarburstAnimation from "../feature-animation";

function StarBurst() {
  return (
    <div className="relative flex justify-center overflow-hidden pb-24">
      <div className="relative h-[600px] lg:h-[1000px] xl:h-[1200px]">
        <div className="absolute left-1/2 top-6 size-[600px] -translate-x-1/2 lg:size-[1000px] xl:size-[1200px] [&>canvas]:!h-full [&>canvas]:!w-full">
          <StarburstAnimation />
        </div>
      </div>
      {/* <div className="pointer-events-none absolute inset-6 flex flex-col justify-center">
        <div className="mx-auto flex w-full max-w-7xl">
          <div
            style={{ transform: "translateX(38.1844px)" }}
            className="from-secondary to-primary inline-block text-balance bg-gradient-to-l bg-clip-text py-2 text-4xl leading-[2.25rem] tracking-tight text-transparent md:text-[5rem] md:leading-[5rem]"
          >
            Understand
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-7xl justify-end">
          <div
            style={{ transform: "translateX(-38.1844px)" }}
            className="from-secondary to-primary inline-block text-balance bg-gradient-to-r bg-clip-text py-2 text-4xl leading-[2.25rem] tracking-tight text-transparent md:text-[5rem] md:leading-[5rem]"
          >
            The Universe
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default StarBurst;
