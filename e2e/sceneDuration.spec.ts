import { test, expect } from '@playwright/test';

test.describe('Scene Duration', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Add scene')).toBeVisible();
  });

  test('Duration input shows default value of 500', async ({ page }) => {
    const input = page.locator('.Claymate-duration-input').first();
    await expect(input).toHaveValue('500');
  });

  test('Changing duration updates the value', async ({ page }) => {
    const input = page.locator('.Claymate-duration-input').first();
    await input.click({ clickCount: 3 });
    await input.fill('1000');
    await input.blur();
    await expect(input).toHaveValue('1000');
  });

  test('Reset button resets a single scene to default', async ({ page }) => {
    const firstScene = page.locator('.Claymate-scene').first();
    const input = firstScene.locator('.Claymate-duration-input');

    await input.click({ clickCount: 3 });
    await input.fill('1000');
    await input.blur();
    await expect(input).toHaveValue('1000');

    await firstScene.locator('.Claymate-duration-reset').click();
    await expect(input).toHaveValue('500');
  });

  test('Reset all durations resets all scenes to default', async ({ page }) => {
    await page.locator('text=Add scene').click();
    await expect(page.locator('.Claymate-scene')).toHaveCount(2);

    const inputs = page.locator('.Claymate-duration-input');

    await inputs.first().click({ clickCount: 3 });
    await inputs.first().fill('1000');
    await inputs.first().blur();

    await inputs.nth(1).click({ clickCount: 3 });
    await inputs.nth(1).fill('2000');
    await inputs.nth(1).blur();

    await page.locator('button', { hasText: 'Reset all durations' }).click();

    await expect(inputs.first()).toHaveValue('500');
    await expect(inputs.nth(1)).toHaveValue('500');
  });

  test('Duration is preserved after moving a scene', async ({ page }) => {
    await page.locator('text=Add scene').click();
    await expect(page.locator('.Claymate-scene')).toHaveCount(2);

    const inputs = page.locator('.Claymate-duration-input');
    await inputs.first().click({ clickCount: 3 });
    await inputs.first().fill('1000');
    await inputs.first().blur();

    await page.locator('.Claymate-scene').first().hover();
    await page
      .locator('.Claymate-scene')
      .first()
      .locator('.Claymate-right')
      .click();

    await expect(inputs.nth(1)).toHaveValue('1000');
  });

  test('Duration persists after page reload via localStorage', async ({
    page,
  }) => {
    const input = page.locator('.Claymate-duration-input').first();
    await input.click({ clickCount: 3 });
    await input.fill('1200');
    await input.blur();
    await expect(input).toHaveValue('1200');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Add scene')).toBeVisible();

    await expect(page.locator('.Claymate-duration-input').first()).toHaveValue(
      '1200',
    );
  });
});
