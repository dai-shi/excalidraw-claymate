import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";

export type Drawing = { elements: ExcalidrawElement[]; appState: AppState };
