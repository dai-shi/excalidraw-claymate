import { fileSave } from 'browser-fs-access';
import { exportToSvg } from '@excalidraw/excalidraw';

import { Scene } from './types';

const DARK_FILTER = 'invert(93%) hue-rotate(180deg)';

const recordingFunction = `
  function startRecording() {
    import('https://unpkg.com/browser-fs-access').then(({ fileSave }) => {
      navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
      }).then(function(stream) {
        navigator.mediaDevices.getUserMedia({
          audio: true,
        }).catch(() => null).then(function(audioStream) {
          if (audioStream) {
            const audioTrack = audioStream.getAudioTracks()[0];
            stream.getVideoTracks()[0].onended = () => {
              audioTrack.stop();
            };
            stream.addTrack(audioTrack);
          }
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            const blob = new Blob([e.data], { type: "video/webm" });
            const opts = { fileName: "video.webm", extensions: [".webm"] };
            fileSave(blob, opts).catch(() => {
              document.getElementById('startrecordingbutton').onclick = () => {
                fileSave(blob, opts);
              };
              window.alert('Click the recording button again to save file');
            });
          };
          recorder.start();
        });
      });
    });
  }
`;

type Options = {
  darkMode: boolean;
};

export const exportToHtml = async (scenes: Scene[], options: Options) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <style>
        svg { width: 100%; height: 100%; }
        body { margin: 0px; font-size: 24px; ${
          options.darkMode ? `filter: ${DARK_FILTER}; ` : ''
        }}
        button { background: transparent; border: none; cursor: pointer; padding: 3px; margin: 0px 10px; font-size: inherit;}
        #container { display: flex; flex-direction: column; height: 100%; background: white; }
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
        ${recordingFunction}
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
    const svg: SVGSVGElement = await exportToSvg({
      ...scene.drawing,
      appState: {
        ...scene.drawing.appState,
        exportWithDarkMode: false,
      },
    });
    svg.id = `scene${index}`;
    svg.style.display = 'none';
    html += svg.outerHTML;
  }
  html += `
    </div>
    <div id="navigation">
      <button class="navbutton" type="button" onclick="moveLeft()" title="Previous slide">&#9664;</button>
      <div id="title">1 of ${scenes.length}</div>
      <button class="navbutton" type="button" onclick="moveRight()" title="Next slide">&#9654;</button>
      <div id="rightbuttons">
        <button type="button" onclick="startRecording()" title="Start recording" id="startrecordingbutton">&#x1F3A5;</button>
        <button type="button" onclick="toggleMaximise()" title="Toggle full-screen">&#x26F6;</button>
        <button type="button" onclick="closeNavigation()" title="Close this panel">&#x2716;</button>
      </div>
    </div>
  </div></body></html>
`;
  await fileSave(new Blob([html], { type: 'text/html' }), {
    fileName: 'excalidraw-claymate.html',
  });
};

export const previewHtml = async (scene: Scene, divId?: string) => {
  const svg: SVGSVGElement = await exportToSvg(scene.drawing);
  const html = svg.outerHTML;
  if (divId) {
    const ele = document.getElementById(divId);
    if (ele) {
      ele.innerHTML = html;
    }
  } else {
    const win = window.open('', '_blank');
    if (win) {
      win.document.body.innerHTML = html;
    }
  }
};
