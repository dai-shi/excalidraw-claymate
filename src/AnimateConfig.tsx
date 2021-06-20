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

type Props = {
  animateEnabled: boolean;
  setAnimateEnabled: Dispatch<SetStateAction<boolean>>;
  scene: Scene | undefined;
  updateDrawing: (drawing: Drawing) => void;
};

const AnimateConfig: React.FC<Props> = ({
  animateEnabled,
  setAnimateEnabled,
  scene,
  updateDrawing,
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
        Animate duration:{" "}
        {animateDurationSet.size > 1 ? (
          <>(mixed)</>
        ) : (
          <input
            disabled={animateDurationDisabled}
            value={
              (animateDurationSet.size === 1 &&
                animateDurationSet.values().next().value) ||
              0
            }
            onChange={onChangeAnimateDuration}
            type="number"
            style={{ width: 50 }}
          />
        )}
      </div>
    </div>
  );
};

export default AnimateConfig;
