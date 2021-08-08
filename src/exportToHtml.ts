import { fileSave } from "browser-fs-access";
import { exportToSvg } from "@excalidraw/excalidraw";
import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types";
import { animateSvg, getBeginTimeList } from "excalidraw-animate/dist/library";
import { AnimateOptions } from "./AnimateConfig";

import { Scene } from "./types";

const getNonDeletedElements = (
  elements: readonly ExcalidrawElement[]
): NonDeletedExcalidrawElement[] =>
  elements.filter(
    (element): element is NonDeletedExcalidrawElement => !element.isDeleted
  );

type Options = {
  animate?: boolean;
  animateOptions?: AnimateOptions;
};

export const exportToHtml = async (scenes: Scene[], options: Options) => {
  const animateFunctions = options.animate
    ? `
        function togglePausedAnimations() {
          const svg = document.getElementById('scene' + index);
          if (svg.animationsPaused()) {
            for (const svg of document.getElementsByTagName('svg')) {
              svg.unpauseAnimations();
            }
          } else {
            for (const svg of document.getElementsByTagName('svg')) {
              svg.pauseAnimations();
            }
          }
        }
        const beginTimeLists = [];
        let animateTimer;
        function stepForwardAnimations() {
          const svg = document.getElementById('scene' + index);
          const beginTimeList = beginTimeLists[index];
          const currentTime = svg.getCurrentTime() * 1000;
          let nextTime = beginTimeList.find((t) => t > currentTime + 50);
          console.log(currentTime, beginTimeList, nextTime);
          if (nextTime) {
            nextTime -= 1;
          } else {
            nextTime = currentTime + 500;
          }
          clearTimeout(animateTimer);
          svg.unpauseAnimations();
          animateTimer = setTimeout(() => {
            svg.pauseAnimations();
            svg.setCurrentTime(nextTime / 1000);
          }, nextTime - currentTime);
        }
        function resetAnimations() {
          const svg = document.getElementById('scene' + index);
          svg.setCurrentTime(0);
        }
`
    : `
        function togglePausedAnimations() {}
        function stepForwardAnimations() {}
        function resetAnimations() {}
`;
  let html = `<!DOCTYPE html>
    <html lang="en">
      <style>
        svg { width: 100%; height: 100%; }
        body { margin: 0px; font-size: 24px; }
        button { background: transparent; border: none; cursor: pointer; padding: 3px; margin: 0px 10px; font-size: inherit;}
        #container { display: flex; flex-direction: column; height: 100%; }
        #navigation { display: flex; justify-content: center; align-items: center; padding: 5px; border-top: 1px solid lightgray; background: white; }
        #leftbuttons { position: absolute; left: 10px; display: flex; }
        #rightbuttons { position: absolute; right: 10px; display: flex; }
        #slides { height: calc(100vh - 50px); }
      </style>
      <script>
        let index = 0;
        let totalScenes = ${scenes.length}
        function updateTitle() {
          document.getElementById('title').innerText = '' + (index + 1) + ' of ' + totalScenes;
        }
        function moveLeft() {
          if (index > 0) {
            document.getElementById('scene' + index).style.display = 'none';
            index -= 1;
            document.getElementById('scene' + index).style.display = 'block';
            updateTitle();
            document.getElementById('scene' + index).setCurrentTime(0);
          }
        }
        function moveRight() {
          if (index < totalScenes - 1) {
            document.getElementById('scene' + index).style.display = 'none';
            index += 1;
            document.getElementById('scene' + index).style.display = 'block';
            updateTitle();
            document.getElementById('scene' + index).setCurrentTime(0);
          }
        }
        function closeNavigation() {
          document.getElementById('navigation').style.display = 'none';
          document.getElementById('slides').style.height = '100vh'
        }
        function toggleMaximise() {
          if (document.fullscreenElement === document.body) {
            document.exitFullscreen();
          } else {
            document.body.requestFullscreen();
          }
        }
        ${animateFunctions}
        document.addEventListener('DOMContentLoaded', () => {
          document.getElementById('scene' + index).style.display = 'block';
          document.getElementById('scene' + index).setCurrentTime(0);
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowRight') {
            moveRight();
          }
          if (event.key === 'ArrowLeft') {
            moveLeft();
          }
          if (event.key.toLowerCase() === 'f') {
            toggleMaximise();
          }
          if (event.key.toLowerCase() === 'p') {
            togglePausedAnimations();
          }
          if (event.key.toLowerCase() === 's') {
            stepForwardAnimations();
          }
          if (event.key.toLowerCase() === 'r') {
            resetAnimations();
          }
        });
      </script>
      <body>
      <div id="container">
      <div id="slides">
  `;
  for (let index = 0; index < scenes.length; ++index) {
    const scene = scenes[index];
    const svg: SVGSVGElement = await exportToSvg(scene.drawing);
    if (options.animate) {
      animateSvg(
        svg,
        getNonDeletedElements(scene.drawing.elements),
        options.animateOptions
      );
    }
    svg.id = `scene${index}`;
    svg.style.display = "none";
    html += svg.outerHTML;
    if (options.animate) {
      const beginTimeList = getBeginTimeList(svg);
      beginTimeList.sort((a, b) => a - b);
      html += `
        <script>
          beginTimeLists.push(${JSON.stringify(beginTimeList)});
        </script>
      `;
    }
  }
  const animateButtons = options.animate
    ? `
    <div id="leftbuttons">
     <button type="button" onclick="togglePausedAnimations()" title="Play or pause animations">P</button>
     <button type="button" onclick="stepForwardAnimations()" title="Step forward animations">S</button>
     <button type="button" onclick="resetAnimations()" title="Reset animations">R</button>
    </div>
`
    : "";
  html += `
    </div>
    <div id="navigation">
      ${animateButtons}
      <button class="navbutton" type="button" onclick="moveLeft()" title="Previous slide">&#9664;</button>
      <div id="title">1 of ${scenes.length}</div>
      <button class="navbutton" type="button" onclick="moveRight()" title="Next slide">&#9654;</button>
      <div id="rightbuttons">
        <button type="button" onclick="toggleMaximise()" title="Toggle full-screen">&#x26F6;</button>
        <button type="button" onclick="closeNavigation()" title="Close this panel">&#x2716;</button>
      </div>
    </div>
  </div></body></html>
`;
  await fileSave(new Blob([html], { type: "text/html" }), {
    fileName: "excalidraw-claymate.html",
  });
};

export const previewHtml = async (
  scene: Scene,
  options: Options,
  divId?: string
) => {
  const svg: SVGSVGElement = await exportToSvg(scene.drawing);
  if (options.animate) {
    animateSvg(
      svg,
      getNonDeletedElements(scene.drawing.elements),
      options.animateOptions
    );
  }
  const html = svg.outerHTML;
  if (divId) {
    const ele = document.getElementById(divId);
    if (ele) {
      ele.innerHTML = html;
    }
  } else {
    const win = window.open("", "_blank");
    if (win) {
      win.document.body.innerHTML = html;
    }
  }
};
