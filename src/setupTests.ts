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
{
  const noop = () => {};
  const createCanvasContextMock = (canvas: HTMLCanvasElement) => ({
    canvas,
    fillStyle: '#000000',
    strokeStyle: '#000000',
    globalAlpha: 1,
    lineWidth: 1,
    font: '10px sans-serif',
    filter: 'none',
    save: noop,
    restore: noop,
    scale: noop,
    rotate: noop,
    translate: noop,
    transform: noop,
    setTransform: noop,
    resetTransform: noop,
    clearRect: noop,
    fillRect: noop,
    strokeRect: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    bezierCurveTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    arcTo: noop,
    ellipse: noop,
    rect: noop,
    fill: noop,
    stroke: noop,
    clip: noop,
    drawImage: noop,
    putImageData: noop,
    fillText: noop,
    strokeText: noop,
    setLineDash: noop,
    getLineDash: () => [],
    measureText: (text: string) => ({ width: text.length * 10 }),
    createImageData: () => ({ data: new Uint8ClampedArray(0) }),
    getImageData: () => ({ data: new Uint8ClampedArray(0) }),
    createPattern: () => null,
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
  });
  (HTMLCanvasElement.prototype as any).getContext = function (
    contextId: string,
    _contextAttributes?: unknown,
  ) {
    if (contextId !== '2d') {
      return null;
    }
    if (!(this as any)._testMockContext2d) {
      (this as any)._testMockContext2d = createCanvasContextMock(this);
    }
    return (this as any)._testMockContext2d;
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
