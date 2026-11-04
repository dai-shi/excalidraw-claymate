import { test, expect } from '@playwright/test';

const NUMBER_OF_SCENES = 3;

test.describe('Scene Deletion', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Add scene')).toBeVisible();

    // Page starts with 1 initial scene; add more to reach NUMBER_OF_SCENES
    for (let i = 1; i < NUMBER_OF_SCENES; i++) {
      await page.locator('text=Add scene').click();
      await expect(page.locator('.Claymate-scene')).toHaveCount(i + 1);
    }
  });

  test('Shows Initial Scenes', async ({ page }) => {
    await expect(page.locator('.Claymate-scene')).toHaveCount(NUMBER_OF_SCENES);
    await expect(page.locator('text=Add scene')).toBeVisible();
  });

  test('Delete selected scene via Clear selected', async ({ page }) => {
    await page
      .locator('.Claymate-scene')
      .first()
      .locator('.Claymate-select')
      .click();

    await page.locator('button', { hasText: /Clear selected/ }).click();

    await page
      .locator('[role="dialog"]')
      .locator('button', { hasText: 'Clear' })
      .click();

    await expect(page.locator('.Claymate-scene')).toHaveCount(
      NUMBER_OF_SCENES - 1,
    );
  });

  test('Clear all scenes', async ({ page }) => {
    await page.locator('button', { hasText: 'Clear all' }).click();

    await page
      .locator('[role="dialog"]')
      .locator('button', { hasText: 'Clear' })
      .click();

    await expect(page.locator('.Claymate-scene')).toHaveCount(1);
  });
});
