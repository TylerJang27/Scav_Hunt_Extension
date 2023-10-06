import path from "path";
import { expect, test } from "src/__tests__/integration_tests/fixtures";

const PATH_TO_TEST_DATA = "src/__tests__/integration_tests/test_data";

// TODO(Tyler): See if we can test the alerts and clicking on the badge as well.
test("stress test", async ({ page, extensionId }) => {
  // Navigate to the landing page, and select an upload file
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);
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

  // Then, navigate to the beginning page.
  await page.goto(`chrome-extension://${extensionId}/beginning.html`);
  await expect(page.locator("body")).toContainText("Welcome to the hunt.");

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

  // Then, navigate to the second clue page, and go to popup.html
  await page.goto("https://www.khanacademy.org");
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator("body")).toContainText("The Hunt Is On: 2");

  // Then, navigate to the third clue page, and go to popup.html
  await page.goto("https://www.bing.com");
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator("body")).toContainText("The Hunt Is On: 3");
  await expect(page.locator("body")).toContainText("Enter yolo");

  // Then, navigate to the first clue page, and go to popup.html
  await page.goto("https://www.google.com");
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator("body")).toContainText("The Hunt Is On: 1");

  // Then, navigate to the second clue page, and go to popup.html
  await page.goto("https://www.khanacademy.org");
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator("body")).toContainText("The Hunt Is On: 2");

  // Then, reset the hunt
  // Navigate to the landing page, and select an upload file
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);
  await page.getByTestId("hunt-upload-button").click();
  await expect(page.getByTestId("hunt-submit-tooltip")).toHaveAttribute(
    "aria-label",
    "Please specify an upload file",
  );

  // Choose a file
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);
  await page.getByTestId("hunt-reset-button").click();

  // Finally, navigate to the first clue page, and go to popup.html
  await page.goto("https://www.google.com");
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator("body")).toContainText("Empty or invalid hunt.");
});
