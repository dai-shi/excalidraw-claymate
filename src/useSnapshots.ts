import { useCallback, useState } from "react";

const resourceCache = new Map<string, string>();

const embedUrlResources = async (text: string) => {
  const urls = text.match(/url\(".*?"\);/g) || [];
  const resources = await Promise.all(
    urls.map(
      (url) =>
        new Promise<string>((resolve, reject) => {
          url = url.slice(5, -3);
          if (resourceCache.has(url)) {
            resolve(resourceCache.get(url));
            return;
          }
          fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const resource = `url(${reader.result});`;
                resourceCache.set(url, resource);
                resolve(resource);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
            .catch(reject);
        })
    )
  );
  return text.replace(/url\(".*?"\);/g, () => resources.shift() as string);
};

let count = 0;

export const useSnapshots = () => {
  const [snapshots, setSnapshots] = useState<
    {
      id: string;
      image: HTMLImageElement;
    }[]
  >([]);

  const addSnapshot = useCallback(async (svgHtml?: string) => {
    if (!svgHtml) return;
    const html = await embedUrlResources(svgHtml);
    const image = new Image();
    image.src = "data:image/svg+xml;base64," + btoa(html);
    image.onload = () => {
      setSnapshots((prev) => [...prev, { image, id: String(++count) }]);
    };
  }, []);

  return {
    snapshots,
    addSnapshot,
  };
};
