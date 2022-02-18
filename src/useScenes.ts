import { useCallback, useEffect, useState } from "react";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import isEqual from "lodash/isEqual";
import { createScene } from "./creation";
import { Drawing, Scene } from "./types";
import { loadStorage, saveStorage } from "./persistence";

export const useScenes = () => {
  const [initialised, setInitialised] = useState(false);
  const [drawingVersion, setDrawingVersion] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(0);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [drawing, setDrawing] = useState<Drawing | undefined>();

  useEffect(() => {
    if (!initialised) {
      (async () => {
        const initialScenes = await loadStorage();
        if (initialScenes && initialScenes.length > 0) {
          setScenes(initialScenes);
          setCurrentIndex(0);
          setDrawing(initialScenes[0].drawing);
        }
      })();
    }
  }, [initialised, setInitialised]);

  useEffect(() => {
    saveStorage(scenes);
  }, [scenes]);

  const onRestore = useCallback((drawing: Drawing) => {
    setDrawingVersion((version) => version + 1);
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
        files: null,
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
        setCurrentIndex(newCurrent.index);
        onRestore(newCurrent.drawing);
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
      (async () => {
        const scene = await createScene(
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
      })();
    }
  }, [
    drawing,
    currentIndex,
    scenes.length,
    updateScenes,
    requiredWidth,
    requiredHeight,
  ]);

  const addScene = useCallback(
    (optionalDrawing?: Drawing) => {
      const drawingToAdd = optionalDrawing || drawing;
      if (drawingToAdd) {
        (async () => {
          const scene = await createScene(
            drawingToAdd,
            scenes[0] && {
              width: scenes[0].width,
              height: scenes[0].height,
            }
          );
          if (scene) {
            updateScenes((prev) => [...prev, scene], {
              index: scenes.length,
              drawing: drawingToAdd,
            });
          }
        })();
      }
    },
    [updateScenes, scenes, drawing]
  );

  return {
    initialised,
    moveToScene,
    addScene,
    onChange,
    drawingVersion,
    currentIndex,
    scenes,
    updateScenes,
    initialData: drawing,
  };
};
