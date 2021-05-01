import { fileSave } from "browser-fs-access";
// @ts-ignore
import GIF from "gif.js/dist/gif";

import { Scene } from "./types";

export const exportToGif = (scenes: Scene[]) =>
  new Promise((resolve) => {
    const gif = new GIF();
    scenes.forEach((scene) => {
      gif.addFrame(scene.imageData);
    });
    gif.on("finished", (blob: Blob) => {
      fileSave(blob, {
        fileName: "excalidraw-claymate.gif",
      }).then(resolve);
    });
    gif.render();
  });
