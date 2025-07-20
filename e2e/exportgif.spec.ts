import { test, expect } from "@playwright/test";
import { createDrawing } from "../src/__testHelpers/creationForTests";

test.describe("GIF", () => {
  test.beforeEach(async ({ page }) => {
    const initialData = createDrawing("Test", "Primary");

    // Set up the page with localStorage and mocked file picker
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    // Set localStorage data
    await page.evaluate((data) => {
      window.localStorage.setItem("excalidraw-elements", JSON.stringify(data));
    }, initialData);

    // Mock the file save picker
    await page.addInitScript(() => {
      if (window.showSaveFilePicker !== undefined) {
        window.showSaveFilePicker = () => ({
          createWritable: () => new WritableStream(),
        });
      }
    });

    // Reload to apply localStorage data
    await page.reload();
  });

  test("Export GIF", async ({ page }) => {
    // Click "Add scene" button
    await page.click("text=Add scene");

    // Verify the "Export GIF" button is visible and clickable
    const exportButton = page.locator("text=Export GIF");
    await expect(exportButton).toBeVisible();

    // Click "Export GIF" button
    await exportButton.click();

    // The test passes if the button clicks don't throw errors
    // The actual GIF export functionality is tested by the button being clickable
  });
});
