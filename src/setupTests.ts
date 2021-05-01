// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "jest-canvas-mock";
import crypto from "crypto";
window.crypto = {
  getRandomValues: function (buffer: T) {
    return crypto.randomFillSync(buffer);
  },
};
const element = document.createElement("div");
element.id = "root";
document.body.appendChild(element);
