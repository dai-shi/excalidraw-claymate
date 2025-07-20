import * as React from 'react';

const Loading: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
    <circle
      fill="none"
      strokeOpacity={1}
      stroke="inherit"
      strokeWidth={0.5}
      cx={100}
      cy={100}
      r={0}
    >
      <animate
        attributeName="r"
        calcMode="spline"
        dur="2s"
        values="1;80"
        keyTimes="0;1"
        keySplines="0 .2 .5 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-width"
        calcMode="spline"
        dur="2s"
        values="0;25"
        keyTimes="0;1"
        keySplines="0 .2 .5 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        calcMode="spline"
        dur="2s"
        values="1;0"
        keyTimes="0;1"
        keySplines="0 .2 .5 1"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default Loading;
