"use client";
import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaGlobe,
  FaChevronDown,
} from "react-icons/fa";

function Footer() {
  return (
    <div className="relative w-full overflow-visible bg-black pb-32 md:pb-52">
      <div className="absolute inset-0 overflow-visible">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'url("/images/footer-gradient.jpg")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
            opacity: 1,
          }}
        />
      </div>
      <div className="main-container relative z-10 mx-auto py-16 sm:py-32">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-20">
          {/* Left Section - Logo and Description */}
          <div className="flex flex-col gap-6 lg:max-w-[286px]">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500">
                <span className="text-lg font-bold text-white">2</span>
              </div>
              <span className="font-montserrat text-3xl font-medium text-white">
                2themoon
              </span>
            </div>

            {/* Description */}
            <p className="font-montserrat text-base leading-6 text-white">
              Nam posuere accumsan porta. Integer id orci sed ante tincidunt
              tincidunt sit amet sed libero.
            </p>

            {/* Copyright */}
            <p className="font-montserrat text-base leading-6 text-white">
              © 2themoon 2023
            </p>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="flex flex-col gap-8 sm:flex-row lg:max-w-[557px] lg:gap-[40px]">
            {/* COMPANY Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-montserrat text-lg font-bold text-[#D1C4E9] uppercase">
                COMPANY
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Donec dignissim
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Curabitur egestas
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Nam posuere
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Aenean facilisis
                </Link>
              </div>
            </div>

            {/* SERVICES Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-montserrat text-lg font-bold text-[#D1C4E9] uppercase">
                SERVICES
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Cras convallis
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Vestibulum faucibus
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Quisque lacinia purus
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Aliquam nec ex
                </Link>
              </div>
            </div>

            {/* RESOURCES Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-montserrat text-lg font-bold text-[#D1C4E9] uppercase">
                RESOURCES
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Suspendisse porttitor
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Nam posuere
                </Link>
                <Link
                  href="#"
                  className="font-montserrat text-base leading-6 text-white transition-colors hover:text-[#D1C4E9]"
                >
                  Curabitur egestas
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Social Media and Language Selector */}
          <div className="flex flex-col gap-6 lg:max-w-[211px]">
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <div className="flex h-[37.5px] w-[37.5px] items-center justify-center rounded-full bg-[#424242]">
                <FaFacebookF className="text-sm text-[#D1C4E9]" />
              </div>
              <div className="flex h-[37.5px] w-[37.5px] items-center justify-center rounded-full bg-[#424242]">
                <FaLinkedinIn className="text-sm text-[#D1C4E9]" />
              </div>
              <div className="flex h-[37.5px] w-[37.5px] items-center justify-center rounded-full bg-[#424242]">
                <FaTwitter className="text-sm text-[#D1C4E9]" />
              </div>
              <div className="flex h-[37.5px] w-[37.5px] items-center justify-center rounded-full bg-[#424242]">
                <FaInstagram className="text-sm text-[#D1C4E9]" />
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-3 rounded-[5px] border border-[#673AB7] bg-[#424242] px-3 py-2">
              <FaGlobe className="text-sm text-[#D1C4E9]" />
              <span className="font-montserrat text-lg leading-[22px] text-white">
                English - En
              </span>
              <FaChevronDown className="ml-auto text-xs text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
