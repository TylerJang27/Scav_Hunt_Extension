import * as fs from "fs";
import path from "path";
import { expect, test } from "src/__tests__/integration_tests/fixtures";

const PATH_TO_TEST_DATA = "src/__tests__/integration_tests/test_data";

test("upload draft", async ({ page, extensionId }) => {
  const draft_path = path.join(PATH_TO_TEST_DATA, "nonlinear_hunt.json");

  // Navigate to the landing page, and select an upload file
  await page.goto(`chrome-extension://${extensionId}/encode.html`);

  // Upload a draft file
  await page
    .getByTestId("draft-upload-button")
    .locator("input")
    .setInputFiles(draft_path);

  await expect(
    page.getByTestId("hunt-name-field").locator("input"),
  ).toHaveValue("The Hunt Is On");

  // Validate preview pane
  const draft_contents = fs.readFileSync(draft_path).toString();
  await expect(page.getByTestId("hunt-preview-pane")).toHaveText(
    draft_contents,
  );
});

test("upload error draft", async ({ page, extensionId }) => {
  const draft_path = path.join(PATH_TO_TEST_DATA, "invalid.json");

  // Navigate to the landing page, and select an upload file
  await page.goto(`chrome-extension://${extensionId}/encode.html`);
  // Upload a draft file
  await page
    .getByTestId("draft-upload-button")
    .locator("input")
    .setInputFiles(draft_path);

  await page.getByTestId("draft-upload-button").hover();

  await expect(page.getByRole("tooltip")).toHaveText(
    "Parsed invalid index 3. Expected 1",
  );

  await expect(
    page.getByTestId("hunt-name-field").locator("input"),
  ).toHaveValue("");
});
