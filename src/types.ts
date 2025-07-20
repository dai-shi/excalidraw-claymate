import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types';

export type Drawing = {
  elements: ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles | null;
};

export type Scene = {
  id: string;
  width: number;
  height: number;
  imageData: ImageData;
  drawing: Drawing;
};
