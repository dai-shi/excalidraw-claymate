import { fileOpen } from 'browser-fs-access';
import { loadStorage } from './persistence';
import { loadLibraries } from './useLibrary';

// Imports a previously saved claymate-scene.json file and restores localStorage.
// After successful import the page is reloaded to let hooks pick up new storage.
export const importScene = async () => {
  try {
    const file = await fileOpen({
      extensions: ['.json'],
      description: 'Claymate Scene JSON',
      multiple: false,
    });
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid JSON structure');
    }
    // Replace only keys present in the file (avoid deleting other app/user data).
    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        // Non-string values were probably stored as objects; re-stringify.
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
    // Quick validation attempt (optional): try loading scenes.
    const scenes = await loadStorage();
    const libraries = loadLibraries();
    if (!scenes || scenes.length === 0) {
      console.warn('Imported storage did not contain scenes');
    }
    if (!libraries) {
      console.warn('Imported storage did not contain libraries');
    }
    // Reload so hooks reinitialise from new localStorage.
    window.location.reload();
  } catch (e) {
    console.error('Failed to import scene', e);
    window.alert('Failed to import scene');
  }
};
