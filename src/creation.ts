import { nanoid } from 'nanoid';
import { exportToCanvas } from '@excalidraw/excalidraw';
import { Drawing, Scene } from './types';

export const createScene = async (
  drawing: Drawing,
  size?: { width: number; height: number },
): Promise<Scene | undefined> => {
  const canvas = await exportToCanvas(drawing);
  const width = size ? size.width : canvas.width;
  const height = size ? size.height : canvas.height;
  if (!width || !height) {
    return;
  }
  const ctx = canvas.getContext('2d');
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
