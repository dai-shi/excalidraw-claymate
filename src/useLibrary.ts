import { LibraryItems } from '@excalidraw/excalidraw/types/types';
import { useCallback, useMemo, useRef } from 'react';

const LIBRARY_STORAGE_KEY = 'claymate-libraries';

export const loadLibraries = (): LibraryItems | undefined => {
  try {
    const storage = localStorage.getItem(LIBRARY_STORAGE_KEY);
    const items = storage ? JSON.parse(storage) : undefined;
    if (items) {
      return items as LibraryItems;
    }
  } catch (e) {
    console.error('Unable to load libraries', e);
  }
  return undefined;
};

export const saveLibraries = (items: LibraryItems) => {
  const result = JSON.stringify(items);
  localStorage.setItem(LIBRARY_STORAGE_KEY, result);
};

export const useLibrary = () => {
  const initialLibraryItems = useMemo(() => loadLibraries(), []);
  const libraryRef = useRef<LibraryItems | undefined>(initialLibraryItems);
  const onLibraryChange = useCallback((items: LibraryItems) => {
    saveLibraries(items);
    libraryRef.current = items;
  }, []);

  return { onLibraryChange, libraryItems: libraryRef.current };
};
