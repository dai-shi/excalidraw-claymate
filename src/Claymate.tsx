import {
  DragEvent,
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { isEmpty } from 'lodash';

import './Claymate.css';
import type { Drawing, Scene } from './types';
import { exportToGif } from './exportToGif';
import { exportToHtml } from './exportToHtml';
import { importFromFile } from './importFromFile';
import { previewGif } from './previewGif';
import { ClayMateIcons } from './components/Icon';
import { Dialog } from './components/ui';
import AutoAddSceneConfig from './components/AutoAddScene/AutoAddSceneConfig';

const DARK_FILTER = 'invert(93%) hue-rotate(180deg)';

const PreviewInner = ({
  scene,
  darkMode,
}: {
  scene: Scene;
  darkMode: boolean;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(scene.imageData, 0, 0);
  }, [scene]);
  const currentTheme = darkMode ? 'dark' : 'light';
  const sceneTheme = scene.drawing.appState.theme;
  const filter = sceneTheme !== currentTheme ? DARK_FILTER : undefined;
  return (
    <canvas
      ref={ref}
      width={scene.width}
      height={scene.height}
      style={{
        filter,
      }}
    />
  );
};

const Preview = memo(PreviewInner);

type Props = {
  currentIndex: number | undefined;
  scenes: Scene[];
  updateScenes: (
    updater: (prev: Scene[]) => Scene[],
    newCurrent?: { index: number; drawing: Drawing },
  ) => void;
  moveToScene: (index: number) => void;
  addScene: (optionalDrawing?: Drawing) => void;
  clearScenes: () => void;
  autoAddSceneUnit?: number;
};

type PreviewState = {
  open: boolean;
  url: string;
};

export type AutoSceneConfig = {
  enabled: boolean;
  frequency: number;
};

