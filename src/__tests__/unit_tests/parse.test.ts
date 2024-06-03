import * as fs from "fs";
import path from "path";
import { ParseConfig } from "src/utils/parse";

const PATH_TO_TEST_DATA = "src/__tests__/unit_tests/test_data";
const PATH_TO_BAD_TEST_DATA = path.join(PATH_TO_TEST_DATA, "bad");
const PATH_TO_GOOD_TEST_DATA = path.join(PATH_TO_TEST_DATA, "good");

const failureMessages = new Map<string, string | RegExp>([
  [
    "bad_version",
    /Supplied version 0.\d. Version must be one of \[((1.\d)(, )?)+\]/,
  ],
  ["bad_index", "1"],
  ["duplicate_index", "1"],
  ["empty", "Received empty field for clues"],
  ["index_gap", "Parsed invalid index 3. Expected 2"],
  ["malformed_clue", "Missing field 'url' in clue index 1"],
  ["malformed", "Missing field 'name'"],
  ["markdown_and_text", "Exactly one of text and markdown can be set"],
  ["no_clues", "Received empty field for clues"],
  ["unordered", "Parsed invalid index 2. Expected 1"],
]);

jest.mock("src/providers/chrome");

// This test presumes that the input file is well-formed JSON but malformed JSON.
fs.readdirSync(PATH_TO_BAD_TEST_DATA).forEach((version) => {
  describe(`Parse malformed ${version} hunt config`, () => {
    const testDataVersionPath = path.join(PATH_TO_BAD_TEST_DATA, version);
    const testFiles = fs
      .readdirSync(testDataVersionPath)
      .filter((value) => value.endsWith(".json"));

    testFiles.forEach((testFile) => {
      // trunk-ignore(eslint/jest/valid-title)
      it(testFile, () => {
        const testName = path.parse(testFile).name;
        const testFilePath = path.join(testDataVersionPath, testFile);
        // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
        const huntConfigInput = JSON.parse(
          fs.readFileSync(testFilePath).toString(),
        );

        const expectedMessage = failureMessages.get(testName);
        if (!expectedMessage) {
          throw new Error(`Missing expected error output for ${testName}`);
        }

        // Expected error handling case
        expect(() => ParseConfig(huntConfigInput)).toThrow(expectedMessage);
      });
    });
  });
});

fs.readdirSync(PATH_TO_GOOD_TEST_DATA).forEach((version) => {
  describe(`Parse valid ${version} hunt config`, () => {
    const testDataVersionPath = path.join(PATH_TO_GOOD_TEST_DATA, version);
    const testFiles = fs
      .readdirSync(testDataVersionPath)
      .filter((value) => value.endsWith(".json"));

    testFiles.forEach((testFile) => {
      // trunk-ignore(eslint/jest/valid-title)
      it(testFile, () => {
        const testFilePath = path.join(testDataVersionPath, testFile);
        // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
        const huntConfigInput = JSON.parse(
          fs.readFileSync(testFilePath).toString(),
        );

        expect(ParseConfig(huntConfigInput)).toMatchSnapshot();
      });
    });
  });
});
