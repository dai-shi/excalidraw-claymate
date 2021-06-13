import React, { useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";
import "./App.css";
import Claymate from "./Claymate";
import { Drawing } from "./types";
import { useScenes } from "./useScenes";

const App: React.FC = () => {
  const excalidrawRef = useRef<ExcalidrawAPIRefValue>(null);
  const updateDrawing = (drawing: Drawing) => {
    (excalidrawRef.current as ExcalidrawImperativeAPI | null)?.updateScene(
      drawing
    );
  };
  const {
    moveToScene,
    addScene,
    onChange,
    drawingVersion,
    currentIndex,
    initialData,
    scenes,
    updateScenes,
  } = useScenes();

  return (
    <div className="ClaymateApp">
      <Excalidraw
        ref={excalidrawRef}
        key={drawingVersion}
        initialData={initialData}
        onChange={onChange}
      />
      <Claymate
        scenes={scenes}
        currentIndex={currentIndex}
        updateScenes={updateScenes}
        moveToScene={moveToScene}
        addScene={addScene}
        updateDrawing={updateDrawing}
      />
    </div>
  );
};

export default App;
