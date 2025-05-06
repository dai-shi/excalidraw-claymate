import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { createScene } from "./creation";
import { Drawing, Scene } from "./types";
import { loadStorage, saveStorage, SCENE_STORAGE_KEY } from "./persistence";
import { isEqual } from "lodash";

enum Initialisation {
  NotStarted,
  Started,
  Complete,
}

const emptyScene: Scene = {
  id: "empty",
  width: 800,
  height: 600,
  imageData: new ImageData(800, 600),
  drawing: {
    elements: [],
    appState: {
      contextMenu: null,
      showWelcomeScreen: false,
      isLoading: false,
      errorMessage: null,
      draggingElement: null,
      resizingElement: null,
      multiElement: null,
      selectionElement: null,
      isBindingEnabled: false,
      startBoundElement: null,
      suggestedBindings: [],
      editingElement: null,
      editingLinearElement: null,
      activeTool: {
        lastActiveTool: null as any, // Замените на подходящее значение типа LastActiveTool
        locked: false,
        type: "hand",
        customType: null,
      },
      penMode: false,
      penDetected: false,
      exportBackground: true,
      exportEmbedScene: false,
      exportWithDarkMode: false,
      exportScale: 1,
      currentItemStrokeColor: "#000000",
      currentItemBackgroundColor: "transparent",
      currentItemFillStyle: "hachure",
      currentItemStrokeWidth: 1,
      currentItemStrokeStyle: "solid",
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      currentItemFontFamily: 1,
      currentItemFontSize: 20,
      currentItemTextAlign: "left",
      currentItemStartArrowhead: null,
      currentItemEndArrowhead: null,
      currentItemRoundness: "round",
      viewBackgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      cursorButton: "up",
      scrolledOutside: false,
      name: "Untitled",
      isResizing: false,
      isRotating: false,
      zoom: {
        value: 1 as any,
      },
      openMenu: null,
      openPopup: null,
      openSidebar: null,
      openDialog: null,
      isSidebarDocked: false,
      lastPointerDownWith: "mouse",
      selectedElementIds: {},
      previousSelectedElementIds: {},
      shouldCacheIgnoreZoom: false,
      toast: null,
      zenModeEnabled: false,
      theme: "light",
      gridSize: null,
      viewModeEnabled: false,
      selectedGroupIds: {},
      editingGroupId: null,
      width: 0,
      height: 0,
      offsetTop: 0,
      offsetLeft: 0,
      fileHandle: null,
      collaborators: new Map(),
      showStats: false,
      currentChartType: "bar",
      pasteDialog: {
        shown: false,
        data: null,
      },
      pendingImageElementId: null,
      showHyperlinkPopup: false,
      selectedLinearElement: null,
    },
    files: {},
  },
};

export const useScenes = () => {
  const initialisedRef = useRef<Initialisation>(Initialisation.NotStarted);
  const [drawingVersion, setDrawingVersion] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(0);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [drawing, setDrawing] = useState<Drawing | undefined>();

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

  const onRestore = useCallback(
    (
      drawing: Drawing,
      index: number,
      updateCurrent: (index: number, drawing: Drawing) => void
    ) => {
      setDrawingVersion((version) => version + 1);
      setDrawing(drawing);
      if (updateCurrent && index !== undefined) {
        updateCurrent(index, drawing);
      }
    },
    []
  );

  const updateCurrentScene = useCallback(
    (index: number, drawing: Drawing) => {
      if (index != null && drawing) {
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
            setScenes((prev) => {
              const result = [...prev];
              result[index] = scene;
              return result;
            });
          }
        })();
      }
    },
    [requiredWidth, requiredHeight]
  );

  const updateScenes = useCallback(
    (
      updater: (prev: Scene[]) => Scene[],
      newCurrent: { index: number; drawing: Drawing } | undefined
    ) => {
      setScenes(updater);
      if (newCurrent) {
        setCurrentIndex(newCurrent.index);
        onRestore(newCurrent.drawing, newCurrent.index, updateCurrentScene);
      }
    },
    [setCurrentIndex, onRestore, updateCurrentScene]
  );

  const onChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (
      currentIndex !== undefined &&
      (drawing == null ||
        !isEqual(elements, drawing.elements) ||
        !isEqual(appState, drawing.appState))
    ) {
      const update = {
        elements: elements.map((el) => {
          return { ...(el as any) };
        }),
        appState: { ...(appState as any) },
        files,
      };
      setDrawing(update);
      updateCurrentScene(currentIndex, update);
    }
  };

  const moveToScene = useCallback(
    (index: number) => {
      onRestore(scenes[index].drawing, index, updateCurrentScene);
      setCurrentIndex(index);
    },
    [onRestore, scenes, updateCurrentScene]
  );

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

  const clearScenes = useCallback(() => {
    localStorage.removeItem(SCENE_STORAGE_KEY);
    setScenes([]);
    setCurrentIndex(undefined);
    setDrawing(undefined);
    setDrawingVersion(0);

    setScenes([emptyScene]);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (initialisedRef.current === Initialisation.NotStarted) {
      initialisedRef.current = Initialisation.Started;
      (async () => {
        const initialScenes = await loadStorage();
        if (initialScenes && initialScenes.length > 0) {
          setScenes(initialScenes);
          setCurrentIndex(0);
          onRestore(initialScenes[0].drawing, 0, updateCurrentScene);
        } else {
          addScene();
        }
        initialisedRef.current = Initialisation.Complete;
      })();
    }
  }, [updateCurrentScene, onRestore, addScene]);

  useEffect(() => {
    if (initialisedRef.current === Initialisation.Complete) {
      saveStorage(scenes);
    }
  }, [scenes]);

  return {
    moveToScene,
    addScene,
    onChange,
    drawingVersion,
    currentIndex,
    scenes,
    updateScenes,
    initialData: drawing,
    clearScenes
  };
};
