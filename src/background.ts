// Chrome manifest v3 migrated from a background worker to service worker

import { logger } from "./logger";
import { provider } from "./providers/chrome";
import { EMPTY_OR_INVALID_HUNT } from "./types/errors";
import { Decrypt } from "./utils/parse";

const openClueCallback = (items: any) => {
  if (items.huntConfig && items.currentProgress !== undefined) {
    if (items.currentProgress == 0) {
      // TODO: TYLER SHOULD WE OPEN THE OPTIONS PAGE? OR A TUTORIAL?
      return;
    }
    const { clues, encrypted } = items.huntConfig;
    const foundClue = clues[items.currentProgress - 1];
    if (foundClue.html) {
      provider.tabs.create({ url: Decrypt(foundClue.html, encrypted) });
      return;
    }

    // Open the clue page for the most recently found clue.
    provider.tabs.create({ url: "popup.html" });
  } else {
    logger.warn(EMPTY_OR_INVALID_HUNT);
  }
};

provider.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request) {
    if (request.status == "Found") {
      provider.action.setBadgeText({ text: "1" });
      return;
    } else if (request.status == "Not Found") {
      provider.action.setBadgeText({ text: "" });
      return;
    } else if (request.status == "Invalid") {
      provider.action.setBadgeText({ text: "X" });
      return;
    }
  }
  logger.info("Invalid request", request);
});

provider.action.onClicked.addListener(function (tab) {
  provider.action.setBadgeText({ text: "" });

  provider.storage.local.get(["huntConfig", "currentProgress"], function (items) {
    openClueCallback(items);
  });
});
