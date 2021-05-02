import React from "react";
import Excalidraw from "@excalidraw/excalidraw";
import "./App.css";
import Claymate from "./Claymate";
import { useScenes } from "./useScenes";

const App: React.FC = () => {
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
      />
    </div>
  );
};

export default App;
