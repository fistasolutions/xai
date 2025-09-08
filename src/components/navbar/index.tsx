import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <header className="group container mx-auto  fixed inset-x-0 top-0 z-50 duration-200 -translate-y-0">
      <div
        className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-black duration-200 lg:h-24 lg:from-black/75 opacity-0"
        style={{}}
      />
      <div className="bg-background/25 fixed inset-x-0 top-0 hidden backdrop-blur lg:block pointer-events-none opacity-0 lg:pt-20">
        <div className="border-primary/10 h-full border-y py-4">
          <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl relative">
            <div className="-mx-3 flex gap-1.5" />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl relative">
        <nav className="flex items-center justify-between gap-4 py-4 duration-200 lg:h-20">
          <Link aria-label="xAI Homepage" href="/">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-8"
            >
              <path
                d="M2.30047 8.77631L12.0474 23H16.3799L6.63183 8.77631H2.30047ZM6.6285 16.6762L2.29492 23H6.63072L8.79584 19.8387L6.6285 16.6762ZM17.3709 1L9.88007 11.9308L12.0474 15.0944L21.7067 1H17.3709ZM18.1555 7.76374V23H21.7067V2.5818L18.1555 7.76374Z"
                fill="currentColor"
              />
            </svg>
          </Link>
          <ul className="ml-3 hidden flex-grow gap-4 lg:flex">
            <li>
              <Link
                className="text-primary/50 geist-mono hover:text-primary px-3 py-1.5 text-sm"
                href="#"
              >
                AiApplication
              </Link>
            </li>
            <li>
              <Link
                className="text-primary/50 geist-mono hover:text-primary px-3 py-1.5 text-sm"
                href="#"
              >
                API
              </Link>
            </li>
            <li>
              <Link
                className="text-primary/50 geist-mono hover:text-primary px-3 py-1.5 text-sm"
                href="#"
              >
                Company
              </Link>
            </li>
            <li>
              <Link
                className="text-primary/50 geist-mono hover:text-primary px-3 py-1.5 text-sm"
                href="#"
              >
                Colossus
              </Link>
            </li>
            <li>
              <Link
                className="text-primary/50 geist-mono hover:text-primary px-3 py-1.5 text-sm"
                href="#"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                className="text-primary/50 geist-mono hover:text-primary px-3 py-1.5 text-sm"
                href="#"
              >
                News
              </Link>
            </li>
          </ul>
          <div className="flex gap-2">
            <Link
              className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)]"
              href="#"
            >
              <span
                className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                aria-hidden="true"
              />
              Try AiApplication
            </Link>
            <div>
              <button
                type="button"
                className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 aspect-square gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] visible lg:hidden"
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
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
