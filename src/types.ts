export type Drawing = { elements: unknown[]; appState: unknown };

export type Scene = {
  id: string;
  width: number;
  height: number;
  imageData: ImageData;
  drawing: Drawing;
};
