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

const Preview = memo<{ scene: Scene; darkMode: boolean }>(
  ({ scene, darkMode }) => {
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
  }
);

type Props = {
  currentIndex: number | undefined;
  scenes: Scene[];
  updateScenes: (
    updater: (prev: Scene[]) => Scene[],
    newCurrent?: { index: number; drawing: Drawing }
  ) => void;
  moveToScene: (index: number) => void;
  addScene: (optionalDrawing?: Drawing) => void;
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
  autoAddSceneUnit = 0.1,
}: Props) => {
  const [previewState, setPreviewState] = useState<PreviewState>({
    open: false,
    url: '',
  });
  const [showAutoSceneConfig, setShowAutoSceneConfig] = useState(false);
  const [autoSceneConfig, setAutoSceneConfig] = useState<AutoSceneConfig>({
    enabled: false,
    frequency: 50,
  });
  const autoSceneInterval = useRef<NodeJS.Timeout | null>(null);
  const autoSceneFrequencyToInterval = useCallback(
    (frequency: number) => frequency * autoAddSceneUnit * 1000,
    [autoAddSceneUnit]
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

  const deleteScene = (id: string) => {
    const deletedSceneIndex = scenes.findIndex((item) => item.id === id);
    if (deletedSceneIndex < 0) return;
    let nextSelectedScene = undefined;

    if (currentIndex !== undefined) {
      const remainingScenesCount = scenes.length - 1;
      const nextIndex =
        currentIndex === remainingScenesCount ||
        currentIndex > deletedSceneIndex
          ? currentIndex - 1
          : currentIndex;

      const nextDrawingIndex =
        deletedSceneIndex <= currentIndex &&
        remainingScenesCount !== deletedSceneIndex
          ? nextIndex + 1
          : nextIndex;

      nextSelectedScene = {
        index: nextIndex,
        drawing: scenes[nextDrawingIndex].drawing,
      };
    }

    updateScenes((prev) => {
      const next = [...prev];
      next.splice(deletedSceneIndex, 1);
      return next;
    }, nextSelectedScene);
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
      { index: index - 1, drawing: scenes[index].drawing }
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
      { index: index + 1, drawing: scenes[index].drawing }
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
        : undefined
    );
  };

  useEffect(() => {
    if (autoSceneConfig.enabled) {
      autoSceneInterval.current = setInterval(
        () => addScene(),
        autoSceneFrequencyToInterval(autoSceneConfig.frequency)
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
              data-testid={testId}
            >
              <Preview scene={scene} darkMode={darkMode} />
              <button
                type="button"
                className="Claymate-delete"
                aria-label="Delete"
                disabled={scenes.length <= 1}
                onClick={(event) => {
                  event.stopPropagation();
                  deleteScene(scene.id);
                }}
              >
                &#x2716;
              </button>
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
        <button
          type="button"
          onClick={reverseOrder}
          disabled={scenes.length <= 1}
        >
          Reverse order
        </button>
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
    </div>
  );
};

export default Claymate;
