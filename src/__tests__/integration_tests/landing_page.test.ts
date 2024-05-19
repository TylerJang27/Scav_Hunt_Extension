import path from "path";
import { expect, test } from "src/__tests__/integration_tests/fixtures";

const PATH_TO_TEST_DATA = "src/__tests__/integration_tests/test_data";

test("landing page", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);

  // Initial setup should be Preset selected, with "hunt" chosen, submit should be enabled
  await expect(page.locator("body")).toContainText("Begin A Hunt");
  await expect(page.getByTestId("hunt-preset-toggle")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("hunt-preset-select")).toContainText(
    "Tutorial",
  );
  await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
    "aria-disabled",
    "false",
  );

  // After clicking on text field, submit should be disabled
  await page.getByTestId("hunt-url-textfield").click();
  await expect(page.getByTestId("hunt-url-toggle")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
    "aria-disabled",
    "true",
  );

  // Typing into text field, and then selecting off should make submit enabled again
  // first character isn"t registered
  await page
    .getByTestId("hunt-url-textfield")
    .locator("input")
    .type("https://www.google.com");
  await page.getByTestId("hunt-url-textfield").click();
  await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
    "aria-disabled",
    "false",
  );

  // Clicking on the submit button will load invalid JSON, causing an error to popup
  await page.getByTestId("hunt-submit-button").click();
  await expect(page.getByTestId("hunt-submit-tooltip")).toHaveAttribute(
    "aria-label",
    "Unexpected token '<', \"<!doctype \"... is not valid JSON",
  );

  // Clicking on the upload button should make the submit button disabled again, until a file is chosen
  await page.getByTestId("hunt-upload-button").click();
  await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(page.getByTestId("hunt-upload-toggle")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("hunt-submit-tooltip")).toHaveAttribute(
    "aria-label",
    "Please specify an upload file",
  );

  // Choose a file
  await page
    .getByTestId("hunt-upload-button")
    .locator("input")
    .setInputFiles(path.join(PATH_TO_TEST_DATA, "linear_hunt.json"));
  await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
    "aria-disabled",
    "false",
  );

  // TODO(Tyler): When clicked, should it redirect in the playwright test?
  await page.getByTestId("hunt-submit-button").click();

  // Once submitted, reloading the page should show the same chosen state.
  await page.goto(`chrome-extension://${extensionId}/landing_page.html`);
  await expect(page.getByTestId("hunt-preset-toggle")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(page.getByTestId("hunt-submit-button")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(page.getByTestId("hunt-upload-button")).toHaveText(
    "linear_hunt.json",
  );
});
