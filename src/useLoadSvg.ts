import { useEffect, useState } from "react";

import { importFromBackend } from "./excalidraw/src/data/index";
import { exportToSvg } from "./excalidraw/src/scene/export";
import { getNonDeletedElements } from "./excalidraw/src/element";

export const useLoadSvg = () => {
  const [loading, setLoading] = useState(true);
  const [loadedSvg, setLoadedSvg] = useState<SVGSVGElement>();

  useEffect(() => {
    (async () => {
      const hash = window.location.hash.slice(1);
      const searchParams = new URLSearchParams(hash);
      const match = /([0-9]+),?([a-zA-Z0-9_-]*)/.exec(
        searchParams.get("json") || ""
      );
      if (!match) {
        console.log("no json found");
        setLoading(false);
        return;
      }
      const [, id, key] = match;
      const { elements } = await importFromBackend(id, key);
      const svg = exportToSvg(getNonDeletedElements(elements), {
        exportBackground: true,
        exportPadding: 30,
        viewBackgroundColor: "white",
        shouldAddWatermark: false,
      });
      setLoadedSvg(svg);
      console.log(svg);
      setLoading(false);
    })();
  }, []);

  return { svg: loadedSvg, loading };
};
