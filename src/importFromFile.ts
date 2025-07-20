import type {
  ExcalidrawElement,
  ExcalidrawRectangleElement,
} from '@excalidraw/excalidraw/element/types';
import type { AppState } from '@excalidraw/excalidraw/types';
import { loadFromBlob } from '@excalidraw/excalidraw';
import * as svgToEx from 'svg-to-excalidraw';
import { nanoid } from 'nanoid';

import { Drawing } from './types';

export const importFromFile = async (
  file: File,
  appState: AppState
): Promise<Drawing | null> => {
  if (file.name.endsWith('.excalidraw')) {
    const result = await loadFromBlob(file, appState, null);
    return {
      ...result,
      appState: { ...appState, ...result.appState },
    };
  }
  if (file.type === 'image/svg+xml') {
    const elements = await convertSvgToElements(file);
    return { elements, appState, files: null };
  }
  if (file.type.startsWith('image/')) {
    const elements = await convertImageToElements(file);
    return { elements, appState, files: null };
  }
  console.log('Unsupported file dropped', file);
  window.alert('Unsupported file dropped');
  return null;
};

export const convertSvgToElements = async (
  file: File
): Promise<Drawing['elements']> => {
  const text = await file.text();
  const { hasErrors, content } = svgToEx.convert(text);
  if (hasErrors) {
    throw Error('Error in convertSvgToElements');
  }
  return content.elements;
};

export const convertImageToElements = async (
  file: File
): Promise<Drawing['elements']> => {
  const bitmap = await createImageBitmap(file);
  const scale = 64 / Math.max(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw Error('Error in convertSvgToElements');
  }
  ctx.drawImage(
    bitmap,
    0,
    0,
    bitmap.width,
    bitmap.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const elements: ExcalidrawElement[] = [];
  const groupId = nanoid();
  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      const [r, g, b, a] = imageData.data.slice((y * canvas.width + x) * 4);
      const element: ExcalidrawRectangleElement = {
        type: 'rectangle',
        id: nanoid(),
        x: 300 + x * 5,
        y: 100 + y * 5,
        strokeColor: 'transparent',
        backgroundColor: `rgba(${r},${g},${b},${a})`,
        fillStyle: 'solid',
        strokeWidth: 1,
        strokeStyle: 'solid',
        roundness: null,
        roughness: 0,
        opacity: 100,
        width: 5,
        height: 5,
        angle: 0,
        seed: 0,
        version: 1,
        versionNonce: 0,
        index: null,
        isDeleted: false,
        groupIds: [groupId],
        frameId: null,
        boundElements: null,
        updated: 1,
        link: null,
        locked: false,
      };
      elements.push(element);
    }
  }
  return elements;
};
