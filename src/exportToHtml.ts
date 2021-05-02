import { fileSave } from "browser-fs-access";
import { exportToSvg } from "@excalidraw/excalidraw";

import { Scene } from "./types";

export const exportToHtml = async (scenes: Scene[]) => {
  let html = `
    <html>
      <style>
        svg { width: 100%; height: 100%; }
      </style>
      <script>
        let index = 0;
        document.addEventListener('DOMContentLoaded', () => {
          document.getElementById('scene' + index).style.display = 'block';
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowRight' && index < ${scenes.length - 1}) {
            document.getElementById('scene' + index).style.display = 'none';
            index += 1;
            document.getElementById('scene' + index).style.display = 'block';
          }
          if (event.key === 'ArrowLeft' && index > 0) {
            document.getElementById('scene' + index).style.display = 'none';
            index -= 1;
            document.getElementById('scene' + index).style.display = 'block';
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
  `;
  scenes.forEach((scene, index) => {
    const svg: SVGSVGElement = exportToSvg(scene.drawing);
    svg.id = `scene${index}`;
    svg.style.display = "none";
    html += svg.outerHTML;
  });
  html += "</body></html>";
  await fileSave(new Blob([html], { type: "text/html" }), {
    fileName: "excalidraw-claymate.html",
  });
};
