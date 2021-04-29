import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { fileSave } from "browser-nativefs";
// @ts-ignore
import GIF from "gif.js/dist/gif";
// @ts-ignore
import { exportToCanvas } from "@excalidraw/utils";

import "./Claymate.css";
import { useModifiedCheck } from "./useModifiedCheck";

type Snapshot = {
  id: string;
  width: number;
  height: number;
  imageData: ImageData;
};

const createSnapshot = (
  lastElementsRef: MutableRefObject<unknown[]>,
  size?: { width: number; height: number }
): Snapshot => {
  const canvas = exportToCanvas({ elements: lastElementsRef.current });
  const width = size ? size.width : canvas.width;
  const height = size ? size.height : canvas.height;
  const ctx = canvas.getContext("2d");
  return {
    id: nanoid(),
    width,
    height,
    imageData: ctx.getImageData(0, 0, width, height),
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
  lastElementsRef: MutableRefObject<unknown[]>;
};

const Claymate: React.FC<Props> = ({ lastElementsRef }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const setModified = useModifiedCheck();

  const updateSnapshots = (updater: (prev: Snapshot[]) => Snapshot[]) => {
    setSnapshots(updater);
    setModified(true);
  };

  const exportGif = () => {
    const gif = new GIF();
    snapshots.forEach((snapshot) => {
      gif.addFrame(snapshot.imageData);
    });
    gif.on("finished", async (blob: Blob) => {
      await fileSave(blob, {
        fileName: "excalidraw-claymate.gif",
      });
    });
    gif.render();
    setModified(false);
  };

  const addSnapshot = () => {
    const snapshot = createSnapshot(
      lastElementsRef,
      snapshots[0] && {
        width: snapshots[0].width,
        height: snapshots[0].height,
      }
    );
    updateSnapshots((prev) => [...prev, snapshot]);
  };

  const deleteSnapshot = (id: string) => {
    updateSnapshots((prev) => prev.filter((item) => item.id !== id));
  };

  const moveLeft = (id: string) => {
    updateSnapshots((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const tmp = [...prev];
      tmp[index - 1] = prev[index];
      tmp[index] = prev[index - 1];
      return tmp;
    });
  };

  const moveRight = (id: string) => {
    updateSnapshots((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const tmp = [...prev];
      tmp[index + 1] = prev[index];
      tmp[index] = prev[index + 1];
      return tmp;
    });
  };

  const reverseOrder = () => {
    updateSnapshots((prev) => [...prev].reverse());
  };

  return (
    <div className="Claymate">
      <div className="Claymate-snapshots">
        {snapshots.map((snapshot, index) => (
          <div key={snapshot.id} className="Claymate-snapshot">
            <Preview snapshot={snapshot} />
            <button
              type="button"
              className="Claymate-delete"
              aria-label="Delete"
              onClick={() => deleteSnapshot(snapshot.id)}
            >
              &#x2716;
            </button>
            <button
              type="button"
              className="Claymate-left"
              aria-label="Move Left"
              disabled={index === 0}
              onClick={() => moveLeft(snapshot.id)}
            >
              &#x2b05;
            </button>
            <button
              type="button"
              className="Claymate-right"
              aria-label="Move Right"
              disabled={index === snapshots.length - 1}
              onClick={() => moveRight(snapshot.id)}
            >
              &#x27a1;
            </button>
          </div>
        ))}
      </div>
      <div className="Claymate-buttons">
        <button type="button" onClick={addSnapshot}>
          Add snapshot
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
