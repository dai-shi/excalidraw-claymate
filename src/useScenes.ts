import { useCallback, useEffect, useState } from "react";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import isEqual from "lodash/isEqual";
import { createScene } from "./creation";
import { Drawing, Scene } from "./types";
import { loadStorage, saveStorage } from "./persistence";

let initialScenes = loadStorage();
let initialData =
  initialScenes && initialScenes.length > 0
    ? initialScenes[0].drawing
    : undefined;

export const useScenes = () => {
  const [drawingVersion, setDrawingVersion] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    initialScenes ? 0 : undefined
  );
  const [scenes, setScenes] = useState<Scene[]>(initialScenes || []);
  const [drawing, setDrawing] = useState<Drawing | undefined>(
    initialScenes ? initialScenes[0].drawing : undefined
  );

  useEffect(() => {
    saveStorage(scenes);
  }, [scenes]);

  const onRestore = useCallback((drawing: Drawing) => {
    setDrawingVersion((version) => version + 1);
    initialData = drawing;
    setDrawing(drawing);
  }, []);

  const moveToScene = useCallback(
    (index: number) => {
      onRestore(scenes[index].drawing);
      setCurrentIndex(index);
    },
    [onRestore, setCurrentIndex, scenes]
  );

  const onChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) => {
    if (
      drawing == null ||
      !isEqual(elements, drawing.elements) ||
      !isEqual(appState, drawing.appState)
    ) {
      const update = {
        elements: elements.map((el) => {
          return { ...(el as any) };
        }),
        appState: { ...(appState as any) },
      };
      setDrawing(update);
    }
  };

  const updateScenes = useCallback(
    (
      updater: (prev: Scene[]) => Scene[],
      newCurrent?: { index: number; drawing: Drawing }
    ) => {
      setScenes(updater);
      if (newCurrent) {
        onRestore(newCurrent.drawing);
        setCurrentIndex(newCurrent.index);
      }
    },
    [setCurrentIndex, onRestore, setScenes]
  );

  const currentScene =
    currentIndex !== undefined && currentIndex < scenes.length
      ? { ...scenes[currentIndex], drawing }
      : undefined;

  let requiredWidth: number | undefined;
  let requiredHeight: number | undefined;
  if (currentScene != null && scenes.length !== 1) {
    requiredWidth = currentScene.width;
    requiredHeight = currentScene.height;
  }

  useEffect(() => {
    if (currentIndex != null && drawing) {
      const scene = createScene(
        drawing,
        requiredWidth === undefined || requiredHeight === undefined
          ? undefined
          : {
              width: requiredWidth,
              height: requiredHeight,
            }
      );
      if (scene) {
        updateScenes((prev) => {
          const result = [...prev];
          result[currentIndex] = scene;
          return result;
        }, undefined);
      }
    }
  }, [
    drawing,
    currentIndex,
    scenes.length,
    updateScenes,
    requiredWidth,
    requiredHeight,
  ]);

  const addScene = useCallback(() => {
    if (drawing) {
      const scene = createScene(
        drawing,
        scenes[0] && {
          width: scenes[0].width,
          height: scenes[0].height,
        }
      );
      if (scene) {
        updateScenes((prev) => [...prev, scene], {
          index: scenes.length,
          drawing: drawing,
        });
      }
    }
  }, [updateScenes, scenes, drawing]);

  return {
    moveToScene,
    addScene,
    onChange,
    drawingVersion,
    currentIndex,
    scenes,
    updateScenes,
    initialData,
  };
};
