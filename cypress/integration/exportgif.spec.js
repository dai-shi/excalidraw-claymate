
/// <reference types="cypress" />

const initialData = {
  "elements":
    [{
      "type": "rectangle",
      "version": 141,
      "versionNonce": 361174001,
      "isDeleted": false,
      "id": "oDVXy8D6rom3H1-LLH2-f",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "x": 100.50390625,
      "y": 93.67578125,
      "strokeColor": "#000000",
      "backgroundColor": "transparent",
      "width": 186.47265625,
      "height": 141.9765625,
      "seed": 1968410350,
      "groupIds": []
    },
    {
      "id": "-xMIs_0jIFqvpx-R9UnaG",
      "type": "ellipse",
      "x": 300.5703125,
      "y": 190.69140625,
      "width": 198.21875,
      "height": 129.51171875,
      "angle": 0,
      "strokeColor": "#000000",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "seed": 957947807,
      "version": 47,
      "versionNonce": 1128618623,
      "isDeleted": false
    }]
  , "appState": { "appearance": "light", "collaborators": {}, "currentChartType": "bar", "currentItemBackgroundColor": "transparent", "currentItemEndArrowhead": "arrow", "currentItemFillStyle": "hachure", "currentItemFontFamily": 1, "currentItemFontSize": 20, "currentItemLinearStrokeSharpness": "round", "currentItemOpacity": 100, "currentItemRoughness": 1, "currentItemStartArrowhead": null, "currentItemStrokeColor": "#000000", "currentItemStrokeSharpness": "sharp", "currentItemStrokeStyle": "solid", "currentItemStrokeWidth": 1, "currentItemTextAlign": "left", "cursorButton": "up", "draggingElement": null, "editingElement": null, "editingGroupId": null, "editingLinearElement": null, "elementLocked": false, "elementType": "selection", "errorMessage": null, "exportBackground": true, "exportEmbedScene": false, "exportWithDarkMode": false, "fileHandle": null, "gridSize": null, "height": 660, "isBindingEnabled": true, "isLibraryOpen": false, "isLoading": false, "isResizing": false, "isRotating": false, "lastPointerDownWith": "mouse", "multiElement": null, "name": "Untitled-2021-04-18-1754", "openMenu": null, "pasteDialog": { "shown": false, "data": null }, "previousSelectedElementIds": {}, "resizingElement": null, "scrolledOutside": false, "scrollX": 0, "scrollY": 0, "selectedElementIds": {}, "selectedGroupIds": {}, "selectionElement": null, "shouldAddWatermark": false, "shouldCacheIgnoreZoom": false, "showHelpDialog": false, "showStats": false, "startBoundElement": null, "suggestedBindings": [], "toastMessage": null, "viewBackgroundColor": "#ffffff", "width": 1000, "zenModeEnabled": false, "zoom": { "value": 1, "translation": { "x": 0, "y": 0 } }, "viewModeEnabled": false, "offsetLeft": 0, "offsetTop": 0 }
}


const MockFileSavePicker = { createWritable: () => ({ write: () => undefined, close: () => undefined }) };

context('GIF', () => {
  beforeEach(() => {
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