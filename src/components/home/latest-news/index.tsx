import Link from "next/link";
import React from "react";

function LatestNews() {
  return (
    <section className="py-16 sm:py-32">
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl space-y-16 sm:space-y-32">
        <div className="space-y-12">
          <div>
            <div className="geist-mono flex items-center gap-2 text-sm">
              <span>[</span> <span>Blog</span> <span>]</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-12">
              <h2 className="text-balance text-3xl tracking-tight md:text-4xl lg:text-5xl">
                Latest news
              </h2>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-12">
              <div>
                <Link
                  className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)]"
                  href="#"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  />
                  Explore more
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="group relative">
            <div className="border-border flex flex-col gap-10 border-b py-16 first-of-type:border-t last-of-type:border-b-0 md:flex-row md:gap-12">
              <div className="order-2 flex flex-1 flex-col gap-4 md:order-1 md:gap-12 xl:flex-row">
                <div className="">
                  <p className="geist-mono text-xs leading-6">
                    August 28, 2025
                  </p>
                </div>
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="block grow space-y-4">
                    <Link href="#">
                      <div className="absolute inset-0" />
                      <h3 className="text-xl leading-6">
                        AiApplication Code Fast 1
                      </h3>
                    </Link>
                    <p className="text-secondary grow text-balance">
                      We are thrilled to introduce AiApplication-code-fast-1, a
                      speedy and economical reasoning model that excels at
                      agentic coding.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="geist-mono text-xs">AiApplication</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-2 px-3.5 py-1.5 sm:text-sm [&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:sm:size-3 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] pointer-events-none group-hover:bg-[--btn-hover]"
                      >
                        <span
                          className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                          aria-hidden="true"
                        />
                        Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 flex-1 md:order-2 xl:max-w-[500px]">
                <div
                  className="break-word flex w-full items-center whitespace-pre-wrap bg-[#0C0C0B] duration-150 aspect-[16/10] text-4xl leading-[2.5rem] tracking-tight"
                  style={{
                    backgroundImage:
                      'url("/images/news/AiApplication-code-fast.webp")',
                    backgroundSize: "auto 100%",
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="bg-background max-w-1/2 flex w-auto px-3 py-2">
                      <h2 className="bg-background text-primary text-balance text-2xl uppercase">
                        AiApplication Code Fast 1
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative">
            <div className="border-border flex flex-col gap-10 border-b py-16 first-of-type:border-t last-of-type:border-b-0 md:flex-row md:gap-12">
              <div className="order-2 flex flex-1 flex-col gap-4 md:order-1 md:gap-12 xl:flex-row">
                <div className="">
                  <p className="geist-mono text-xs leading-6">July 09, 2025</p>
                </div>
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="block grow space-y-4">
                    <Link href="#">
                      <div className="absolute inset-0" />
                      <h3 className="text-xl leading-6">AiApplication 4</h3>
                    </Link>
                    <p className="text-secondary grow text-balance">
                      AiApplication 4 is the most intelligent model in the
                      world. It includes native tool use and real-time search
                      integration, and is available now to SuperAiApplication
                      and Premium+ subscribers, as well as through the xAI API.
                      We are also introducing a new SuperAiApplication Heavy
                      tier with access to AiApplication 4 Heavy - the most
                      powerful version of AiApplication 4.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="geist-mono text-xs">AiApplication</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-2 px-3.5 py-1.5 sm:text-sm [&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:sm:size-3 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] pointer-events-none group-hover:bg-[--btn-hover]"
                      >
                        <span
                          className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                          aria-hidden="true"
                        />
                        Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 flex-1 md:order-2 xl:max-w-[500px]">
                <div
                  className="break-word flex w-full items-center whitespace-pre-wrap bg-[#0C0C0B] duration-150 aspect-[16/10] text-4xl leading-[2.5rem] tracking-tight"
                  style={{
                    backgroundImage: 'url("/images/news/AiApplication-4.webp")',
                    backgroundSize: "auto 100%",
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="bg-background max-w-1/2 flex w-auto px-3 py-2">
                      <h2 className="bg-background text-primary text-balance text-2xl uppercase">
                        AiApplication 4
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative">
            <div className="border-border flex flex-col gap-10 border-b py-16 first-of-type:border-t last-of-type:border-b-0 md:flex-row md:gap-12">
              <div className="order-2 flex flex-1 flex-col gap-4 md:order-1 md:gap-12 xl:flex-row">
                <div className="">
                  <p className="geist-mono text-xs leading-6">July 14, 2025</p>
                </div>
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="block grow space-y-4">
                    <Link href="#">
                      <div className="absolute inset-0" />
                      <h3 className="text-xl leading-6">
                        Announcing AiApplication for Government
                      </h3>
                    </Link>
                    <p className="text-secondary grow text-balance">
                      We are excited to announce AiApplication For Government –
                      a suite of frontier AI products available first to United
                      States Government customers.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="geist-mono text-xs">company</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-2 px-3.5 py-1.5 sm:text-sm [&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:sm:size-3 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)] pointer-events-none group-hover:bg-[--btn-hover]"
                      >
                        <span
                          className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                          aria-hidden="true"
                        />
                        Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 flex-1 md:order-2 xl:max-w-[500px]">
                <div
                  className="break-word flex w-full items-center whitespace-pre-wrap bg-[#0C0C0B] duration-150 aspect-[16/10] text-4xl leading-[2.5rem] tracking-tight"
                  style={{
                    backgroundImage: 'url("/images/news/funding.webp")',
                    backgroundSize: "auto 100%",
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="bg-background max-w-1/2 flex w-auto px-3 py-2">
                      <h2 className="bg-background text-primary text-balance text-2xl uppercase">
                        AiApplication for Government
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestNews;
