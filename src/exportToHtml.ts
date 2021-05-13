import { fileSave } from "browser-fs-access";
import { exportToSvg } from "@excalidraw/excalidraw";

import { Scene } from "./types";

export const exportToHtml = async (scenes: Scene[]) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <style>
        svg { width: 100%; height: 100%; }
        body { margin: 0px; font-size: 24px; }
        button { background: transparent; border: none; cursor: pointer; padding: 3px; margin: 0px 10px; font-size: inherit;}
        #container { display: flex; flex-direction: column; height: 100%; }
        #navigation { display: flex; justify-content: center; align-items: center; padding: 5px; border-top: 1px solid lightgray; background: white; }        
        #rightbuttons { position: absolute; right: 10px; display: flex;  }
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
        function closeNavigation() {
          document.getElementById('navigation').style.display = 'none';
          document.getElementById('slides').style.height = "100vh";
        }
        function toggleMaximise() {
          if (document.fullscreenElement === document.body) {
            document.exitFullscreen();
          } else {
            document.body.requestFullscreen();
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
            toggleMaximise();            
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
              <button class="navbutton" type="button" onClick="moveLeft()" title="Previous slide">&#9664;</button>
              <div id="title">1 of ${scenes.length}</div>
              <button class="navbutton" type="button" onClick="moveRight()" title="Next slide">&#9654;</button>          
              <div id="rightbuttons">
                <button type="button" onClick="toggleMaximise()" title="Toggle full-screen">&#x26F6</button>
                <button type="button" onClick="closeNavigation()" title="Close this panel">&#x2716;</button>
              <div>
            </div>
        </div></body></html>`;
  await fileSave(new Blob([html], { type: "text/html" }), {
    fileName: "excalidraw-claymate.html",
  });
};
