import * as fs from "fs";
import path from "path";
import { expect, test } from "src/__tests__/integration_tests/fixtures";

const PATH_TO_TEST_DATA = "src/__tests__/integration_tests/test_data";

test("manual input", async ({ page, extensionId }) => {
  const expected_preview_path = path.join(
    PATH_TO_TEST_DATA,
    "expected_manual.json",
  );
  const expected_download_path = path.join(
    PATH_TO_TEST_DATA,
    "expected_download.json",
  );

  // Navigate to the landing page, and select an upload file
  await page.goto(`chrome-extension://${extensionId}/encode.html`);

  await page
    .getByTestId("hunt-name-field")
    .locator("input")
    .type("Manual Hunt");

  await page
    .getByTestId("hunt-description-field")
    .locator("input")
    .type("Test hunt");

  await page.getByTestId("hunt-author-field").locator("input").type("Tester");

  await page
    .getByTestId("hunt-background-field")
    .locator("input")
    .type(
      "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80",
    );

  await page
    .getByTestId("hunt-beginning-field")
    .locator("textarea")
    .first()
    .type("Starter clue");

  await page.getByTestId("hunt-silent-field").click();
  await page.getByTestId("hunt-silent-true").click();

  await page.getByTestId("hunt-in-order-field").click();
  await page.getByTestId("hunt-in-order-true").click();

  await page.getByTestId("hunt-encrypted-field").click();
  await page.getByTestId("hunt-encrypted-false").click();

  await page.getByTestId("hunt-create-button").click();

  // Clue Modal 1
  await page.getByTestId("clue-url-field").locator("input").type("google.com");
  await page
    .getByTestId("clue-text-field")
    .locator("textarea")
    .first()
    .type("You're at Google");
  await page.getByTestId("clue-save-button").click();

  // Clue Modal 2
  await page.getByTestId("hunt-create-button").click();
  await page.getByTestId("clue-url-field").locator("input").type("bing.com");
  await page
    .getByTestId("clue-text-field")
    .locator("textarea")
    .first()
    .type("You're at Bing");
  await page
    .getByTestId("clue-prompt-field")
    .locator("textarea")
    .first()
    .type("Enter asdf");
  await page.getByTestId("clue-key-field").locator("input").type("asdf");
  await page.getByTestId("clue-save-button").click();

  // Clue Modal 3 (markdown)
  await page.getByTestId("hunt-create-button").click();
  await page.getByTestId("clue-url-field").locator("input").type("yahoo.com");
  // text first
  await page
    .getByTestId("clue-text-field")
    .locator("textarea")
    .first()
    .type("You're at Bing");
  await expect(page.getByTestId("clue-markdown-field")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await page
    .getByTestId("clue-text-field")
    .locator("textarea")
    .first()
    .fill("");
  await expect(page.getByTestId("clue-markdown-field")).toHaveAttribute(
    "aria-disabled",
    "false",
  );

  // then markdown
  await page
    .getByTestId("clue-markdown-field")
    .locator("textarea")
    .first()
    .type("# Header\n\n*Markdown clue*");
  await expect(page.getByTestId("clue-text-field")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await page.getByTestId("clue-save-button").click();

  // Validate preview pane
  const expected_preview_contents = fs
    .readFileSync(expected_preview_path)
    .toString();
  await expect(page.getByTestId("hunt-preview-pane")).toHaveText(
    expected_preview_contents,
  );

  // Validate downloaded contents
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("hunt-download-button").click();
  const download = await downloadPromise;
  const downloadPath = await download.path();

  const expected_download_contents = fs
    .readFileSync(expected_download_path)
    .toString();
  expect(fs.readFileSync(downloadPath!).toString()).toEqual(
    expected_download_contents,
  );
});
