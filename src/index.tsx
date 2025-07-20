import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
