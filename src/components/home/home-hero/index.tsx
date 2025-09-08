import React from "react";
import ConeGlow from "../hero-animation/home-hero-animation";
import Link from "next/link";
function HomeHero() {
  return (
    <div className="border-border relative h-svh w-full overflow-hidden border-b pb-px md:overflow-x-hidden">
      <div className="relative h-full w-full">
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
         <svg></svg>
        </div> */}
        <ConeGlow />
        <div className="relative z-10 mx-auto w-full px-4 lg:px-6 xl:max-w-7xl flex h-full flex-col">
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
                  2TheMoon is the most intelligent model in the world. Available
                  now to Premium+ subscribers, as well as our API.
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 sm:flex-row">
                <Link
                  className="relative isolate shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] hidden lg:flex"
                  href="#"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  />
                  <span>Read announcement</span>
                </Link>
                <Link
                  className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] lg:hidden"
                  href="#"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  />
                  <span>AiApplication 4: Available now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHero;
