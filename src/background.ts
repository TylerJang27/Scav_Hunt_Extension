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
import { SomeProgress } from "src/types/progress";
import { nonNull } from "src/utils/helpers";

const CHROME_INSTALL_REASON = "install";

const openClueCallback = (items: SomeProgress) => {
  // TODO: TYLER SHOULD WE OPEN THE OPTIONS PAGE WHEN THERES NO HUNT? OR A TUTORIAL?
  if (
    items.huntConfig &&
    items.huntConfig.clues &&
    nonNull(items.currentProgress)
  ) {
    if (items.currentProgress == 0) {
      return;
    }
    const { clues } = items.huntConfig;
    const foundClue = clues[items.currentProgress! - 1];
    // TODO: TYLER REMOVE THIS FUNCTIONALITY AND USE MARKDOWN
    if (foundClue.html) {
      logger.error(
        "HTML functionality is deprecated. Please adjust your hunt.",
      );
      // createTab(Decrypt(foundClue.html, encrypted));
      return;
    }

    // Open the clue page for the most recently found clue.
    // This should actually be awaited, but the wiring here is nontrivial so leaving as is for now.
    // trunk-ignore(eslint/@typescript-eslint/no-floating-promises)
    createTab("popup.html");
  } else {
    logger.warn(EMPTY_OR_INVALID_HUNT);
    // trunk-ignore(eslint/@typescript-eslint/no-floating-promises)
    createTab("landing_page.html");
  }
};

export const setupMessageListener = () =>
  addMessageListener((request, _sender, _sendResponse) => {
    if (request) {
      // trunk-ignore-begin(eslint/@typescript-eslint/no-unsafe-member-access,eslint/@typescript-eslint/no-floating-promises)
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
      // trunk-ignore-end(eslint/@typescript-eslint/no-unsafe-member-access,eslint/@typescript-eslint/no-floating-promises)
    }
    logger.warn("Invalid request", request);
  });

export const setupOnClickedListener = () =>
  addOnClickedListener(() => {
    // trunk-ignore(eslint/@typescript-eslint/no-floating-promises)
    setBadgeText("");
    loadStorageValues(["huntConfig", "currentProgress"], openClueCallback);
  });

export const setupOnInstalledListener = () => {
  addInstalledListener((details) => {
    logger.debug(`Received install event ${details.reason}`);
    if (details.reason === CHROME_INSTALL_REASON) {
      // trunk-ignore(eslint/@typescript-eslint/no-floating-promises)
      createTab("landing_page.html");
    }
  });
};

setupOnInstalledListener();
setupMessageListener();
setupOnClickedListener();
