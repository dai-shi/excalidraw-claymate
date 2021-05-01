import React, { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { fileSave } from "browser-nativefs";
// @ts-ignore
import GIF from "gif.js/dist/gif";
import { exportToCanvas } from "@excalidraw/excalidraw";

import "./Claymate.css";
import { Drawing } from "./types";
import { useModifiedCheck } from "./useModifiedCheck";

type Scene = {
  id: string;
  width: number;
  height: number;
  imageData: ImageData;
  drawing: Drawing;
};

const createScene = (
  drawing: Drawing,
  size?: { width: number; height: number }
): Scene | undefined => {
  const canvas = exportToCanvas({ elements: drawing.elements });
  const width = size ? size.width : canvas.width;
  const height = size ? size.height : canvas.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    return {
      id: nanoid(),
      width,
      height,
      imageData: ctx.getImageData(0, 0, width, height),
      drawing,
    };
  }
};

const Preview: React.FC<{ scene: Scene }> = ({ scene }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(scene.imageData, 0, 0);
  }, [scene]);
  return <canvas ref={ref} width={scene.width} height={scene.height} />;
};

type Props = {
  drawing: Drawing;
  onRestore: (drawing: Drawing) => void;
};

const Claymate: React.FC<Props> = ({ drawing, onRestore }) => {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const setModified = useModifiedCheck();

  const currentScene =
    currentIndex !== undefined && currentIndex < scenes.length
      ? { ...scenes[currentIndex], drawing }
      : undefined;

  const moveToScene = (index: number) => {
    onRestore(scenes[index].drawing);
    setCurrentIndex(index);
  };

  const updateScenes = useCallback(
    (
      updater: (prev: Scene[]) => Scene[],
      newCurrent?: { index: number; drawing: Drawing }
    ) => {
      setScenes(updater);
      setModified(true);
      if (newCurrent) {
        onRestore(newCurrent.drawing);
        setCurrentIndex(newCurrent.index);
      }
    },
    [setModified, setCurrentIndex, onRestore]
  );

  const exportGif = () => {
    const gif = new GIF();
    scenes.forEach((scene) => {
      gif.addFrame(scene.imageData);
    });
    gif.on("finished", async (blob: Blob) => {
      await fileSave(blob, {
        fileName: "excalidraw-claymate.gif",
      });
      setModified(false);
    });
    gif.render();
  };

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

  const deleteScene = (id: string) => {
    const index = scenes.findIndex((sc) => sc.id === id);
    if (index >= 0) {
      const remainingScenes = scenes.length - 1;
      let newIndex;
      if (remainingScenes > 0) {
        newIndex = index < remainingScenes ? index : remainingScenes - 1;
      }
      const newCurrent =
        newIndex !== undefined
          ? { index: newIndex, drawing: scenes[newIndex].drawing }
          : undefined;

      updateScenes((prev) => prev.filter((item) => item.id !== id), newCurrent);
    }
  };

  const moveLeft = (id: string) => {
    const index = scenes.findIndex((item) => item.id === id);
    updateScenes(
      (prev) => {
        const tmp = [...prev];
        tmp[index - 1] = prev[index];
        tmp[index] = prev[index - 1];
        return tmp;
      },
      { index: index - 1, drawing: scenes[index].drawing }
    );
  };

  const moveRight = (id: string) => {
    const index = scenes.findIndex((item) => item.id === id);
    updateScenes(
      (prev) => {
        const tmp = [...prev];
        tmp[index + 1] = prev[index];
        tmp[index] = prev[index + 1];
        return tmp;
      },
      { index: index + 1, drawing: scenes[index].drawing }
    );
  };

  const reverseOrder = () => {
    updateScenes(
      (prev) => [...prev].reverse(),
      currentIndex !== undefined
        ? {
            index: scenes.length - 1 - currentIndex,
            drawing: scenes[currentIndex].drawing,
          }
        : undefined
    );
  };

  useEffect(() => {
    if (scenes.length === 0) {
      addScene();
    }
  }, [scenes, addScene]);

  let requiredWidth: number | undefined;
  let requiredHeight: number | undefined;
  if (currentScene != null && scenes.length !== 1) {
    requiredWidth = currentScene.width;
    requiredHeight = currentScene.height;
  }

  useEffect(() => {
    if (currentIndex != null) {
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

  return (
    <div className="Claymate">
      <div className="Claymate-scenes">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`Claymate-scene ${
              index === currentIndex ? "Claymate-current-scene" : ""
            }`}
            onClick={() => moveToScene(index)}
          >
            <Preview scene={scene} />
            <button
              type="button"
              className="Claymate-delete"
              aria-label="Delete"
              onClick={(event) => {
                event.stopPropagation();
                deleteScene(scene.id);
              }}
            >
              &#x2716;
            </button>
            <button
              type="button"
              className="Claymate-left"
              aria-label="Move Left"
              disabled={index === 0}
              onClick={(event) => {
                event.stopPropagation();
                moveLeft(scene.id);
              }}
            >
              &#x2b05;
            </button>
            <button
              type="button"
              className="Claymate-right"
              aria-label="Move Right"
              disabled={index === scenes.length - 1}
              onClick={(event) => {
                event.stopPropagation();
                moveRight(scene.id);
              }}
            >
              &#x27a1;
            </button>
          </div>
        ))}
      </div>
      <div className="Claymate-buttons">
        <button type="button" onClick={addScene}>
          Add scene
        </button>
        <button
          type="button"
          onClick={exportGif}
          disabled={scenes.length === 0}
        >
          Export GIF
        </button>
        <button
          type="button"
          onClick={reverseOrder}
          disabled={scenes.length <= 1}
        >
          Reverse order
        </button>
      </div>
    </div>
  );
};

export default Claymate;
