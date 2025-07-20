import { fileSave } from "browser-fs-access";

// @ts-expect-error no types
import GIF from "gif.js/dist/gif";

import { Scene } from "./types";

export const exportToGif = (scenes: Scene[]) =>
  new Promise<void>((resolve) => {
    const gif = new GIF();
    scenes.forEach((scene, index) => {
      const last = index + 1 === scenes.length;
      gif.addFrame(scene.imageData, { delay: last ? 2000 : 500 });
    });
    gif.on("finished", (blob: Blob) => {
      fileSave(blob, {
        fileName: "excalidraw-claymate.gif",
      }).then(() => resolve());
    });
    gif.render();
  });
