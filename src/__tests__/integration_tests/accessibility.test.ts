import AxeBuilder from "@axe-core/playwright";
import path from "path";
import { expect, test } from "src/__tests__/integration_tests/fixtures";

const PATH_TO_TEST_DATA = "src/__tests__/integration_tests/test_data";

test.describe("accessibility", () => {
  // TODO: TYLER BURNDOWN AND RE-ENABLE ACCESSIBILITY TESTS.
  // trunk-ignore(eslint/playwright/no-skipped-test)
  test.skip("landing page, beginning, and popup", async ({
    page,
    extensionId,
  }) => {
    // Navigate to the landing page, and select an upload file
    await page.goto(`chrome-extension://${extensionId}/landing_page.html`);

    // Scan for accessibility
    const landingPageAccessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();
    expect(landingPageAccessibilityScanResults.violations).toEqual([]);

    // Create a popup with a prompt
    await page.getByTestId("hunt-upload-button").click();
    await expect(page.getByTestId("hunt-submit-tooltip")).toHaveAttribute(
      "aria-label",
      "Please specify an upload file",
    );

    // Choose a file
    await page
      .getByTestId("hunt-upload-button")
      .locator("input")
      .setInputFiles(path.join(PATH_TO_TEST_DATA, "hunt.json"));
    await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );

    // TODO(Tyler): When clicked, should it redirect in the playwright test?
    await page.getByTestId("hunt-submit-button").click();

    // Navigate to beginning page
    await page.goto(`chrome-extension://${extensionId}/beginning.html`);

    // Scan for accessibility
    const beginningAccessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();
    expect(beginningAccessibilityScanResults.violations).toEqual([]);

    // Then, navigate to the third clue page, and go to popup.html
    await page.goto("https://www.bing.com");
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(page.locator("body")).toContainText("The Hunt Is On: 3");
    await expect(page.locator("body")).toContainText("Enter yolo");

    // Enter the interactive answer, and submit to reveal the full clue
    await page
      .getByTestId("interactive-input-field")
      .locator("input")
      .type("yolo");
    await page.getByTestId("interactive-submit-button").click();
    await expect(page.locator("body")).toContainText("You cracked the code!");

    // Scan for accessibility
    const popupAccessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();
    expect(popupAccessibilityScanResults.violations).toEqual([]);
  });

  // trunk-ignore(eslint/playwright/no-skipped-test)
  test.skip("encode page", async ({ page, extensionId }) => {
    // Navigate to the landing page, and select an upload file
    await page.goto(`chrome-extension://${extensionId}/encode.html`);

    // Scan for accessibility
    const landingPageAccessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();
    expect(landingPageAccessibilityScanResults.violations).toEqual([]);
  });
});
