"use client";
import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <div className="border-border/50 relative w-full overflow-hidden border-t pb-32 md:pb-64">
      <div className="absolute inset-0">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'url("/images/footer-gradient.webp")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            opacity: 1,
          }}
        />
      </div>
      <section className="py-16 sm:py-32 border-b-0">
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl space-y-16 sm:space-y-32">
          <div className="relative grid gap-16 md:grid-cols-4">
            <div>
              <div className="space-y-5">
                <div>
                  <span className="geist-mono text-sm">
                    Try AiApplication On
                  </span>
                </div>
                <div>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    href="#"
                  >
                    Web
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    href="#"
                  >
                    iOS
                  </Link>
                </div>
                <div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    href="#"
                  >
                    Android
                  </a>
                </div>
                <div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    href="#"
                  >
                    AiApplication on X
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-5">
                <div>
                  <span className="geist-mono text-sm">Products</span>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    AiApplication
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    API
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-5">
                <div>
                  <span className="geist-mono text-sm">Company</span>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Company
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Careers
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Contact
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    News
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-5">
                <div>
                  <span className="geist-mono text-sm">Resources</span>
                </div>
                <div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    href="#"
                  >
                    Documentation
                  </a>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Privacy policy
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Security
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Safety
                  </Link>
                </div>
                <div>
                  <Link className="hover:underline" href="#">
                    Legal
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    href="#"
                  >
                    Status
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
