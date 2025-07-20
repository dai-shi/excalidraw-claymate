// @ts-expect-error no types
import GIF from "gif.js/dist/gif";

import { Scene } from "./types";

export const previewGif = (scenes: Scene[]): Promise<string> =>
  new Promise((resolve) => {
    const gif = new GIF();
    scenes.forEach((scene, index) => {
      const last = index + 1 === scenes.length;
      gif.addFrame(scene.imageData, { delay: last ? 2000 : 500 });
    });
    gif.on("finished", (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
    gif.render();
  });
