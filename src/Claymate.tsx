import React, { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { fileSave } from "browser-nativefs";
// @ts-ignore
import GIF from "gif.js/dist/gif";
// @ts-ignore
import { exportToCanvas } from "@excalidraw/utils";

import "./Claymate.css";
import { Drawing } from "./types";
import { useModifiedCheck } from "./useModifiedCheck";

type Snapshot = {
  id: string;
  width: number;
  height: number;
  imageData: ImageData;
  drawing: Drawing;
};

const createSnapshot = (
  drawing: Drawing,
  size?: { width: number; height: number }
): Snapshot => {
  const canvas = exportToCanvas({ elements: drawing.elements });
  const width = size ? size.width : canvas.width;
  const height = size ? size.height : canvas.height;
  const ctx = canvas.getContext("2d");
  return {
    id: nanoid(),
    width,
    height,
    imageData: ctx.getImageData(0, 0, width, height),
    drawing,
  };
};

const Preview: React.FC<{ snapshot: Snapshot }> = ({ snapshot }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(snapshot.imageData, 0, 0);
  }, [snapshot]);
  return <canvas ref={ref} width={snapshot.width} height={snapshot.height} />;
};

type Props = {
  drawing: Drawing;
  onRestore: (drawing: Drawing) => void;
};

const Claymate: React.FC<Props> = ({ drawing, onRestore }) => {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const setModified = useModifiedCheck();

  const currentSnapshot =
    currentIndex !== undefined && currentIndex < snapshots.length
      ? { ...snapshots[currentIndex], drawing }
      : undefined;

  const changeToSnapshot = (index: number) => {
    onRestore(snapshots[index].drawing);
    setCurrentIndex(index);
  };

  const updateSnapshots = useCallback(
    (
      updater: (prev: Snapshot[]) => Snapshot[],
      newCurrent?: { index: number; drawing: Drawing }
    ) => {
      setSnapshots(updater);
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
    snapshots.forEach((snapshot) => {
      gif.addFrame(snapshot.imageData);
    });
    gif.on("finished", async (blob: Blob) => {
      await fileSave(blob, {
        fileName: "excalidraw-claymate.gif",
      });
      setModified(false);
    });
    gif.render();
  };

  const addSnapshot = useCallback(() => {
    if (drawing) {
      const snapshot = createSnapshot(
        drawing,
        snapshots[0] && {
          width: snapshots[0].width,
          height: snapshots[0].height,
        }
      );
      updateSnapshots((prev) => [...prev, snapshot], {
        index: snapshots.length,
        drawing: drawing,
      });
    }
  }, [updateSnapshots, snapshots, drawing]);

  const deleteSnapshot = (id: string) => {
    const index = snapshots.findIndex((sc) => sc.id === id);
    if (index >= 0) {
      const remainingSnapshots = snapshots.length - 1;
      let newIndex;
      if (remainingSnapshots > 0) {
        newIndex = index < remainingSnapshots ? index : remainingSnapshots - 1;
      }
      const newCurrent =
        newIndex !== undefined
          ? { index: newIndex, drawing: snapshots[newIndex].drawing }
          : undefined;

      updateSnapshots(
        (prev) => prev.filter((item) => item.id !== id),
        newCurrent
      );
    }
  };

  const moveLeft = (id: string) => {
    const index = snapshots.findIndex((item) => item.id === id);
    updateSnapshots(
      (prev) => {
        const tmp = [...prev];
        tmp[index - 1] = prev[index];
        tmp[index] = prev[index - 1];
        return tmp;
      },
      { index: index - 1, drawing: snapshots[index].drawing }
    );
  };

  const moveRight = (id: string) => {
    const index = snapshots.findIndex((item) => item.id === id);
    updateSnapshots(
      (prev) => {
        const tmp = [...prev];
        tmp[index + 1] = prev[index];
        tmp[index] = prev[index + 1];
        return tmp;
      },
      { index: index + 1, drawing: snapshots[index].drawing }
    );
  };

  const reverseOrder = () => {
    updateSnapshots(
      (prev) => [...prev].reverse(),
      currentIndex !== undefined
        ? {
            index: snapshots.length - 1 - currentIndex,
            drawing: snapshots[currentIndex].drawing,
          }
        : undefined
    );
  };

  useEffect(() => {
    if (snapshots.length === 0) {
      addSnapshot();
    }
  }, [snapshots, addSnapshot]);

  let requiredWidth: number | undefined;
  let requiredHeight: number | undefined;
  if (currentSnapshot != null && snapshots.length !== 1) {
    requiredWidth = currentSnapshot.width;
    requiredHeight = currentSnapshot.height;
  }

  useEffect(() => {
    if (currentIndex != null) {
      const snapshot = createSnapshot(
        drawing,
        requiredWidth === undefined || requiredHeight === undefined
          ? undefined
          : {
              width: requiredWidth,
              height: requiredHeight,
            }
      );
      updateSnapshots((prev) => {
        const result = [...prev];
        result[currentIndex] = snapshot;
        return result;
      }, undefined);
    }
  }, [
    drawing,
    currentIndex,
    snapshots.length,
    updateSnapshots,
    requiredWidth,
    requiredHeight,
  ]);

  return (
    <div className="Claymate">
      <div className="Claymate-snapshots">
        {snapshots.map((snapshot, index) => (
          <div
            key={snapshot.id}
            className={`Claymate-snapshot ${
              index === currentIndex ? "Claymate-current-snapshot" : ""
            }`}
            onClick={() => changeToSnapshot(index)}
          >
            <Preview snapshot={snapshot} />
            <button
              type="button"
              className="Claymate-delete"
              aria-label="Delete"
              onClick={(event) => {
                event.stopPropagation();
                deleteSnapshot(snapshot.id);
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
                moveLeft(snapshot.id);
              }}
            >
              &#x2b05;
            </button>
            <button
              type="button"
              className="Claymate-right"
              aria-label="Move Right"
              disabled={index === snapshots.length - 1}
              onClick={(event) => {
                event.stopPropagation();
                moveRight(snapshot.id);
              }}
            >
              &#x27a1;
            </button>
          </div>
        ))}
      </div>
      <div className="Claymate-buttons">
        <button type="button" onClick={addSnapshot}>
          Add scene
        </button>
        <button
          type="button"
          onClick={exportGif}
          disabled={snapshots.length === 0}
        >
          Export GIF
        </button>
        <button
          type="button"
          onClick={reverseOrder}
          disabled={snapshots.length <= 1}
        >
          Reverse order
        </button>
      </div>
    </div>
  );
};

export default Claymate;
