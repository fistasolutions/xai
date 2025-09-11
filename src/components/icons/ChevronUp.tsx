import * as React from "react";

const ChevronUp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="12"
    fill="none"
    viewBox="0 0 28 12"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M13.821 3.952 3.071 11.67c-.266.194-.704.19-.975-.01L.207 10.28c-.271-.198-.277-.521-.012-.715L13.321.14a.78.78 0 0 1 .5-.139.83.83 0 0 1 .5.139l13.126 9.425c.266.194.26.517-.012.716l-1.888 1.38c-.272.198-.71.203-.976.009z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default ChevronUp;
