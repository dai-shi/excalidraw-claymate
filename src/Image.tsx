import React, { useEffect, useRef } from "react";

export const Image = React.memo<{
  image: HTMLImageElement;
}>(({ image }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const ele = ref.current;
      ele.appendChild(image);
      return () => {
        ele.removeChild(image);
      };
    }
    return undefined;
  }, [image]);
  return <div ref={ref}></div>;
});
