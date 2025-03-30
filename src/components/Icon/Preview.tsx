import * as React from "react";

import { ClayMateIconProps } from ".";

const Preview: React.FC<ClayMateIconProps> = ({ fontSize = 14 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={fontSize}
      height={fontSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-play-icon lucide-play"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
};

export default Preview;
