import React, { useEffect, useState, useRef } from "react";
// @ts-ignore
import Excalidraw from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/dist/excalidraw.min.css";
import "@excalidraw/excalidraw/dist/fonts.min.css";

import "./App.css";
import Claymate from "./Claymate";

const STORAGE_KEY = "excalidraw-elements";

const loadStorage = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "");
    data.appState.collaborators = new Map();
    return data;
  } catch (e) {
    return null;
  }
};

const saveStorage = (data: unknown) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const initialData = loadStorage();

const App: React.FC = () => {
  const lastElementsRef = useRef<unknown[]>([]);

  const onChange = (elements: unknown[], appState: unknown) => {
    lastElementsRef.current = elements;
    saveStorage({ elements, appState });
  };

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
      <Excalidraw
        width={width}
        height={height}
        initialData={initialData}
        onChange={onChange}
      />
      <Claymate lastElementsRef={lastElementsRef} />
    </div>
  );
};

export default App;
