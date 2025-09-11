import * as React from "react";

interface CheckMarkProps extends React.SVGProps<SVGSVGElement> {
  isBlue?: boolean;
}

const CheckMark = ({ isBlue = false, ...props }: CheckMarkProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="18"
    fill="none"
    viewBox="0 0 16 18"
    {...props}
  >
    <g stroke="#fff" strokeWidth="1.067" clipPath="url(#clip0_1_749)">
      <path
        fill={isBlue ? "#1574D2" : "#575757"}
        d="M7.014 2.75a1.333 1.333 0 0 1 1.972 0l.68.746c.267.293.651.453 1.048.434l1.009-.047c.785-.037 1.43.61 1.394 1.394l-.047 1.009c-.019.397.14.78.434 1.048l.747.68c.58.53.58 1.443 0 1.972l-.747.68a1.33 1.33 0 0 0-.434 1.048l.047 1.009c.037.785-.61 1.43-1.394 1.394l-1.009-.047c-.397-.019-.78.14-1.048.434l-.68.747c-.53.58-1.443.58-1.972 0l-.68-.747a1.33 1.33 0 0 0-1.048-.434l-1.009.047a1.333 1.333 0 0 1-1.394-1.394l.047-1.009c.019-.397-.14-.78-.434-1.048l-.747-.68a1.333 1.333 0 0 1 0-1.972l.747-.68c.293-.267.453-.651.434-1.048l-.047-1.009a1.333 1.333 0 0 1 1.394-1.394l1.01.047c.396.019.78-.14 1.047-.434z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 1.333 1.334L10 7.667"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_1_749">
        <path fill="#fff" d="M0 1h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default CheckMark;
