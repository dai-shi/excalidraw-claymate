import { fileSave } from "browser-fs-access";
// @ts-ignore
import { exportToSvg } from "@excalidraw/utils";

import { Scene } from "./types";

export const exportToHtml = async (scenes: Scene[]) => {
  let html = `
    <html>
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
