import { presetHunt } from "src/__tests__/unit_tests/create_hunt_config";
import {
  setupMessageListener,
  setupOnClickedListener,
  setupOnInstalledListener,
} from "src/background";

import { buildProviderMocks } from "./build_mocks";

jest.mock("src/providers/action");
jest.mock("src/providers/chrome");
jest.mock("src/providers/runtime");
jest.mock("src/providers/storage");
jest.mock("src/providers/tabs");
jest.mock("src/logger/index");

const {
  addMessageListenerMock,
  addInstalledListenerMock,
  addOnClickedListenerMock,
  setBadgeMock,
  createTabMock,
  loadMock,
} = buildProviderMocks();

it("Receive messages", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  addMessageListenerMock.mockImplementation((callback) =>
    callback({ status: "Found" }, undefined, undefined),
  );
  setupMessageListener();
  expect(setBadgeMock).toHaveBeenCalledTimes(1);
  expect(setBadgeMock).toHaveBeenCalledWith("1");

  setBadgeMock.mockReset();
  addMessageListenerMock.mockImplementation((callback) =>
    callback({ status: "Not Found" }, undefined, undefined),
  );
  setupMessageListener();
  expect(setBadgeMock).toHaveBeenCalledTimes(1);
  expect(setBadgeMock).toHaveBeenCalledWith("");

  setBadgeMock.mockReset();
  addMessageListenerMock.mockImplementation((callback) =>
    callback({ status: "Invalid" }, undefined, undefined),
  );
  setupMessageListener();
  expect(setBadgeMock).toHaveBeenCalledTimes(1);
  expect(setBadgeMock).toHaveBeenCalledWith("");

  setBadgeMock.mockReset();
  addMessageListenerMock.mockImplementation((callback) =>
    callback(undefined, undefined, undefined),
  );
  setupMessageListener();
  expect(setBadgeMock).not.toHaveBeenCalled();
});

it("Click no progress", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "currentProgress", "userConfig"]);
    // Provide sample hunt, with no progress made yet
    callback({
      huntConfig: presetHunt,
      currentProgress: 0,
      userConfig: { displayMode: "Tab" },
    });
  });
  addOnClickedListenerMock.mockImplementation((callback) => callback());

  setupOnClickedListener();

  expect(setBadgeMock).toHaveBeenCalledTimes(1);
  expect(setBadgeMock).toHaveBeenCalledWith("");
  expect(createTabMock).not.toHaveBeenCalled();
});

it("Click well-formed config", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "currentProgress", "userConfig"]);
    // Provide sample hunt, with progress made
    callback({
      huntConfig: presetHunt,
      currentProgress: 1,
      userConfig: { displayMode: "Tab" },
    });
  });
  addOnClickedListenerMock.mockImplementation((callback) => callback());

  setupOnClickedListener();

  expect(setBadgeMock).toHaveBeenCalledTimes(1);
  expect(setBadgeMock).toHaveBeenCalledWith("");
  expect(createTabMock).toHaveBeenCalledTimes(1);
});

it("Click malformed config", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "currentProgress", "userConfig"]);
    // Provide malformed hunt
    callback({
      huntConfig: {},
      currentProgress: 999,
      userConfig: { displayMode: "Tab" },
    });
  });
  addOnClickedListenerMock.mockImplementation((callback) => callback());

  setupOnClickedListener();

  expect(setBadgeMock).toHaveBeenCalledTimes(1);
  expect(setBadgeMock).toHaveBeenCalledWith("");
  expect(createTabMock).toHaveBeenCalledWith("landing_page.html");
});

it("Install and open tab", () => {
  // Avoid the call to setup the listeners themselves.
  // First install event
  jest.resetAllMocks();
  addInstalledListenerMock.mockImplementation((callback) =>
    callback({ reason: "install" }),
  );

  setupOnInstalledListener();
  expect(createTabMock).toHaveBeenCalledTimes(1);
  expect(createTabMock).toHaveBeenCalledWith("landing_page.html");

  // Update event
  jest.resetAllMocks();
  addInstalledListenerMock.mockImplementation((callback) =>
    callback({ reason: "update" }),
  );

  setupOnInstalledListener();
  expect(createTabMock).not.toHaveBeenCalled();
});
