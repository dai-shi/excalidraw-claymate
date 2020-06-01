import { useEffect, useCallback } from "react";

const getMousePosition = (
  svg: SVGSVGElement,
  event: MouseEvent
): [number, number] => {
  const CTM = svg.getScreenCTM();
  if (!CTM) {
    console.warn("failed to get screen CTM");
    return [event.clientX, event.clientY];
  }
  return [(event.clientX - CTM.e) / CTM.a, (event.clientY - CTM.f) / CTM.d];
};

const makeDraggable = (svg: SVGSVGElement) => {
  const draggableElements: SVGElement[] = [];
  let draggingElementIndex = -1;
  let offsetX = 0;
  let offsetY = 0;
  svg.childNodes.forEach((ele) => {
    if (ele instanceof SVGElement && ele.nodeType === Node.ELEMENT_NODE) {
      const transform = ele.getAttribute("transform");
      if (!transform) return;
      const match = /translate\(([0-9.]+) ([0-9.]+)\)/.exec(transform);
      if (!match) return;
      draggableElements.unshift(ele);
    }
  });
  svg.addEventListener("mousedown", (event) => {
    const index = draggableElements.findIndex((ele) => {
      const [clientRect] = ele.getClientRects();
      return (
        clientRect.x <= event.clientX &&
        event.clientX <= clientRect.x + clientRect.width &&
        clientRect.y <= event.clientY &&
        event.clientY <= clientRect.y + clientRect.height
      );
    });
    if (index === -1) return;
    const ele = draggableElements[index];
    const position = getMousePosition(svg, event);
    const transform = ele.getAttribute("transform");
    if (!transform) return;
    const match = /translate\(([0-9.]+) ([0-9.]+)\)/.exec(transform);
    if (!match) return;
    offsetX = position[0] - Number(match[1]);
    offsetY = position[1] - Number(match[2]);
    draggingElementIndex = index;
  });
  svg.addEventListener("mousemove", (event) => {
    if (draggingElementIndex === -1) return;
    const position = getMousePosition(svg, event);
    const x = position[0] - offsetX;
    const y = position[1] - offsetY;
    const ele = draggableElements[draggingElementIndex];
    const transform = ele.getAttribute("transform");
    if (!transform) return;
    ele.setAttribute(
      "transform",
      transform.replace(/translate\(.*?\)/, `translate(${x} ${y})`)
    );
  });
  svg.addEventListener("mouseup", (_event) => {
    draggingElementIndex = -1;
  });
  svg.addEventListener("mouseleave", (_event) => {
    draggingElementIndex = -1;
  });
};

export const useDraggableSvg = (
  svg: SVGSVGElement | undefined,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    if (containerRef.current && svg) {
      makeDraggable(svg);
      containerRef.current.appendChild(svg);
    }
  }, [containerRef, svg]);
  const getSvgHtml = useCallback(() => containerRef.current?.innerHTML, [
    containerRef,
  ]);
  return { getSvgHtml };
};
