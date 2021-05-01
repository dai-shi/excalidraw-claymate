import React, { useEffect, useState } from "react";
// @ts-ignore
import Excalidraw from "@excalidraw/excalidraw";
import isEqual from "lodash/isEqual";

import "./App.css";
import Claymate from "./Claymate";
import { Drawing } from "./types";

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

let initialData = loadStorage();

const App: React.FC = () => {
  const [drawing, setDrawing] = useState<Drawing>(initialData);
  const [drawingVersion, setDrawingVersion] = useState(0);

  const onRestore = (drawing: Drawing) => {
    setDrawingVersion((version) => version + 1);
    initialData = drawing;
  };

  const onChange = (elements: unknown[], appState: unknown) => {
    if (
      drawing == null ||
      !isEqual(elements, drawing.elements) ||
      !isEqual(appState, drawing.appState)
    ) {
      setDrawing({
        elements: elements.map((el) => {
          return { ...(el as any) };
        }),
        appState: { ...(appState as any) },
      });
    }
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
        key={drawingVersion}
        width={width}
        height={height}
        initialData={initialData}
        onChange={onChange}
      />
      <Claymate drawing={drawing} onRestore={onRestore} />
    </div>
  );
};

export default App;
