/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act, waitFor } from '@testing-library/react';
import { test, expect } from 'vitest';

import { useScenes } from './useScenes';

const appState: any = {
  theme: 'light',
  viewBackgroundColor: '#ffffff',
  exportBackground: true,
  exportWithDarkMode: false,
  exportScale: 1,
  width: 100,
  height: 100,
};

test('clearScenes is a no-op when appState is not yet available', async () => {
  const { result } = renderHook(() => useScenes());
  // Do NOT call onChange — so drawing and scenes stay uninitialised.
  // clearScenes should not throw and scenes should remain empty.
  act(() => {
    result.current.clearScenes();
  });
  // Still no scenes (init hasn't completed yet either).
  expect(result.current.scenes.length).toBe(0);
});

test('clearScenes leaves exactly one empty scene', async () => {
  const { result } = renderHook(() => useScenes());
  await waitFor(() => expect(result.current.currentIndex).toBe(0));

  // Seed the first scene via Excalidraw's onChange, then add more.
  act(() => {
    result.current.onChange([] as any, appState, {} as any);
  });
  await waitFor(() => expect(result.current.scenes.length).toBe(1));

  act(() => {
    result.current.addScene();
  });
  await waitFor(() => expect(result.current.scenes.length).toBe(2));
  act(() => {
    result.current.addScene();
  });
  await waitFor(() => expect(result.current.scenes.length).toBe(3));

  act(() => {
    result.current.clearScenes();
  });

  await waitFor(() => expect(result.current.scenes.length).toBe(1));
  expect(result.current.scenes[0].drawing.elements).toEqual([]);
  expect(result.current.currentIndex).toBe(0);
});
