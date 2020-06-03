import React from "react";

import "./App.css";
import "./Excalidraw.scss";
import "./excalidraw/src/css/styles.scss";
import ExcalidrawApp from "./excalidraw/src/components/App";
import Claymate from "./Claymate";

const App: React.FC = () => (
  <div className="ClaymateApp">
    <ExcalidrawApp />
    <Claymate />
  </div>
);

export default App;
