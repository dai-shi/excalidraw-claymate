import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";

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
