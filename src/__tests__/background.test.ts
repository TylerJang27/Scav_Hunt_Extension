import {
  setupMessageListener,
  setupOnClickedListener,
  setupOnInstalledListener,
} from "src/background";
import { sampleHunt } from "src/__tests__/create_hunt_config";
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
    callback({ status: "Found" }, undefined, undefined)
  );
  setupMessageListener();
  expect(setBadgeMock).toBeCalledTimes(1);
  expect(setBadgeMock).toBeCalledWith("1");

  setBadgeMock.mockReset();
  addMessageListenerMock.mockImplementation((callback) =>
    callback({ status: "Not Found" }, undefined, undefined)
  );
  setupMessageListener();
  expect(setBadgeMock).toBeCalledTimes(1);
  expect(setBadgeMock).toBeCalledWith("");

  setBadgeMock.mockReset();
  addMessageListenerMock.mockImplementation((callback) =>
    callback({ status: "Invalid" }, undefined, undefined)
  );
  setupMessageListener();
  expect(setBadgeMock).toBeCalledTimes(1);
  expect(setBadgeMock).toBeCalledWith("X");

  setBadgeMock.mockReset();
  addMessageListenerMock.mockImplementation((callback) =>
    callback(undefined, undefined, undefined)
  );
  setupMessageListener();
  expect(setBadgeMock).not.toHaveBeenCalled();
});

it("Click no progress", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "currentProgress"]);
    // Provide sample hunt, with no progress made yet
    callback({ huntConfig: sampleHunt, currentProgress: 0 });
  });
  addOnClickedListenerMock.mockImplementation((callback) => callback());

  setupOnClickedListener();

  expect(setBadgeMock).toBeCalledTimes(1);
  expect(setBadgeMock).toBeCalledWith("");
  expect(createTabMock).not.toBeCalled();
});

it("Click well-formed config", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "currentProgress"]);
    // Provide sample hunt, with progress made
    callback({ huntConfig: sampleHunt, currentProgress: 1 });
  });
  addOnClickedListenerMock.mockImplementation((callback) => callback());

  setupOnClickedListener();

  expect(setBadgeMock).toBeCalledTimes(1);
  expect(setBadgeMock).toBeCalledWith("");
  expect(createTabMock).toBeCalledTimes(1);
});

it("Click malformed config", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  loadMock.mockImplementation((items, callback) => {
    expect(items).toEqual(["huntConfig", "currentProgress"]);
    // Provide malformed hunt
    callback({ huntConfig: {}, currentProgress: 999 });
  });
  addOnClickedListenerMock.mockImplementation((callback) => callback());

  setupOnClickedListener();

  expect(setBadgeMock).toBeCalledTimes(1);
  expect(setBadgeMock).toBeCalledWith("");
  expect(createTabMock).not.toBeCalled();
});

it("Install and open tab", () => {
  // Avoid the call to setup the listeners themselves.
  // First install event
  jest.resetAllMocks();
  addInstalledListenerMock.mockImplementation((callback) =>
    callback({ reason: "install" })
  );

  setupOnInstalledListener();
  expect(createTabMock).toBeCalledTimes(1);
  expect(createTabMock).toBeCalledWith("options.html");

  // Update event
  jest.resetAllMocks();
  addInstalledListenerMock.mockImplementation((callback) =>
    callback({ reason: "update" })
  );

  setupOnInstalledListener();
  expect(createTabMock).not.toBeCalled();
});
