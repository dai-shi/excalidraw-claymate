/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';

import Claymate from './Claymate';
import type { Scene } from './types';

const makeScene = (id: string, elements: any[] = []): Scene => ({
  id,
  width: 100,
  height: 100,
  imageData: {} as ImageData,
  drawing: {
    elements,
    appState: { theme: 'light' } as any,
    files: null,
  },
});

const renderClaymate = (override: Record<string, unknown> = {}) => {
  const props = {
    scenes: [makeScene('a'), makeScene('b'), makeScene('c')],
    currentIndex: 0 as number | undefined,
    updateScenes: vi.fn(),
    moveToScene: vi.fn(),
    addScene: vi.fn(),
    clearScenes: vi.fn(),
    ...override,
  };
  const utils = render(<Claymate {...(props as any)} />);
  return { props, ...utils };
};

let excalidrawHost: HTMLElement;

beforeEach(() => {
  excalidrawHost = document.createElement('div');
  excalidrawHost.className = 'excalidraw';
  excalidrawHost.innerHTML = '<input class="excalidraw-input" />';
  document.body.appendChild(excalidrawHost);
});

afterEach(() => {
  excalidrawHost.remove();
});

const selectScene = (
  utils: ReturnType<typeof renderClaymate>,
  index: number,
) => {
  const checkboxes = utils.getAllByLabelText('Select scene');
  fireEvent.click(checkboxes[index]);
};

test('clicking a scene checkbox does not navigate to that scene', () => {
  const utils = renderClaymate();
  selectScene(utils, 1);
  expect(utils.props.moveToScene).not.toHaveBeenCalled();
});

test('Delete opens confirmation dialog and removes selected scenes on confirm', () => {
  const utils = renderClaymate();
  selectScene(utils, 1);

  fireEvent.keyDown(document.body, { key: 'Delete' });

  expect(utils.props.updateScenes).not.toHaveBeenCalled();
  fireEvent.click(utils.getByText('Clear'));

  expect(utils.props.updateScenes).toHaveBeenCalledTimes(1);
  expect(utils.props.clearScenes).not.toHaveBeenCalled();
  const updater = (utils.props.updateScenes as any).mock.calls[0][0];
  const result = updater(utils.props.scenes).map((s: Scene) => s.id);
  expect(result).toEqual(['a', 'c']);
});

test('Backspace opens confirmation dialog and removes selected scenes on confirm', () => {
  const utils = renderClaymate();
  selectScene(utils, 0);
  selectScene(utils, 2);

  fireEvent.keyDown(document.body, { key: 'Backspace' });

  expect(utils.props.updateScenes).not.toHaveBeenCalled();
  fireEvent.click(utils.getByText('Clear'));

  expect(utils.props.updateScenes).toHaveBeenCalledTimes(1);
  const updater = (utils.props.updateScenes as any).mock.calls[0][0];
  const result = updater(utils.props.scenes).map((s: Scene) => s.id);
  expect(result).toEqual(['b']);
});

test('selecting all scenes and pressing Delete shows confirmation before clearing', () => {
  const utils = renderClaymate();
  selectScene(utils, 0);
  selectScene(utils, 1);
  selectScene(utils, 2);

  fireEvent.keyDown(document.body, { key: 'Delete' });

  expect(utils.props.clearScenes).not.toHaveBeenCalled();
  fireEvent.click(utils.getByText('Clear'));

  expect(utils.props.clearScenes).toHaveBeenCalledTimes(1);
  expect(utils.props.updateScenes).not.toHaveBeenCalled();
});

test('Delete does nothing when no scene is selected', () => {
  const utils = renderClaymate();

  fireEvent.keyDown(document.body, { key: 'Delete' });

  expect(utils.props.updateScenes).not.toHaveBeenCalled();
  expect(utils.props.clearScenes).not.toHaveBeenCalled();
});

test('Delete is ignored when focus is inside the Excalidraw canvas', () => {
  const utils = renderClaymate();
  selectScene(utils, 1);

  const target = excalidrawHost.querySelector('input')!;
  fireEvent.keyDown(target, { key: 'Delete' });

  expect(utils.props.updateScenes).not.toHaveBeenCalled();
  expect(utils.props.clearScenes).not.toHaveBeenCalled();
});

test('Delete is ignored when focus is in an input field', () => {
  const utils = renderClaymate();
  selectScene(utils, 1);

  const input = document.createElement('input');
  document.body.appendChild(input);
  fireEvent.keyDown(input, { key: 'Delete' });
  input.remove();

  expect(utils.props.updateScenes).not.toHaveBeenCalled();
  expect(utils.props.clearScenes).not.toHaveBeenCalled();
});

test('Clear all button opens a confirmation dialog and clears on confirm', () => {
  const utils = renderClaymate();

  fireEvent.click(utils.getByText('Clear all'));

  // Confirm button in the dialog
  fireEvent.click(utils.getByText('Clear'));

  expect(utils.props.clearScenes).toHaveBeenCalledTimes(1);
});

test('Clear all is disabled when there is a single empty scene', () => {
  const utils = renderClaymate({
    scenes: [makeScene('only')],
    currentIndex: 0,
  });
  expect(utils.getByText('Clear all')).toBeDisabled();
});

test('Clear all is enabled when the only scene has content', () => {
  const utils = renderClaymate({
    scenes: [makeScene('only', [{ id: 'el1' }])],
    currentIndex: 0,
  });
  expect(utils.getByText('Clear all')).toBeEnabled();
});

test('Delete with currentIndex undefined removes selected scenes without crash', () => {
  const utils = renderClaymate({ currentIndex: undefined });
  selectScene(utils, 1);

  fireEvent.keyDown(document.body, { key: 'Delete' });
  fireEvent.click(utils.getByText('Clear'));

  expect(utils.props.updateScenes).toHaveBeenCalledTimes(1);
  const updater = (utils.props.updateScenes as any).mock.calls[0][0];
  const result = updater(utils.props.scenes).map((s: Scene) => s.id);
  expect(result).toEqual(['a', 'c']);
  // newCurrent arg should be undefined — no crash
  const newCurrent = (utils.props.updateScenes as any).mock.calls[0][1];
  expect(newCurrent).toBeUndefined();
});

test('Delete is ignored when focus is in a select element', () => {
  const utils = renderClaymate();
  selectScene(utils, 1);

  const select = document.createElement('select');
  document.body.appendChild(select);
  fireEvent.keyDown(select, { key: 'Delete' });
  select.remove();

  expect(utils.props.updateScenes).not.toHaveBeenCalled();
  expect(utils.props.clearScenes).not.toHaveBeenCalled();
});
