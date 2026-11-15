import { fileSave } from 'browser-fs-access';

// @ts-expect-error no types
import GIF from 'gif.js/dist/gif';

import { LAST_SCENE_EXTRA_DURATION, Scene } from './types';

export const exportToGif = (scenes: Scene[]) =>
  new Promise<void>((resolve) => {
    const gif = new GIF();
    scenes.forEach((scene, index) => {
      const last = index + 1 === scenes.length;
      const duration = last
        ? scene.duration + LAST_SCENE_EXTRA_DURATION
        : scene.duration;
      gif.addFrame(scene.imageData, { delay: duration });
    });
    gif.on('finished', (blob: Blob) => {
      fileSave(blob, {
        fileName: 'excalidraw-claymate.gif',
      }).then(() => resolve());
    });
    gif.render();
  });
