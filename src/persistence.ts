import { createScene } from "./creation";
import { Drawing, Scene } from "./types";

const ELEMENTS_STORAGE_KEY = "excalidraw-elements";
const SCENE_STORAGE_KEY = "claymate-scenes";

const loadDrawingFromStorage = (): Drawing | null => {
  try {
    const data = JSON.parse(localStorage.getItem(ELEMENTS_STORAGE_KEY) || "");
    data.appState.collaborators = new Map();
    return data;
  } catch (e) {
    return null;
  }
};

export const loadStorage = (): Scene[] | null => {
  try {
    const drawings = JSON.parse(
      localStorage.getItem(SCENE_STORAGE_KEY) || ""
    ) as Drawing[];
    if (drawings && drawings.length > 0) {
      let firstScene: Scene | undefined;
      return drawings.map((drawing) => {
        drawing.appState.collaborators = new Map();
        const scene = createScene(
          drawing,
          firstScene
            ? { width: firstScene.width, height: firstScene.height }
            : undefined
        );
        if (firstScene === undefined) {
          firstScene = scene;
        }
        return scene;
      }) as Scene[];
    }
  } catch {
    try {
      const drawing = loadDrawingFromStorage();
      if (drawing) {
        const scene = createScene(drawing);
        if (scene) {
          return [scene];
        }
      }
    } catch {}
  }
  return null;
};

export const saveStorage = (scenes: Scene[]) => {
  const result = JSON.stringify(scenes.map((s) => s.drawing));
  localStorage.setItem(SCENE_STORAGE_KEY, result);
};
