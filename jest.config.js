module.exports = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  roots: ["<rootDir>/src/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/jest_setup.ts"],
  snapshotFormat: {
    printBasicPrototype: false,
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.test.ts$": "ts-jest",
  },
};
