import React, { ChangeEvent, Dispatch, SetStateAction } from "react";

import "./AnimateConfig.css";
import { Drawing, Scene } from "./types";

const extractNumberFromId = (id: string, key: string) => {
  const match = id.match(new RegExp(`${key}:(-?\\d+)`));
  return match === null ? undefined : Number(match[1]) || 0;
};

const applyNumberInId = (
  drawing: Drawing,
  ids: string[],
  key: string,
  value: number
): Drawing => {
  const selectedElementIds = { ...drawing.appState.selectedElementIds };
  const elements = drawing.elements.map((element) => {
    const { id } = element;
    if (!ids.includes(id)) {
      return element;
    }
    let newId: string;
    const match = id.match(new RegExp(`${key}:(-?\\d+)`));
    if (match) {
      newId = id.replace(new RegExp(`${key}:(-?\\d+)`), `${key}:${value}`);
    } else {
      newId = id + `-${key}:${value}`;
    }
    if (id === newId) {
      return element;
    }
    selectedElementIds[newId] = selectedElementIds[id];
    delete selectedElementIds[id];
    return { ...element, id: newId };
  });
  return {
    elements,
    appState: {
      ...drawing.appState,
      selectedElementIds,
    },
  };
};

export type AnimateOptions = {
  pointerImg?: string;
  pointerWidth?: string;
};

type Props = {
  animateEnabled: boolean;
  setAnimateEnabled: Dispatch<SetStateAction<boolean>>;
  scene: Scene | undefined;
  updateDrawing: (drawing: Drawing) => void;
  animateOptions: AnimateOptions;
  setAnimateOptions: Dispatch<SetStateAction<AnimateOptions>>;
};

const AnimateConfig: React.FC<Props> = ({
  animateEnabled,
  setAnimateEnabled,
  scene,
  updateDrawing,
  animateOptions,
  setAnimateOptions,
}) => {
  const elements = scene?.drawing.elements ?? [];
  const selectedIds = scene
    ? Object.keys(scene.drawing.appState.selectedElementIds ?? {}).filter(
        (id) =>
          scene.drawing.appState.selectedElementIds[id] &&
          elements.some((element) => element.id === id)
      )
    : [];

  const animateOrderSet = new Set<number | undefined>();
  selectedIds.forEach((id) => {
    animateOrderSet.add(extractNumberFromId(id, "animateOrder"));
  });
  const onChangeAnimateOrder = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value));
    if (scene && Number.isFinite(value)) {
      updateDrawing(
        applyNumberInId(scene.drawing, selectedIds, "animateOrder", value)
      );
    }
  };
  const animateOrderDisabled = !animateEnabled || !animateOrderSet.size;

  const animateDurationSet = new Set<number | undefined>();
  selectedIds.forEach((id) => {
    animateDurationSet.add(extractNumberFromId(id, "animateDuration"));
  });
  const onChangeAnimateDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value));
    if (scene && Number.isFinite(value)) {
      updateDrawing(
        applyNumberInId(scene.drawing, selectedIds, "animateDuration", value)
      );
    }
  };
  const animateDurationDisabled = !animateEnabled || !animateDurationSet.size;

  const onChangeAnimatePointerText = (e: ChangeEvent<HTMLInputElement>) => {
    setAnimateOptions((prev) => ({
      ...prev,
      pointerImg: e.target.value,
    }));
  };

  const onChangeAnimatePointerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const pointerImg = reader.result;
        setAnimateOptions((prev) => ({ ...prev, pointerImg }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onChangeAnimatePointerWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setAnimateOptions((prev) => ({
      ...prev,
      pointerWidth: e.target.value,
    }));
  };

  return (
    <div className="AnimateConfig">
      <div>
        <label>
          <input
            type="checkbox"
            checked={animateEnabled}
            onChange={() => setAnimateEnabled((x) => !x)}
          />
          Enable animate
        </label>
      </div>
      <div style={{ opacity: animateOrderDisabled ? 0.3 : 1.0 }}>
        Animate order:{" "}
        {animateOrderSet.size > 1 ? (
          <>(mixed)</>
        ) : (
          <input
            disabled={animateOrderDisabled}
            value={
              (animateOrderSet.size === 1 &&
                animateOrderSet.values().next().value) ||
              0
            }
            onChange={onChangeAnimateOrder}
            type="number"
            style={{ width: 40 }}
          />
        )}
      </div>
      <div style={{ opacity: animateDurationDisabled ? 0.3 : 1.0 }}>
        Animate duration (ms):{" "}
        {animateDurationSet.size > 1 ? (
          <>(mixed)</>
        ) : (
          <input
            disabled={animateDurationDisabled}
            value={
              (animateDurationSet.size === 1 &&
                animateDurationSet.values().next().value) ||
              ""
            }
            onChange={onChangeAnimateDuration}
            placeholder="Default"
            style={{ width: 50 }}
          />
        )}
      </div>
      <div style={{ opacity: !animateEnabled ? 0.3 : 1.0 }}>
        Animate pointer:{" "}
        <input
          disabled={!animateEnabled}
          value={animateOptions.pointerImg || ""}
          onChange={onChangeAnimatePointerText}
          placeholder="URL..."
          style={{ width: 50 }}
        />{" "}
        <label
          className={`AnimateConfig-button-like ${
            animateEnabled
              ? "AnimateConfig-button-like-enabled"
              : "AnimateConfig-button-like-disabled"
          }`}
        >
          <input
            disabled={!animateEnabled}
            type="file"
            accept="image/*"
            onChange={onChangeAnimatePointerFile}
            style={{ width: 0 }}
          />
          File
        </label>
      </div>
      <div style={{ opacity: !animateEnabled ? 0.3 : 1.0 }}>
        (Pointer width:{" "}
        <input
          disabled={!animateEnabled}
          value={animateOptions.pointerWidth || ""}
          onChange={onChangeAnimatePointerWidth}
          placeholder="Num..."
          style={{ width: 50 }}
        />
        )
      </div>
    </div>
  );
};

export default AnimateConfig;
