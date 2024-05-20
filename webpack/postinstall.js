const fs = require("fs").promises;
const path = require("path");

async function copyIfNotExists(source, destination) {
  try {
    await fs.access(destination);
    console.log("Destination file exists");
  } catch {
    console.log("Destination file does not exist, copying...");
    await fs.copyFile(source, destination);
    console.log("File copied");
  }
}

// Usage
const mocksDir = path.resolve(__dirname, "../src/providers/__mocks__");
copyIfNotExists(
  path.resolve(mocksDir, "example.ts"),
  path.resolve(mocksDir, "hunt.ts"),
);
