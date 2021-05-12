import { fileSave } from "browser-fs-access";
import { exportToSvg } from "@excalidraw/excalidraw";

import { Scene } from "./types";

export const exportToHtml = async (scenes: Scene[]) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <style>
        svg { width: 100%; height: 100%; }
        body { margin: 0px; font-size: 24px; }
        #container { display: flex; flex-direction: column; height: 100%; }
        #navigation { display: flex; justify-content: center; align-items: center; padding: 5px;}
        .navbutton { padding: 3px; margin: 0px 10px; font-size: inherit; }
        #slides { height: calc(100vh - 50px); }                
      </style>
      <script>
        let index = 0;
        let totalScenes = ${scenes.length}
        function updateTitle() {
          document.getElementById('title').innerText = index+1 + " of " + totalScenes;
        }
        function moveLeft() {
          if (index > 0) {
            document.getElementById('scene' + index).style.display = 'none';
            index -= 1;
            document.getElementById('scene' + index).style.display = 'block';
            updateTitle();
          }
        }
        function moveRight() {
          if (index < totalScenes - 1) {
            document.getElementById('scene' + index).style.display = 'none';
            index += 1;
            document.getElementById('scene' + index).style.display = 'block';
            updateTitle();
          }
        }
        document.addEventListener('DOMContentLoaded', () => {
          document.getElementById('scene' + index).style.display = 'block';
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowRight') {
            moveRight();
          }
          if (event.key === 'ArrowLeft') {
            moveLeft();
          }
          if (event.key.toLowerCase() === "f") {
            if (document.fullscreenElement === document.body) {
              document.exitFullscreen();
            } else {
              document.body.requestFullscreen();
            }
          }
        });
      </script>
      <body>
      <div id="container">
      <div id="slides">
  `;
  scenes.forEach((scene, index) => {
    const svg: SVGSVGElement = exportToSvg(scene.drawing);
    svg.id = `scene${index}`;
    svg.style.display = "none";
    html += svg.outerHTML;
  });
  html += `</div>
            <div id="navigation">
              <button class="navbutton" type="button" onClick="moveLeft()">&#9664;</button>
              <div id="title">1 of ${scenes.length}</div>
              <button class="navbutton" type="button" onClick="moveRight()">&#9654;</button>          
            </div>
        </div></body></html>`;
  await fileSave(new Blob([html], { type: "text/html" }), {
    fileName: "excalidraw-claymate.html",
  });
};
