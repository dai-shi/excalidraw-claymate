import { fileOpen } from 'browser-fs-access';
import { loadStorage } from './persistence';

export const importScenes = async () => {
  try {
    const file = await fileOpen({
      extensions: ['.json'],
      description: 'Claymate Scene JSON',
      multiple: false,
    });
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid JSON structure');
    }
    Object.entries(parsed as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      },
    );
    const scenes = await loadStorage();
    if (!scenes || scenes.length === 0) {
      window.alert('No scenes found in the imported file.');
      return;
    }
    window.location.reload();
  } catch (e) {
    console.error('Failed to import scene', e);
    window.alert('Failed to import scene');
  }
};
