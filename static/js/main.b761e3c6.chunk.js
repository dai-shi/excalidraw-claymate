(this["webpackJsonpexcalidraw-claymate"]=this["webpackJsonpexcalidraw-claymate"]||[]).push([[0],{16:function(e,t,n){e.exports=n(47)},21:function(e,t,n){},45:function(e,t,n){},46:function(e,t,n){},47:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(8),c=n.n(r),o=(n(21),n(4)),u=n(11),l=n.n(u),s=(n(43),n(44),n(45),n(5)),d=n(1),h=n.n(d),m=n(2),f=n(15),w=n(14),v=n(12),b=n.n(v),g=n(13),p=(n(46),function(e){var t=e.snapshot,n=Object(a.useRef)(null);return Object(a.useEffect)((function(){if(n.current){var e=n.current.getContext("2d");e&&e.putImageData(t.imageData,0,0)}}),[t]),i.a.createElement("canvas",{ref:n,width:t.width,height:t.height})}),E=function(e){var t=e.elements,n=Object(a.useState)([]),r=Object(o.a)(n,2),c=r[0],u=r[1];return i.a.createElement("div",{className:"Claymate"},i.a.createElement("div",{className:"Claymate-buttons"},i.a.createElement("button",{type:"button",onClick:function(){var e=function(e,t){var n=Object(g.exportToCanvas)({elements:e}),a=t?t.width:n.width,i=t?t.height:n.height,r=n.getContext("2d");return{id:Object(f.a)(),width:a,height:i,imageData:r.getImageData(0,0,a,i)}}(t,c[0]&&{width:c[0].width,height:c[0].height});u((function(t){return[].concat(Object(s.a)(t),[e])}))}},"Add snapshot"),i.a.createElement("button",{type:"button",onClick:function(){var e=new b.a;c.forEach((function(t){e.addFrame(t.imageData)})),e.on("finished",function(){var e=Object(m.a)(h.a.mark((function e(t){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(w.a)(t,{fileName:"excalidraw-claymate.gif"});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),e.render()},disabled:0===c.length},"Export GIF")),i.a.createElement("div",{className:"Claymate-snapshots"},c.map((function(e,t){return i.a.createElement("div",{key:e.id,className:"Claymate-snapshot"},i.a.createElement(p,{snapshot:e}),i.a.createElement("button",{type:"button",className:"Claymate-delete","aria-label":"Delete",onClick:function(){return t=e.id,void u((function(e){return e.filter((function(e){return e.id!==t}))}));var t}},"\u2716"),i.a.createElement("button",{type:"button",className:"Claymate-left","aria-label":"Move Left",disabled:0===t,onClick:function(){return t=e.id,void u((function(e){var n=e.findIndex((function(e){return e.id===t})),a=Object(s.a)(e);return a[n-1]=e[n],a[n]=e[n-1],a}));var t}},"\u2b05"),i.a.createElement("button",{type:"button",className:"Claymate-right","aria-label":"Move Right",disabled:t===c.length-1,onClick:function(){return t=e.id,void u((function(e){var n=e.findIndex((function(e){return e.id===t})),a=Object(s.a)(e);return a[n+1]=e[n],a[n]=e[n+1],a}));var t}},"\u27a1"))}))))},y=function(){var e=Object(a.useState)([]),t=Object(o.a)(e,2),n=t[0],r=t[1],c=Object(a.useState)({width:window.innerWidth,height:window.innerHeight}),u=Object(o.a)(c,2),s=u[0],d=u[1];Object(a.useEffect)((function(){var e=function(){d({width:window.innerWidth,height:window.innerHeight})};return window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[]);var h=s.width,m=s.height;return i.a.createElement("div",{className:"ClaymateApp"},i.a.createElement(l.a,{width:h,height:m,onChange:r}),i.a.createElement(E,{elements:n}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[16,1,2]]]);
//# sourceMappingURL=main.b761e3c6.chunk.js.map