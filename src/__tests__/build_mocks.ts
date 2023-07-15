import { addOnClickedListener, setBadgeText } from "src/providers/action";
import { alertWrapper } from "src/providers/alert";
import { getCurrentURL } from "src/providers/href";
import {
  addInstalledListener,
  addMessageListener,
  getLastError,
  getURL,
  sendMessage,
} from "src/providers/runtime";
import { loadStorageValues, saveStorageValues } from "src/providers/storage";
import { createTab } from "src/providers/tabs";

export const buildProviderMocks = () => ({
  alertMock: jest.mocked(alertWrapper),
  addMessageListenerMock: jest.mocked(addMessageListener),
  addInstalledListenerMock: jest.mocked(addInstalledListener),
  addOnClickedListenerMock: jest.mocked(addOnClickedListener),
  createTabMock: jest.mocked(createTab),
  currentURLMock: jest.mocked(getCurrentURL),
  getLastErrorMock: jest.mocked(getLastError),
  getURLMock: jest.mocked(getURL),
  loadMock: jest.mocked(loadStorageValues),
  saveMock: jest.mocked(saveStorageValues),
  sendMessageMock: jest.mocked(sendMessage),
  setBadgeMock: jest.mocked(setBadgeText),
});
