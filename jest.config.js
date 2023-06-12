module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/jest_setup.ts"],
  snapshotFormat: {
    printBasicPrototype: false,
  },
  transform: {
    "^.+\\.test.ts$": "ts-jest",
  },
};
