import { AppState } from "@excalidraw/excalidraw/types/types";
import { loadFromBlob } from "@excalidraw/excalidraw";
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
  console.log("Unsupported file dropped", file);
  window.alert("Unsupported file dropped");
  return null;
};
