import exp from "constants";
import { test, expect } from "src/__tests__/integration_tests/fixtures";

// test('example test', async ({ page }) => {
//   await page.goto('https://example.com');
//   await expect(page.locator('body')).toHaveText('Changed by my-extension');
// });

test("landing page", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);
  console.log(await page.content());
  await expect(page.locator("body")).toContainText("Begin A Hunt");
  await expect(page.getByTestId("hunt-preset-toggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId('hunt-preset-button')).toContainText("hunt");

  await expect(page.getByTestId('hunt-submit-button')).toHaveAttribute("aria-disabled", "false");

  await page.getByTestId('hunt-url-textfield').click();
  await expect(page.getByTestId('hunt-submit-button')).toHaveAttribute("aria-disabled", "true");

  await page.getByTestId('hunt-url-textfield').locator("input").type("https://www.google.com");
  await expect(page.getByTestId('hunt-submit-button')).toHaveAttribute("aria-disabled", "false");

  await page.getByTestId('hunt-submit-button').click();
  await expect(page.getByTestId('hunt-submit-tooltip')).toContainText("dsaf");



  // Check the preset


  // Check the submit button is disabled if the URL is empty

});
