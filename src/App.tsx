import React, { useState } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
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

  const onChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) => {
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

  return (
    <div className="ClaymateApp">
      <Excalidraw
        key={drawingVersion}
        initialData={initialData}
        onChange={onChange}
      />
      <Claymate drawing={drawing} onRestore={onRestore} />
    </div>
  );
};

export default App;
