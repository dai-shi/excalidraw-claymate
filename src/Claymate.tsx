import React, { useState } from "react";
import nanoid from "nanoid";

import "./Claymate.css";
import { Island } from "./excalidraw/src/components/Island";
import { globalSceneState } from "./excalidraw/src/scene";
import { exportToCanvas } from "./excalidraw/src/scene/export";
import { AppState } from "./excalidraw/src/types";

const dummyAppState: AppState = {
  isLoading: false,
  errorMessage: null,
  draggingElement: null,
  resizingElement: null,
  multiElement: null,
  selectionElement: null,
  editingElement: null,
  editingLinearElement: null,
  elementType: "selection",
  elementLocked: false,
  exportBackground: false,
  shouldAddWatermark: false,
  currentItemStrokeColor: "",
  currentItemBackgroundColor: "",
  currentItemFillStyle: "",
  currentItemStrokeWidth: -1,
  currentItemStrokeStyle: "solid",
  currentItemRoughness: -1,
  currentItemOpacity: -1,
  currentItemFontFamily: 1,
  currentItemFontSize: -1,
  currentItemTextAlign: "center",
  viewBackgroundColor: "",
  scrollX: -1 as any,
  scrollY: -1 as any,
  cursorX: -1,
  cursorY: -1,
  cursorButton: "up",
  scrolledOutside: false,
  name: "",
  username: "",
  isCollaborating: false,
  isResizing: false,
  isRotating: false,
  zoom: 1,
  openMenu: null,
  lastPointerDownWith: "mouse",
  selectedElementIds: {},
  collaborators: new Map(),
  shouldCacheIgnoreZoom: false,
  showShortcutsDialog: false,
  zenModeEnabled: false,
  selectedGroupIds: {},
  editingGroupId: null,
};

const createDataUrl = () => {
  const elements = globalSceneState.getElements();
  const tempCanvas = exportToCanvas(elements, dummyAppState, dummyAppState);
  tempCanvas.style.display = "none";
  document.body.appendChild(tempCanvas);
  const dataUrl = tempCanvas.toDataURL();
  tempCanvas.remove();
  return dataUrl;
};

const Claymate: React.FC = () => {
  const [snapshots, setSnapshots] = useState<
    {
      id: string;
      dataUrl: string;
    }[]
  >([]);
  const addSnapshot = () => {
    const dataUrl = createDataUrl();
    const id = nanoid();
    setSnapshots((prev) => [...prev, { id, dataUrl }]);
  };
  const deleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((item) => item.id !== id));
  };
  const moveLeft = (id: string) => {
    setSnapshots((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const tmp = [...prev];
      tmp[index - 1] = prev[index];
      tmp[index] = prev[index - 1];
      return tmp;
    });
  };
  const moveRight = (id: string) => {
    setSnapshots((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const tmp = [...prev];
      tmp[index + 1] = prev[index];
      tmp[index] = prev[index + 1];
      return tmp;
    });
  };
  return (
    <Island className="Claymate">
      <div className="Claymate-buttons">
        <button type="button" onClick={addSnapshot}>
          Add snapshot
        </button>
        <button type="button">Export GIF</button>
      </div>
      <div className="Claymate-snapshots">
        {snapshots.map((snapshot, index) => (
          <div key={snapshot.id} className="Claymate-snapshot">
            <img alt="snapshot" src={snapshot.dataUrl} />
            <button
              type="button"
              className="Claymate-delete"
              aria-label="Delete"
              onClick={() => deleteSnapshot(snapshot.id)}
            >
              &#x2716;
            </button>
            <button
              type="button"
              className="Claymate-left"
              aria-label="Move Left"
              disabled={index === 0}
              onClick={() => moveLeft(snapshot.id)}
            >
              &#x2b05;
            </button>
            <button
              type="button"
              className="Claymate-right"
              aria-label="Move Right"
              disabled={index === snapshots.length - 1}
              onClick={() => moveRight(snapshot.id)}
            >
              &#x27a1;
            </button>
          </div>
        ))}
      </div>
    </Island>
  );
};

export default Claymate;
