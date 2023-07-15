// Chrome manifest v3 migrated from a background worker to service worker

import { logger } from "src/logger";
import { addOnClickedListener, setBadgeText } from "src/providers/action";
import {
  addInstalledListener,
  addMessageListener,
} from "src/providers/runtime";
import { loadStorageValues } from "src/providers/storage";
import { createTab } from "src/providers/tabs";
import { EMPTY_OR_INVALID_HUNT } from "src/types/errors";
import { nonNull } from "src/utils/helpers";

const CHROME_INSTALL_REASON = "install";

const openClueCallback = (items: any) => {
  // TODO: TYLER SHOULD WE OPEN THE OPTIONS PAGE WHEN THERES NO HUNT? OR A TUTORIAL?
  if (
    items.huntConfig &&
    items.huntConfig.clues &&
    nonNull(items.currentProgress)
  ) {
    if (items.currentProgress == 0) {
      return;
    }
    const { clues, encrypted } = items.huntConfig;
    const foundClue = clues[items.currentProgress - 1];
    // TODO: TYLER REMOVE THIS FUNCTIONALITY AND USE MARKDOWN
    if (foundClue.html) {
      logger.error(
        "HTML functionality is deprecated. Please adjust your hunt."
      );
      // createTab(Decrypt(foundClue.html, encrypted));
      return;
    }

    // Open the clue page for the most recently found clue.
    createTab("popup.html");
  } else {
    logger.warn(EMPTY_OR_INVALID_HUNT);
  }
};

export const setupMessageListener = () =>
  addMessageListener((request, sender, sendResponse) => {
    if (request) {
      if (request.status == "Found") {
        setBadgeText("1");
        return;
      } else if (request.status == "Not Found") {
        setBadgeText("");
        return;
      } else {
        // Invalid
        setBadgeText("X");
        return;
      }
    }
    logger.warn("Invalid request", request);
  });

export const setupOnClickedListener = () =>
  addOnClickedListener(() => {
    setBadgeText("");
    loadStorageValues(["huntConfig", "currentProgress"], openClueCallback);
  });

export const setupOnInstalledListener = () => {
  addInstalledListener((details) => {
    logger.debug(`Received install event ${details.reason}`);
    if (details.reason === CHROME_INSTALL_REASON) {
      createTab("options.html");
    }
  });
};

setupOnInstalledListener();
setupMessageListener();
setupOnClickedListener();
