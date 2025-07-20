import * as React from "react";
import { AutoSceneConfig } from "../../Claymate";
import "./AutoAddSceneConfig.css";

interface Props {
  autoSceneConfig: AutoSceneConfig;
  setAutoSceneConfig: React.Dispatch<React.SetStateAction<AutoSceneConfig>>;
}

const AutoAddSceneConfig: React.FC<Props> = ({
  autoSceneConfig,
  setAutoSceneConfig,
}) => {
  const toggleAutoAddScene = () => {
    setAutoSceneConfig((prev) => ({
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
            setAutoSceneConfig((prev) => ({
              ...prev,
              frequency: parseInt(e.target.value),
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
