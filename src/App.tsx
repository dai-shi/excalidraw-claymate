import { useMemo, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type {
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import "./App.css";
import Claymate from "./Claymate";
import { Drawing } from "./types";
import { useScenes } from "./useScenes";
import { useLibrary } from "./useLibrary";

const App = () => {
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
    clearScenes,
  } = useScenes();

  const { onLibraryChange, libraryItems } = useLibrary();

  const initialData = useMemo(() => {
    if (libraryItems) {
      return {
        ...initialSceneData,
        libraryItems,
        files: initialSceneData?.files || undefined,
      };
    }
    return { ...initialSceneData, files: initialSceneData?.files || undefined };
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
        clearScenes={clearScenes}
        updateDrawing={updateDrawing}
      />
    </div>
  );
};

export default App;
