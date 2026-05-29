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
  const createCanvasContextMock = (canvas: HTMLCanvasElement) =>
    new Proxy<Record<string, unknown>>(
      {
        canvas,
        fillStyle: '#000000',
        strokeStyle: '#000000',
        globalAlpha: 1,
        lineWidth: 1,
        font: '10px sans-serif',
      },
      {
        get: (target, prop) =>
          prop in target ? target[prop as string] : () => {},
        set: (target, prop, value) => {
          target[prop as string] = value;
          return true;
        },
      },
    );
  (HTMLCanvasElement.prototype as any).getContext = function (
    contextId: string,
  ) {
    if (contextId !== '2d') {
      return null;
    }
    if (!(this as any).__mockContext2d) {
      (this as any).__mockContext2d = createCanvasContextMock(this);
    }
    return (this as any).__mockContext2d;
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
