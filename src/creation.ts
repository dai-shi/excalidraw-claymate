import { nanoid } from 'nanoid';
import { exportToCanvas } from '@excalidraw/excalidraw';
import { DEFAULT_DURATION, Drawing, Scene } from './types';

export const createScene = async (
  drawing: Drawing,
  size?: { width: number; height: number },
): Promise<Scene | undefined> => {
  const exportedCanvas = await exportToCanvas({
    ...drawing,
    elements: drawing.elements.filter((el) => !el.isDeleted),
  });
  const width = size ? size.width : exportedCanvas.width;
  const height = size ? size.height : exportedCanvas.height;
  if (!width || !height) {
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = drawing.appState.viewBackgroundColor ?? '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(exportedCanvas, 0, 0);
    return {
      id: nanoid(),
      width,
      height,
      imageData: ctx.getImageData(0, 0, width, height),
      drawing,
      duration: DEFAULT_DURATION,
    };
  }
};
