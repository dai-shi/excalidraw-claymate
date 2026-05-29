/* eslint-disable @typescript-eslint/no-explicit-any */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import * as crypto from 'node:crypto';

import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

try {
  (window as any).crypto = {
    getRandomValues: function (buffer: any) {
      return crypto.randomFillSync(buffer);
    },
  };
} catch {
  //ignore
}
(window as any).Path2D = function () {
  // empty
};
(window as any).FontFace = class {};
(document as any).fonts = new Set();
if (!HTMLCanvasElement.prototype.getContext) {
  const canvasContextMock = new Proxy(
    {},
    {
      get: () => () => {
        // empty
      },
      set: () => true,
    },
  );
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return canvasContextMock;
  };
}
const element = document.createElement('div');
element.id = 'root';
document.body.appendChild(element);

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
