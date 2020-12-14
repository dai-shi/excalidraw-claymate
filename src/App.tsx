import React, { useEffect, useState } from "react";
// @ts-ignore
import Excalidraw from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/dist/excalidraw.min.css";
import "@excalidraw/excalidraw/dist/fonts.min.css";

import "./App.css";
import Claymate from "./Claymate";

const App: React.FC = () => {
  const [elements, setElements] = useState<unknown[]>([]);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { width, height } = dimensions;
  return (
    <div className="ClaymateApp">
      <Excalidraw width={width} height={height} onChange={setElements} />
      <Claymate elements={elements} />
    </div>
  );
};

export default App;
