import { fileSave } from 'browser-fs-access';

// Exports all localStorage key/value pairs for this origin into a single JSON file.
// The file structure is a plain object mapping keys to string values.
// This keeps it generic so future keys are automatically included.
export const saveScene = async () => {
  try {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value != null) {
          data[key] = value;
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    // Extract domain from window.location.origin (e.g., "http://localhost:8000" -> "localhost-8000")
    const origin = window.location.origin
      .replace(/^https?:\/\//, '')
      .replace(/:/g, '-')
      .replace(/\//g, '-');
    await fileSave(blob, {
      fileName: `claymate-scene-${origin}.json`,
      extensions: ['.json'],
    });
  } catch (e) {
    console.error('Failed to save scene', e);
    window.alert('Failed to save scene');
  }
};
