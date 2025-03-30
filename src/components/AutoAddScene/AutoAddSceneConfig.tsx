import React from "react";
import { AutoSceneConfig } from "../../Claymate";
import "./AutoAddSceneConfig.css";

type Props = {
  autoSceneConfig: AutoSceneConfig;
  setAutoSceneConfig: (autoSceneConfig: AutoSceneConfig) => void;
};

const AutoAddSceneConfig: React.FC<Props> = ({
  autoSceneConfig,
  setAutoSceneConfig,
}) => {
  const toggleAutoAddScene = () => {
    setAutoSceneConfig((prev: AutoSceneConfig) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };
  return (
    <div className="auto-add-configs">
      <div className="flex">
        <input
          type="checkbox"
          checked={autoSceneConfig.enabled}
          onChange={toggleAutoAddScene}
        />
        <span className="text-nobreak">Auto add scene</span>
      </div>
      <div className="flex flex-col">
        <label htmlFor="autoSceneFrequency">Frequency ( Scenes / 10sec )</label>
        <select
          id="autoSceneFrequency"
          value={autoSceneConfig.frequency}
          onChange={(e) => {
            setAutoSceneConfig((prev: AutoSceneConfig) => ({
              ...prev,
              frequency: parseInt(e?.target?.value),
            }));
          }}
        >
          <option value="50">50 Scenes</option>
          <option value="25">25 Scenes</option>
          <option value="10">10 Scenes</option>
        </select>
      </div>
    </div>
  );
};

export default AutoAddSceneConfig;
