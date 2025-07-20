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
} catch {}
const element = document.createElement('div');
element.id = 'root';
document.body.appendChild(element);

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
