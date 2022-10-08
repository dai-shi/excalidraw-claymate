
/// <reference types="cypress" />

import { createDrawing } from "../../src/__testHelpers/creationForTests"


const MockFileSavePicker = { createWritable: () => ({ write: () => undefined, close: () => undefined }) };

context('GIF', () => {
  beforeEach(() => {
    const initialData = createDrawing("Test", "Primary")
    window.localStorage.setItem('excalidraw-elements', JSON.stringify(initialData));
    cy.visit('/', {
      onBeforeLoad: (win) => {
        if (win.showSaveFilePicker !== undefined) {
          cy.stub(win, "showSaveFilePicker").callsFake(() => MockFileSavePicker)
        }
      }
    });
  });

  it('Export GIF', () => {
    cy.contains("Add scene").click()
    // Fails on a window development system unless gif.worker.js    
    // is manually copied from node_modules/gif.js/dist to public
    cy.contains("Export GIF").click()
  })
})