const Claymate = ({
  scenes,
  currentIndex,
  updateScenes,
  moveToScene,
  addScene,
  clearScenes,
  autoAddSceneUnit = 0.1,
}: Props) => {
  const [previewState, setPreviewState] = useState<PreviewState>({
    open: false,
    url: '',
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] =
    useState(false);
  const [showAutoSceneConfig, setShowAutoSceneConfig] = useState(false);
  const [autoSceneConfig, setAutoSceneConfig] = useState<AutoSceneConfig>({
    enabled: false,
    frequency: 50,
  });
  const autoSceneInterval = useRef<NodeJS.Timeout | null>(null);
  const autoSceneFrequencyToInterval = useCallback(
    (frequency: number) => frequency * autoAddSceneUnit * 1000,
    [autoAddSceneUnit],
  );

  const darkMode = scenes[currentIndex || 0]?.drawing.appState.theme === 'dark';

  const handleDrop = async (e: DragEvent) => {
    const file = e.dataTransfer?.files[0];
    const appState =
      currentIndex !== undefined && scenes[currentIndex].drawing.appState;
    if (file && appState) {
      const drawingToAdd = await importFromFile(file, appState);
      if (drawingToAdd) {
        addScene(drawingToAdd);
      }
    }
  };

  const exportGif = async () => {
    await exportToGif(scenes);
  };

  const showPreview = async () => {
    const previewUrl = await previewGif(scenes);
    setPreviewState({ open: true, url: previewUrl });
  };

  const closePreview = () => {
    setPreviewState({ open: false, url: '' });
  };

  const exportHtml = async () => {
    await exportToHtml(scenes, {
      darkMode,
    });
  };

  const moveLeft = (id: string) => {
    const index = scenes.findIndex((item) => item.id === id);
    updateScenes(
      (prev) => {
        const tmp = [...prev];
        tmp[index - 1] = prev[index];
        tmp[index] = prev[index - 1];
        return tmp;
      },
      { index: index - 1, drawing: scenes[index].drawing },
    );
  };

  const moveRight = (id: string) => {
    const index = scenes.findIndex((item) => item.id === id);
    updateScenes(
      (prev) => {
        const tmp = [...prev];
        tmp[index + 1] = prev[index];
        tmp[index] = prev[index + 1];
        return tmp;
      },
      { index: index + 1, drawing: scenes[index].drawing },
    );
  };

  const reverseOrder = () => {
    updateScenes(
      (prev) => [...prev].reverse(),
      currentIndex !== undefined
        ? {
            index: scenes.length - 1 - currentIndex,
            drawing: scenes[currentIndex].drawing,
          }
        : undefined,
    );
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isSingleEmptyScene =
    scenes.length === 0 ||
    (scenes.length === 1 && isEmpty(scenes[0].drawing.elements));

  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;

    if (selectedIds.size === scenes.length) {
      clearScenes();
      setSelectedIds(new Set());
      return;
    }

    const remaining = scenes.filter((scene) => !selectedIds.has(scene.id));

    let nextSelectedScene: { index: number; drawing: Drawing } | undefined;
    if (currentIndex !== undefined) {
      const currentScene = scenes[currentIndex];
      let targetScene: Scene | undefined;
      if (currentScene && !selectedIds.has(currentScene.id)) {
        targetScene = currentScene;
      } else {
        // nearest surviving scene before the current one, else the first remaining
        targetScene = [...scenes.slice(0, currentIndex)]
          .reverse()
          .find((scene) => !selectedIds.has(scene.id));
        targetScene = targetScene ?? remaining[0];
      }
      const nextIndex = remaining.findIndex(
        (scene) => scene.id === targetScene?.id,
      );
      nextSelectedScene = {
        index: nextIndex,
        drawing: remaining[nextIndex].drawing,
      };
    }

    updateScenes(
      (prev) => prev.filter((scene) => !selectedIds.has(scene.id)),
      nextSelectedScene,
    );
    setSelectedIds(new Set());
  }, [selectedIds, scenes, currentIndex, clearScenes, updateScenes]);

  // Keep the selection in sync with the scenes that still exist.
  useEffect(() => {
    setSelectedIds((prev) => {
      const existingIds = new Set(scenes.map((scene) => scene.id));
      let changed = false;
      const next = new Set<string>();
      prev.forEach((id) => {
        if (existingIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [scenes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      // Don't interfere with deleting elements inside the Excalidraw canvas.
      if (
        typeof target.closest === 'function' &&
        target.closest('.excalidraw')
      ) {
        return;
      }
      // Don't interfere with text entry or select elements.
      if (
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )
        return;
      if (target.tagName === 'INPUT') {
        const type = (target as HTMLInputElement).type;
        if (type !== 'checkbox' && type !== 'radio' && type !== 'button') {
          return;
        }
      }
      if (selectedIds.size > 0) {
        setShowDeleteSelectedConfirm(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds.size]);

  const confirmClearAll = () => {
    clearScenes();
    setSelectedIds(new Set());
    setShowClearConfirm(false);
  };

  useEffect(() => {
    if (autoSceneConfig.enabled) {
      autoSceneInterval.current = setInterval(
        () => addScene(),
        autoSceneFrequencyToInterval(autoSceneConfig.frequency),
      );
    }
    return () => {
      if (autoSceneInterval.current) {
        clearInterval(autoSceneInterval.current);
      }
    };
  }, [autoSceneConfig, addScene, autoSceneFrequencyToInterval]);
  return (
    <div
      className="Claymate"
      style={{
        filter: darkMode ? DARK_FILTER : undefined,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="Claymate-scenes">
        {scenes.map((scene, index) => {
          let testId = 'MissingId';
          if (!isEmpty(scenes[index].drawing.elements)) {
            testId = scenes[index].drawing.elements[0].id;
          }
          return (
            <div
              key={scene.id}
              className={`Claymate-scene ${
                index === currentIndex ? 'Claymate-current-scene' : ''
              }`}
              onClick={() => moveToScene(index)}
              aria-hidden="true"
              data-testid={testId}
            >
              <Preview scene={scene} darkMode={darkMode} />
              <input
                type="checkbox"
                className="Claymate-select"
                aria-label="Select scene"
                checked={selectedIds.has(scene.id)}
                onChange={() => toggleSelected(scene.id)}
                onClick={(event) => event.stopPropagation()}
              />
              <button
                type="button"
                className="Claymate-left"
                aria-label="Move Left"
                disabled={index === 0}
                onClick={(event) => {
                  event.stopPropagation();
                  moveLeft(scene.id);
                }}
              >
                &#x2b05;
              </button>
              <button
                type="button"
                className="Claymate-right"
                aria-label="Move Right"
                disabled={index === scenes.length - 1}
                onClick={(event) => {
                  event.stopPropagation();
                  moveRight(scene.id);
                }}
              >
                &#x27a1;
              </button>
            </div>
          );
        })}
      </div>
      <div className="Claymate-configs">
        {showAutoSceneConfig && (
          <AutoAddSceneConfig
            autoSceneConfig={autoSceneConfig}
            setAutoSceneConfig={setAutoSceneConfig}
          />
        )}
      </div>

      <div className="Claymate-buttons">
        <div className="flex">
          <button
            type="button"
            title="Show auto add scene config"
            onClick={() => setShowAutoSceneConfig((x) => !x)}
          >
            {showAutoSceneConfig ? <>&#9656;</> : <>&#9666;</>}
          </button>
          <button type="button" title="Add scene" onClick={() => addScene()}>
            {autoSceneConfig.enabled && (
              <span
                className="auto-add-scene-tag flex"
                title="Auto add scene enabled"
              >
                <ClayMateIcons.Loading />
              </span>
            )}
            Add scene
          </button>
        </div>
        <div>
          <button
            type="button"
            disabled={scenes.length === 0}
            onClick={showPreview}
            title="Preview GIF"
          >
            <ClayMateIcons.Preview />
          </button>
          <button
            type="button"
            onClick={exportGif}
            disabled={scenes.length === 0}
            title="Export GIF"
          >
            <ClayMateIcons.Export />
            Export GIF
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => exportHtml()}
            disabled={scenes.length === 0}
            title="Export HTML"
          >
            Export HTML
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={reverseOrder}
            disabled={scenes.length <= 1}
          >
            Reverse order
          </button>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={isSingleEmptyScene}
          >
            Clear all
          </button>
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={() => setShowDeleteSelectedConfirm(true)}
            >
              Clear selected ({selectedIds.size})
            </button>
          )}
        </div>
      </div>

      {/* Preview GIF Dialog */}
      {previewState.open && (
        <Dialog
          open={previewState.open}
          title="Preview GIF"
          handleClose={closePreview}
        >
          <div className="preview-gif-wrapper">
            <img
              src={previewState.url}
              alt="Preview GIF"
              className="preview-gif"
            />
          </div>
        </Dialog>
      )}

      {/* Clear all confirmation Dialog */}
      {showClearConfirm && (
        <Dialog
          open={showClearConfirm}
          title="Clear all scenes?"
          handleClose={() => setShowClearConfirm(false)}
          actions={
            <>
              <button type="button" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button type="button" onClick={confirmClearAll}>
                Clear
              </button>
            </>
          }
        >
          <p>This removes every scene and leaves a single empty scene.</p>
        </Dialog>
      )}

      {/* Clear selected confirmation Dialog */}
      {showDeleteSelectedConfirm && (
        <Dialog
          open={showDeleteSelectedConfirm}
          title={`Clear ${selectedIds.size} scene${selectedIds.size > 1 ? 's' : ''}?`}
          handleClose={() => setShowDeleteSelectedConfirm(false)}
          actions={
            <>
              <button
                type="button"
                onClick={() => setShowDeleteSelectedConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteSelected();
                  setShowDeleteSelectedConfirm(false);
                }}
              >
                Clear
              </button>
            </>
          }
        >
          <p>
            Clear {selectedIds.size} selected scene
            {selectedIds.size > 1 ? 's' : ''}?
          </p>
        </Dialog>
      )}
    </div>
  );
};

export default Claymate;
