import { test, expect } from "src/__tests__/integration_tests/fixtures";

// test('example test', async ({ page }) => {
//   await page.goto('https://example.com');
//   await expect(page.locator('body')).toHaveText('Changed by my-extension');
// });

test("landing page", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);
  console.log(await page.content());
  await expect(page.locator("body")).toContainText("Begin A Hunt");
});
