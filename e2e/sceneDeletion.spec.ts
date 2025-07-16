import { test, expect } from '@playwright/test';
import { createDrawings } from '../src/__testHelpers/creationForTests';

const SCENE_STORAGE_KEY = "claymate-scenes";

const NUMBER_OF_SCENES = 5;

const getSceneId = (drawing) => {
  return drawing.elements[0].id;
};

const DeleteButtonText = "\u2716";
const SelectedSceneBorder = "1px dotted rgb(128, 128, 128)";

test.describe('Scene Deletion', () => {
  let scenes = [];
  
  test.beforeEach(async ({ page }) => {
    scenes = createDrawings(NUMBER_OF_SCENES);
    
    await page.goto('/', {
      waitUntil: 'domcontentloaded'
    });
    
    // Set localStorage data
    await page.evaluate(({ key, data }) => {
      window.localStorage.setItem(key, JSON.stringify(data));
    }, { key: SCENE_STORAGE_KEY, data: scenes });
    
    // Reload to apply localStorage data
    await page.reload();
  });

  test('Shows Initial Scenes', async ({ page }) => {
    await expect(page.locator('text=Add scene')).toBeVisible();
  });

  test('Delete First', async ({ page }) => {
    const firstSceneId = getSceneId(scenes[0]);
    await page.locator(`[data-testid="${firstSceneId}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${firstSceneId}"]`)).toBeHidden();
    
    const newCurrentSceneId = getSceneId(scenes[1]);
    await expect(page.locator(`[data-testid="${newCurrentSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });

  test('Delete Last', async ({ page }) => {
    const currentSceneId = getSceneId(scenes[0]);
    const sceneIdToDelete = getSceneId(scenes[scenes.length - 1]);
    
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
    await expect(page.locator(`[data-testid="${currentSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });

  test('Delete 2nd to Last', async ({ page }) => {
    const sceneIdToDelete = getSceneId(scenes[scenes.length - 2]);
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
  });

  test('Make last current and then delete it', async ({ page }) => {
    const sceneIdToDelete = getSceneId(scenes[scenes.length - 1]);
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).click();
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
    
    const newCurrentSceneId = getSceneId(scenes[scenes.length - 2]);
    await expect(page.locator(`[data-testid="${newCurrentSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });

  test('Make last current and then delete first', async ({ page }) => {
    const currentSceneId = getSceneId(scenes[scenes.length - 1]);
    await page.locator(`[data-testid="${currentSceneId}"]`).click();
    
    const sceneIdToDelete = getSceneId(scenes[0]);
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
    await expect(page.locator(`[data-testid="${currentSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });

  test('Make 2nd to last current and then delete first', async ({ page }) => {
    const currentSceneId = getSceneId(scenes[scenes.length - 2]);
    await page.locator(`[data-testid="${currentSceneId}"]`).click();
    
    const sceneIdToDelete = getSceneId(scenes[0]);
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
    await expect(page.locator(`[data-testid="${currentSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });

  test('Make 2nd to last current and then delete second', async ({ page }) => {
    const currentSceneId = getSceneId(scenes[scenes.length - 2]);
    await page.locator(`[data-testid="${currentSceneId}"]`).click();
    
    const sceneIdToDelete = getSceneId(scenes[1]);
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
    await expect(page.locator(`[data-testid="${currentSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });

  test('Make 2nd current and then delete second', async ({ page }) => {
    const currentSceneId = getSceneId(scenes[1]);
    const nextSceneId = getSceneId(scenes[2]);
    await page.locator(`[data-testid="${currentSceneId}"]`).click();
    
    const sceneIdToDelete = getSceneId(scenes[1]);
    await page.locator(`[data-testid="${sceneIdToDelete}"]`).locator(`text=${DeleteButtonText}`).click();
    await expect(page.locator(`[data-testid="${sceneIdToDelete}"]`)).toBeHidden();
    
    await expect(page.locator('.Claymate-scenes').first().locator(`[data-testid="${nextSceneId}"]`)).toHaveCSS('border', SelectedSceneBorder);
  });
});