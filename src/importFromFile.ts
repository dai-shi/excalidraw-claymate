import { AppState } from "@excalidraw/excalidraw/types/types";
import { loadFromBlob } from "@excalidraw/excalidraw";
import svgToEx from "svg-to-excalidraw";

import { Drawing } from "./types";

export const importFromFile = async (
  file: File,
  appState: AppState
): Promise<Drawing | null> => {
  if (file.name.endsWith(".excalidraw")) {
    const result = await loadFromBlob(file, appState, null);
    return {
      ...result,
      appState: { ...appState, ...result.appState },
    };
  }
  if (file.type === "image/svg+xml") {
    const elements = await convertSvgToElements(file);
    return { elements, appState };
  }
  console.log("Unsupported file dropped", file);
  window.alert("Unsupported file dropped");
  return null;
};

export const convertSvgToElements = async (
  file: File
): Promise<Drawing["elements"]> => {
  const text = await file.text();
  const { hasErrors, content } = svgToEx.convert(text);
  if (hasErrors) {
    throw Error("Error in convertSvgToElements");
  }
  return content.elements;
};
