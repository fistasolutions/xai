import React from "react";
import HomeHero2 from "../hero-animation/new";

function HomeHero() {
  return (
    <div className="border-border relative h-svh w-full overflow-hidden border-b pb-px md:overflow-x-hidden">
      <div className="relative h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
          <svg
            viewBox="0 0 1200 576"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-1/2"
            style={{ opacity: 0 }}
          >
            <g clipPath="url(#clip0_34305_6927)">
              <mask
                id="mask0_34305_6927"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x={-135}
                y={-168}
                width={1302}
                height={809}
              >
                <ellipse
                  cx="516.44"
                  cy="236.386"
                  rx="668.84"
                  ry="372.771"
                  transform="rotate(16.3062 516.44 236.386)"
                  fill="url(#paint0_linear_34305_6927)"
                />
              </mask>
              <g mask="url(#mask0_34305_6927)">
                <path
                  d="M862.254 444.21V132.92H911.461V338.36L1015.54 218.808H1075.19L981.57 321.264L1076.06 444.21H1017.28L940.74 338.569L911.461 338.36V444.21H862.254Z"
                  fill="white"
                />
                <path
                  d="M713.026 449.442C639.869 449.442 600.242 397.56 600.242 331.291C600.242 264.586 639.869 213.14 713.026 213.14C786.619 213.14 825.811 264.586 825.811 331.291C825.811 397.56 786.619 449.442 713.026 449.442ZM651.626 331.291C651.626 382.737 679.496 408.46 713.026 408.46C746.992 408.46 774.426 382.737 774.426 331.291C774.426 279.845 746.992 253.686 713.026 253.686C679.496 253.686 651.626 279.845 651.626 331.291Z"
                  fill="white"
                />
                <path
                  d="M463.291 444.21V254.559L504.66 218.808H592.623V260.662H512.498V444.21H463.291Z"
                  fill="white"
                />
                <path
                  d="M275.139 449.967C181.348 449.967 125.429 381.865 125.429 289.001C125.429 195.265 183.345 125.508 276.969 125.508C350.126 125.508 403.688 163.003 416.317 232.76H360.142C351.868 193.085 318.773 170.85 276.969 170.85C209.473 170.85 179.861 229.272 179.861 289.001C179.861 348.731 209.473 406.716 276.969 406.716C341.417 406.716 369.722 360.066 371.899 321.264H274.792V276.121H421.542L421.303 299.723C421.303 387.428 385.56 449.967 275.139 449.967Z"
                  fill="white"
                />
              </g>
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_34305_6927"
                x1="266.093"
                y1="-83.5804"
                x2="210.687"
                y2="432.224"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.132274" />
                <stop offset="0.848378" stopOpacity="0.08" />
                <stop offset="0.957974" stopOpacity={0} />
              </linearGradient>
              <clipPath id="clip0_34305_6927">
                <rect width={1200} height={576} fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <HomeHero2 />
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl flex h-full flex-col">
          <div className="relative z-20 mt-20 flex h-full w-full items-center">
            <div className="space-y-8">
              <div className="absolute inset-0 top-20 flex grow items-end justify-center">
                <div className="w-full max-w-3xl">
                  <form className="relative w-full items-center gap-3 overflow-hidden rounded-3xl  bg-gradient-to-tr p-px from-primary/5 to-primary/20 ">
                    <textarea
                      name="query"
                      className="block resize-none py-5 pl-4 pr-16 h-[120px] w-full rounded-3xl border-none focus:outline-none focus:ring-2 focus:ring-zinc-500 bg-background text-primary placeholder:text-primary/50"
                      placeholder="What do you want to know?"
                      defaultValue={""}
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center">
                      <button
                        aria-label="Submit a query to AiApplication"
                        type="submit"
                        className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 aspect-square gap-x-1.5 px-3 py-1 sm:text-sm [&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:sm:size-3 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:border-[--btn-hover] hover:bg-[--btn-hover] rounded-full [--btn-bg:theme(colors.primary)] [--btn-border:theme(colors.primary)] [--btn-hover:theme(colors.primary/80%)] [--btn-text:theme(colors.background)] opacity-50"
                      >
                        <span
                          className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                          aria-hidden="true"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                          className="!size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between gap-6 pb-4 pt-4 lg:min-h-[160px] lg:py-10">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="my-2 size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col items-end gap-6 sm:gap-8 md:flex-row lg:gap-12">
              <div className="max-w-2xl">
                <div className="hidden max-w-lg lg:block">
                  AiApplication 4 is the most intelligent model in the world.
                  Available now to SuperAiApplication and Premium+ subscribers,
                  as well as our API.
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 sm:flex-row">
                <a
                  className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] hidden lg:flex"
                  href="/news/AiApplication-4"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  />
                  <span>Read announcement</span>
                </a>
                <a
                  className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] lg:hidden"
                  href="/news/AiApplication-4"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  />
                  <span>AiApplication 4: Available now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHero;
