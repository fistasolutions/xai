import React from "react";

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
                  <span className="mono-tag text-sm">Try AiApplication On</span>
                </div>
                <div>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href="https://AiApplication.com"
                  >
                    Web
                  </a>
                </div>
                <div>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href="https://apps.apple.com/app/apple-store/id6670324846?pt=126952307&ct=x.ai%20Direct%20Link&mt=8"
                  >
                    iOS
                  </a>
                </div>
                <div>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href="https://play.google.com/store/apps/details?id=ai.x.AiApplication&hl=en"
                  >
                    Android
                  </a>
                </div>
                <div>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href="https://x.com/i/AiApplication"
                  >
                    AiApplication on X
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-5">
                <div>
                  <span className="mono-tag text-sm">Products</span>
                </div>
                <div>
                  <a className="hover:underline" href="/AiApplication">
                    AiApplication
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/api">
                    API
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-5">
                <div>
                  <span className="mono-tag text-sm">Company</span>
                </div>
                <div>
                  <a className="hover:underline" href="/company">
                    Company
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/careers">
                    Careers
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/contact">
                    Contact
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/news">
                    News
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-5">
                <div>
                  <span className="mono-tag text-sm">Resources</span>
                </div>
                <div>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href="https://docs.x.ai"
                  >
                    Documentation
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/privacy-policy">
                    Privacy policy
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/security">
                    Security
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/safety">
                    Safety
                  </a>
                </div>
                <div>
                  <a className="hover:underline" href="/legal">
                    Legal
                  </a>
                </div>
                <div>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href="https://status.x.ai"
                  >
                    Status
                  </a>
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
