// trunk-ignore-all(eslint/@typescript-eslint/ban-types)
import { logger } from "src/logger";
import {
  DEFAULT_CURRENT_PROGRESS,
  DEFAULT_HUNT_CONFIG,
  DEFAULT_MAX_PROGRESS,
} from "src/providers/__mocks__/hunt";

logger.warn("Using mocked chrome library");

/**
 * These are incomplete mocks of the chrome library, used for local development.
 * Override the returned values as appropriate in order to suit development needs.
 *
 * The default hunt for development is loaded in from a git-ignored hunt.ts.
 */
const storageGetter = (items: string | string[], callback: Function) => {
  const defaultReturnValues = {
    huntConfig: DEFAULT_HUNT_CONFIG,
    currentProgress: DEFAULT_CURRENT_PROGRESS,
    maxProgress: DEFAULT_MAX_PROGRESS,
  };

  const ret: any = {};
  if (typeof items === "string") {
    let k: keyof typeof defaultReturnValues;
    for (k in defaultReturnValues) {
      if (k == items) {
        // trunk-ignore(eslint/@typescript-eslint/no-unsafe-member-access)
        ret[k] = defaultReturnValues[k];
        break;
      }
    }
  } else {
    let k: keyof typeof defaultReturnValues;
    for (k in defaultReturnValues) {
      if (items.includes(k)) {
        // trunk-ignore(eslint/@typescript-eslint/no-unsafe-member-access)
        ret[k] = defaultReturnValues[k];
      }
    }
  }
  logger.info("Invoking getter callback with items", ret);
  callback(ret);
};

const storageSetter = (items: { [key: string]: any }, callback: Function) => {
  logger.info("Setting items", items);
  logger.info("Executing setter callback");
  callback();
};

const addMessageListener = (callback: Function) => {
  logger.info("Registered on message listener callback", callback);
};

const addClickedListener = (callback: Function) => {
  logger.info("Registered on click listener callback", callback);
};

const setPopup = (obj: chrome.action.PopupDetails, callback: Function) => {
  logger.info("Registered popup", obj);
  callback();
};

const tabs = {
  create: (obj: chrome.tabs.CreateProperties) => {
    logger.info("Creating tab", obj);
  },
};

const storage = { local: { get: storageGetter, set: storageSetter } };

const runtime = {
  onMessage: { addListener: addMessageListener },
  sendMessage: (msg: any) => {
    logger.info("Sending message", msg);
  },
  getLastError: () => {
    logger.info("Returning no error");
    return undefined;
  },
  getURL: (url: string) => {
    logger.info("Getting URL", url);
    return url;
  },
};

const action = {
  onClicked: { addListener: addClickedListener },
  getBadgeText: (callback: (result: string) => void) => {
    callback("Badge Text");
  },
  setBadgetText: (contents: chrome.action.BadgeTextDetails) => {
    logger.info("Setting badge text", contents.text);
  },
  setPopup,
};

const downloads = {
  download: ({ url, filename }: { url: string; filename: string }) => {
    const tempElement = document.createElement("a");
    tempElement.href = url;
    tempElement.download = filename;
    document.body.appendChild(tempElement);
    tempElement.click();
    document.body.removeChild(tempElement);
  },
};

export const getProvider = () => ({
  tabs,
  storage,
  runtime,
  action,
  downloads,
});
