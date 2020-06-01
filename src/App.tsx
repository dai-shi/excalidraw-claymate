import React, { useRef } from "react";
import "./App.css";

import { Image } from "./Image";
import { useLoadSvg } from "./useLoadSvg";
import { useDraggableSvg } from "./useDraggableSvg";
import { useSnapshots } from "./useSnapshots";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { svg } = useLoadSvg();
  const { getSvgHtml } = useDraggableSvg(svg, containerRef);
  const { snapshots, addSnapshot } = useSnapshots();
  const add = () => addSnapshot(getSvgHtml());
  return (
    <div className="App">
      <div className="toolbar">
        <button type="button" onClick={add}>
          Add
        </button>
      </div>
      <div className="svg">
        <div ref={containerRef}></div>
      </div>
      <div className="snapshots">
        {snapshots.map((snapshot) => (
          <div
            key={snapshot.id}
            onClick={(e) => (e.target as any).scrollIntoView()}
          >
            <Image image={snapshot.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
