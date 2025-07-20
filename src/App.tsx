import { useMemo } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import './App.css';
import Claymate from './Claymate';
import { useScenes } from './useScenes';
import { useLibrary } from './useLibrary';

// eslint-disable-next-line import/no-unresolved
import '@excalidraw/excalidraw/index.css';

const App = () => {
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
      />
    </div>
  );
};

export default App;
