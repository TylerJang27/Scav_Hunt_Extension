import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: "src/__tests__/integration_tests",
});
