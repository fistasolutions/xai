import Link from "next/link";
import React from "react";

function Premium() {
  return (
    <section className="py-16 sm:py-32 relative overflow-hidden">
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl space-y-16 sm:space-y-32">
        <div className="relative flex items-center justify-center py-6">
          <canvas
            style={{
              mask: "radial-gradient(circle at center, black, transparent)",
            }}
            className="absolute inset-0 h-full w-full -top-16 sm:-top-32"
            width={1231}
            height={378}
          />
          <div className="absolute inset-x-0 -top-16 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-40 sm:-top-32" />
          <div
            className="absolute -inset-x-[200px] -top-16 h-[500px] sm:-top-32 lg:-inset-x-[400px]"
            style={{
              background:
                "linear-gradient(to right, rgba(255, 99, 8, 0.1), rgba(255, 99, 8, 0.1), rgba(189, 201, 230, 0.1), rgba(151, 196, 255, 0.1), rgba(151, 196, 255, 0.1))",
              mask: "radial-gradient(ellipse at top, black, transparent 60%)",
            }}
          />
          <div className="relative flex max-w-lg flex-col items-center space-y-8 text-center">
            <svg
              width={310}
              height={80}
              viewBox="0 0 310 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_i_33774_13227)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M54.6483 33.7015L32.4852 50.0817L64.2337 18.1529V18.1813L73.4038 9.00024C73.2389 9.23376 73.0739 9.46158 72.9089 9.6894C65.9403 19.2977 62.5385 23.9964 65.269 35.7519L65.252 35.7348C67.1349 43.7369 65.1211 52.6105 58.619 59.1204C50.4216 67.3333 37.3035 69.1615 26.5007 61.7688L34.0325 58.2775C40.9272 60.9885 48.4704 59.7981 53.8917 54.3704C59.313 48.9426 60.5304 41.0373 57.8055 34.459C57.2878 33.2117 55.7348 32.8984 54.6483 33.7015ZM28.1106 28.5528C21.4947 35.1709 20.1579 46.6473 27.9115 54.0628L27.9058 54.0685L6.73828 73.0003C8.06292 71.1739 9.70323 69.4473 11.3423 67.7221L11.3423 67.7221L11.4087 67.6522L11.4224 67.6378C16.1052 62.7104 20.7467 57.8265 17.9108 50.9246C14.1108 41.6809 16.3237 30.8481 23.3606 23.8028C30.6762 16.4841 41.4506 14.6388 50.4501 18.3465C52.4411 19.0869 54.1761 20.1406 55.53 21.1202L48.0153 24.5944C41.0182 21.6556 33.0029 23.6547 28.1106 28.5528ZM219.135 56.851C209.373 56.851 203.553 49.8216 203.553 40.2364C203.553 30.5608 209.581 23.3606 219.325 23.3606C226.94 23.3606 232.514 27.2308 233.829 34.4311H227.982C227.121 30.336 223.676 28.0409 219.325 28.0409C212.3 28.0409 209.219 34.071 209.219 40.2364C209.219 46.4016 212.3 52.3867 219.325 52.3867C226.033 52.3867 228.979 47.5715 229.206 43.5665H219.099V38.9067H234.373L234.348 41.343C234.348 50.3957 230.628 56.851 219.135 56.851ZM280.239 56.258V24.1269H285.36V45.3323V56.258H280.239ZM285.36 45.3323L296.192 32.9922H302.402L292.657 43.5677L302.492 56.258H296.374L288.408 45.3538L285.36 45.3323ZM264.713 56.7958C257.099 56.7958 252.974 51.4406 252.974 44.6004C252.974 37.7151 257.099 32.4049 264.713 32.4049C272.372 32.4049 276.451 37.7151 276.451 44.6004C276.451 51.4406 272.372 56.7958 264.713 56.7958ZM258.322 44.6004C258.322 49.9106 261.223 52.5658 264.713 52.5658C268.248 52.5658 271.103 49.9106 271.103 44.6004C271.103 39.2903 268.248 36.5902 264.713 36.5902C261.223 36.5902 258.322 39.2903 258.322 44.6004ZM238.722 36.6806V56.2564H243.843V37.3107H252.182V32.9906H243.027L238.722 36.6806ZM81.6712 46.6618C82.11 52.4542 86.5421 57.1057 95.0553 57.1057C102.427 57.1057 107.737 53.5513 107.737 47.671C107.737 42.493 104.227 40.0794 98.127 38.7191L93.3 37.5782C89.7455 36.7883 87.8147 35.5157 87.8147 33.2338C87.8147 30.4254 90.4915 28.6262 94.397 28.6262C98.1709 28.6262 100.935 30.2937 101.374 34.5503H106.772C106.421 28.2751 101.55 24.1941 94.397 24.1941C87.332 24.1941 82.505 28.0119 82.505 33.5849C82.505 39.5529 87.5953 41.3959 92.159 42.4491L96.9422 43.5022C100.76 44.3799 102.296 45.9596 102.296 48.0221C102.296 51.2255 99.0924 52.6297 95.0553 52.6297C90.7987 52.6297 87.8147 51.0061 87.1565 46.6618H81.6712ZM119.855 56.7985C114.019 56.7985 112.044 53.3757 112.044 48.5487V33.5849H117.003V48.2854C117.003 50.8744 118.495 52.5858 121.128 52.5858C125.121 52.5858 127.096 49.6019 127.096 45.7841V33.5849H132.054V56.2719H127.315V52.4103H127.227C125.648 55.4382 123.146 56.7985 119.855 56.7985ZM136.793 33.5849V64.9606H141.752V53.2002H141.883C143.463 55.8331 146.535 56.7985 148.861 56.7985C155.531 56.7985 159.085 51.3571 159.085 44.9065C159.085 38.4558 155.531 33.0144 148.861 33.0144C146.535 33.0144 143.463 33.9798 141.883 36.6128H141.752V33.5849H136.793ZM147.764 52.6736C143.419 52.6736 141.62 48.812 141.62 44.9065C141.62 40.8693 143.419 37.0955 147.764 37.0955C152.196 37.0955 153.907 40.8693 153.907 44.9065C153.907 48.812 152.196 52.6736 147.764 52.6736ZM172.834 56.7985C165.725 56.7985 161.688 51.796 161.688 44.9065C161.688 37.8415 165.725 33.0144 172.439 33.0144C178.977 33.0144 182.97 37.4465 183.19 44.2921L181.04 46.3107H166.734C167.129 50.3479 169.279 52.7614 172.834 52.7614C175.423 52.7614 177.266 51.401 178.187 48.8997H183.102C181.961 54.1217 178.099 56.7985 172.834 56.7985ZM166.866 42.7562H178.275C177.748 38.8946 175.51 36.9199 172.439 36.9199C169.63 36.9199 167.48 39.0702 166.866 42.7562ZM186.842 37.1832V56.2719H191.8V37.7976H199.875V33.5849H191.01L186.842 37.1832Z"
                  fill="url(#paint0_linear_33774_13227)"
                />
              </g>
              <defs>
                <filter
                  id="filter0_i_33774_13227"
                  x="6.73828"
                  y="9.00024"
                  width="295.754"
                  height={64}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1.04167" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2={-1}
                    k3={1}
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_33774_13227"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_33774_13227"
                  x1="154.615"
                  y1="9.00024"
                  x2="154.615"
                  y2="73.0003"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.9" />
                  <stop offset={1} stopColor="white" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
            <p className="text-secondary text-lg sm:text-xl">
              Do more with AiApplication. <br /> Unlock a{" "}
              <span className="text-primary">SuperAiApplication</span> {/* */}
              subscription on AiApplication.com.
            </p>
            <p className="text-secondary text-lg sm:text-xl">
              We have just launched{" "}
              <span className="text-primary">SuperAiApplication Heavy</span>,
              providing access to AiApplication Heavy and much higher rate
              limits.
            </p>
            <Link
              className="relative isolate inline-flex shrink-0 items-center justify-center border font-mono text-base/6 uppercase tracking-widest focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:sm:my-1 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/25%)] [--btn-hover:theme(colors.secondary/20%)] [--btn-text:theme(colors.primary)]"
              href="#"
            >
              <span
                className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                aria-hidden="true"
              />
              Sign up now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Premium;
