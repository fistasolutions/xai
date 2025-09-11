import * as React from "react";

const BarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="96"
    className="mx-auto mt-6 lg:mt-10"
    height="12"
    fill="none"
    viewBox="0 0 96 12"
    {...props}
  >
    <rect
      width="71.5"
      height="12"
      x="24.25"
      fill="url(#paint0_linear_3_606)"
      rx="6"
    ></rect>
    <circle cx="6.25" cy="6" r="6" fill="url(#paint1_linear_3_606)"></circle>
    <defs>
      <linearGradient
        id="paint0_linear_3_606"
        x1="7.146"
        x2="8.508"
        y1="3.19"
        y2="18.459"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B2EBF2"></stop>
        <stop offset="0.653" stopColor="#D1C4E9"></stop>
        <stop offset="1" stopColor="#F8BBD0"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_3_606"
        x1="-2.621"
        x2="3.758"
        y1="3.19"
        y2="15.19"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B2EBF2"></stop>
        <stop offset="0.653" stopColor="#D1C4E9"></stop>
        <stop offset="1" stopColor="#F8BBD0"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export default BarIcon;
