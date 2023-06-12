import { loadHuntProgress } from "../../src/content_script";
import {
  sampleEncryptedHunt,
  sampleHunt,
  sampleSilentHunt,
} from "./create_hunt_config";
import { buildProviderMocks } from "./build_mocks";

// TODO: Add additional test coverage for loading an old corrupted hunt once we have multiple config versions. New extension versions should be compatible with older hunts when possible.

jest.mock("../../src/providers/alert");
jest.mock("../../src/providers/chrome");
jest.mock("../../src/providers/href");
jest.mock("../../src/providers/runtime");
jest.mock("../../src/providers/storage");
jest.mock("../../src/logger/index");

const { loadMock, saveMock, currentURLMock, alertMock, sendMessageMock } =
  buildProviderMocks();

it("Check URL for match", () => {
  // Avoid the call to loadHuntProgress in content_script itself.
  jest.resetAllMocks();
  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "maxProgress"]);
    // Provide sample hunt, with no progress made yet
    callback({ huntConfig: sampleHunt, maxProgress: 0 });
  });
  sendMessageMock.mockImplementation((message) => {
    expect(message).toEqual({ status: "Found" });
  });
  saveMock.mockImplementation((items, callback) => {
    expect(items).toEqual({ maxProgress: 2, currentProgress: 2 });
    callback();
  });

  currentURLMock.mockReturnValue(
    `http://padding.${sampleHunt.clues[1].url}/padding`
  );

  // Run the script triggered when a page is loaded.
  loadHuntProgress();

  expect(loadMock).toHaveBeenCalledTimes(1);
  expect(currentURLMock).toHaveBeenCalledTimes(2);
  expect(alertMock).toHaveBeenCalledTimes(1);
  expect(sendMessageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).toHaveBeenCalledTimes(1);
});

it("Check URL for match from in-progress hunt", () => {
  // Avoid the call to loadHuntProgress in content_script itself.
  jest.resetAllMocks();
  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "maxProgress"]);
    // Provide sample hunt, with some progress made
    callback({ huntConfig: sampleHunt, maxProgress: 3 });
  });
  sendMessageMock.mockImplementation((message) => {
    expect(message).toEqual({ status: "Found" });
  });
  saveMock.mockImplementation((items, callback) => {
    expect(items).toEqual({ maxProgress: 3, currentProgress: 1 });
    callback();
  });

  currentURLMock.mockReturnValue(
    `http://padding.${sampleHunt.clues[0].url}/padding`
  );

  // Run the script triggered when a page is loaded.
  loadHuntProgress();

  expect(loadMock).toHaveBeenCalledTimes(1);
  expect(currentURLMock).toHaveBeenCalledTimes(1);
  expect(alertMock).toHaveBeenCalledTimes(1);
  expect(sendMessageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).toHaveBeenCalledTimes(1);
});

it("Check URL for match from silent hunt", () => {
  // Avoid the call to loadHuntProgress in content_script itself.
  jest.resetAllMocks();
  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "maxProgress"]);
    // Provide silent hunt, with some progress made already
    callback({ huntConfig: sampleSilentHunt, maxProgress: 4 });
  });
  sendMessageMock.mockImplementation((message) => {
    expect(message).toEqual({ status: "Found" });
  });
  saveMock.mockImplementation((items, callback) => {
    expect(items).toEqual({ maxProgress: 4, currentProgress: 4 });
    callback();
  });

  currentURLMock.mockReturnValue(
    `http://padding.${sampleSilentHunt.clues[3].url}/padding`
  );

  // Run the script triggered when a page is loaded.
  loadHuntProgress();

  expect(loadMock).toHaveBeenCalledTimes(1);
  expect(currentURLMock).toHaveBeenCalledTimes(4);
  expect(alertMock).not.toHaveBeenCalled();
  expect(sendMessageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).toHaveBeenCalledTimes(1);
});

it("Check encoded URL for match from in-progress hunt", () => {
  // Avoid the call to loadHuntProgress in content_script itself.
  jest.resetAllMocks();
  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "maxProgress"]);
    // Provide encrypted hunt, with some progress
    callback({ huntConfig: sampleEncryptedHunt, maxProgress: 2 });
  });
  sendMessageMock.mockImplementation((message) => {
    expect(message).toEqual({ status: "Found" });
  });
  saveMock.mockImplementation((items, callback) => {
    expect(items).toEqual({ maxProgress: 3, currentProgress: 3 });
    callback();
  });

  currentURLMock.mockReturnValue(
    `http://padding.${sampleHunt.clues[2].url}/padding`
  );

  // Run the script triggered when a page is loaded.
  loadHuntProgress();

  expect(loadMock).toHaveBeenCalledTimes(1);
  expect(currentURLMock).toHaveBeenCalledTimes(3);
  expect(alertMock).toHaveBeenCalledTimes(1);
  expect(sendMessageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).toHaveBeenCalledTimes(1);
});

it("Check URL for no match", () => {
  // Avoid the call to loadHuntProgress in content_script itself.
  jest.resetAllMocks();
  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "maxProgress"]);
    // Provide sample hunt, with no progress made yet
    callback({ huntConfig: sampleHunt, maxProgress: 0 });
  });
  sendMessageMock.mockImplementation((message) => {
    expect(message).toEqual({ status: "Not Found" });
  });

  currentURLMock.mockReturnValue(
    "http://random_string_of_not_the_right_url.com"
  );

  // Run the script triggered when a page is loaded.
  loadHuntProgress();

  expect(loadMock).toHaveBeenCalledTimes(1);
  expect(currentURLMock).toHaveBeenCalledTimes(5);
  expect(alertMock).not.toHaveBeenCalled();
  expect(sendMessageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).not.toHaveBeenCalled();
});

it("Check URL with invalid hunt", () => {
  // Avoid the call to loadHuntProgress in content_script itself.
  jest.resetAllMocks();
  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "maxProgress"]);
    // Provide corrupt hunt
    callback({ huntConfig: {}, maxProgress: 99 });
  });
  sendMessageMock.mockImplementation((message) => {
    expect(message).toEqual({ status: "Invalid" });
  });

  // Run the script triggered when a page is loaded.
  loadHuntProgress();

  expect(loadMock).toHaveBeenCalledTimes(1);
  expect(currentURLMock).not.toHaveBeenCalled();
  expect(alertMock).not.toHaveBeenCalled();
  expect(sendMessageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).not.toHaveBeenCalled();
});
