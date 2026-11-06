import { test, expect } from '@playwright/test';

const FIXTURE_PATH = new URL('./fixtures/claymate-scene.json', import.meta.url)
  .pathname;
const FIXTURE_SCENE_COUNT = 2;

test.describe('Save and Import Scenes', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Force browser-fs-access to use legacy <input>/<a> APIs.
    // Chromium supports File System Access API, which Playwright cannot intercept.
    await page.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      delete w.showSaveFilePicker;
      delete w.showOpenFilePicker;
    });
  });

  test('Save scenes exports a JSON file', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Add scene')).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button', { hasText: 'Save scene' }).click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^claymate-scene-.+\.json$/);
  });

  test('Import scenes restores scenes from JSON fixture', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Add scene')).toBeVisible();

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('button', { hasText: 'Import scene' }).click(),
    ]);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      fileChooser.setFiles(FIXTURE_PATH),
    ]);

    await expect(page.locator('.Claymate-scene')).toHaveCount(
      FIXTURE_SCENE_COUNT,
    );
  });
});
