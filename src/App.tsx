import React, { useMemo, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type {
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import "./App.css";
import Claymate from "./Claymate";
import { Drawing } from "./types";
import { useScenes } from "./useScenes";
import { useLibrary } from "./useLibrary";

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
    initialData: initialSceneData,
    scenes,
    updateScenes,
  } = useScenes();

  const { onLibraryChange, libraryItems } = useLibrary();

  const initialData = useMemo(() => {
    if (libraryItems) {
      return { ...initialSceneData, libraryItems };
    }
    return initialSceneData;
  }, [initialSceneData, libraryItems]);

  return (
    <div className="ClaymateApp">
      <Excalidraw
        ref={excalidrawRef}
        key={drawingVersion}
        initialData={initialData}
        onChange={onChange}
        onLibraryChange={onLibraryChange}
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
