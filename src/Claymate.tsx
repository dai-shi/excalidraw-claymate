import React, { useEffect, useRef } from "react";

import "./Claymate.css";
import { Drawing, Scene } from "./types";
import { exportToGif } from "./exportToGif";
import { exportToHtml } from "./exportToHtml";

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
  currentIndex: number | undefined;
  scenes: Scene[];
  updateScenes: (
    updater: (prev: Scene[]) => Scene[],
    newCurrent?: { index: number; drawing: Drawing }
  ) => void;
  moveToScene: (index: number) => void;
  addScene: () => void;
};

const Claymate: React.FC<Props> = ({
  scenes,
  currentIndex,
  updateScenes,
  moveToScene,
  addScene,
}) => {
  const exportGif = async () => {
    await exportToGif(scenes);
  };

  const exportHtml = async () => {
    await exportToHtml(scenes);
  };

  const deleteScene = (id: string) => {
    const index = scenes.findIndex((sc) => sc.id === id);
    if (index >= 0) {
      const remainingScenes = scenes.length - 1;
      if (remainingScenes > 0) {
        let newCurrent;
        if (currentIndex !== undefined) {
          const changingCurrentScene =
            currentIndex === remainingScenes && index === currentIndex;
          if (currentIndex > index || changingCurrentScene) {
            newCurrent = {
              index: currentIndex - 1,
              drawing:
                scenes[changingCurrentScene ? currentIndex - 1 : currentIndex]
                  .drawing,
            };
          }
        }
        updateScenes(
          (prev: Scene[]) => prev.filter((item) => item.id !== id),
          newCurrent
        );
      }
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
              disabled={scenes.length <= 1}
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
          onClick={exportHtml}
          disabled={scenes.length === 0}
        >
          Export HTML
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
