import { sampleHunt } from "./create_hunt_config";
import { buildProviderMocks } from "./build_mocks";
import { saveConfigAndLaunch } from "src/options";
import { resetStorage } from "src/providers/helpers";

// TODO: Add additional logic and testing for reseting/clearing the hunt.
// TODO: The options page needs frontend testing for all its different states.

jest.mock("src/providers/chrome");
jest.mock("src/providers/runtime");
jest.mock("src/providers/storage");
jest.mock("src/providers/tabs");
jest.mock("src/logger/index");
jest.mock("src/utils/root");

const { createTabMock, getLastErrorMock, saveMock } = buildProviderMocks();

it("Save config", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  saveMock.mockImplementation((items, callback) => {
    expect(items).toEqual({
      sourceType: "Sample",
      huntConfig: sampleHunt,
      maxProgress: 0,
      currentProgress: 0,
    });
    // Provide sample hunt, with no progress made yet
    callback();
  });

  getLastErrorMock.mockReturnValue(undefined);

  saveConfigAndLaunch(sampleHunt, "Sample");
  expect(saveMock).toBeCalledTimes(1);
  expect(createTabMock).toBeCalledTimes(1);
  expect(createTabMock).toBeCalledWith("beginning.html");
});

it("Reset config", () => {
  // Avoid the call to setup the listeners themselves.
  jest.resetAllMocks();

  saveMock.mockImplementation((items, callback) => {
    expect(items).toEqual({
      sourceType: null,
      huntConfig: null,
      maxProgress: null,
      currentProgress: null,
    });
    // Provide sample hunt, with no progress made yet
    callback();
  });

  resetStorage(() => {});
  expect(saveMock).toBeCalledTimes(1);
});