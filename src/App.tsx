import React from "react";

import "./App.css";
import "./Excalidraw.scss";
import "./excalidraw/src/css/styles.scss";
import { TopErrorBoundary } from "./excalidraw/src/components/TopErrorBoundary";
import { InitializeApp } from "./excalidraw/src/components/InitializeApp";
import { IsMobileProvider } from "./excalidraw/src/is-mobile";
import ExcalidrawApp from "./excalidraw/src/components/App";
import Claymate from "./Claymate";

const App: React.FC = () => (
  <div className="ClaymateApp">
    <TopErrorBoundary>
      <IsMobileProvider>
        <InitializeApp>
          <ExcalidrawApp />
          <Claymate />
        </InitializeApp>
      </IsMobileProvider>
    </TopErrorBoundary>
  </div>
);

export default App;
