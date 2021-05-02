import { nanoid } from "nanoid";
import { exportToCanvas } from "@excalidraw/excalidraw";
import { Drawing, Scene } from "./types";

export const createScene = (
  drawing: Drawing,
  size?: { width: number; height: number }
): Scene | undefined => {
  const canvas = exportToCanvas({ elements: drawing.elements });
  const width = size ? size.width : canvas.width;
  const height = size ? size.height : canvas.height;
  const ctx = canvas.getContext("2d");
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
