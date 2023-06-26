import { logger } from "./logger";
import { alertWrapper } from "./providers/alert";
import { getCurrentURL } from "./providers/href";
import { sendMessage } from "./providers/runtime";
// import { provider } from "./providers/chrome";
import { loadStorageValues, saveStorageValues } from "./providers/storage";
import { ClueConfig, HuntConfig } from "./types/hunt_config";
import { nonNull } from "./utils/helpers";
import { Decrypt } from "./utils/parse";

/**
 * When a page is loaded:
 * 1. Check if the stored hunt config is valid
 * 2. Check if the current URL applies to any clues
 * 3. If it does, send a message to the background/worker to render an update for the clue
 *
 * Notes:
 * 1. Content Script is in charge of rendering an alert if desired
 * 2. Content Script is in charge of updating progress and maxProgress* on opened
 * 3. Worker is in charge of updating the badge text
 */

const CLUE_FOUND_TEXT =
  "You found a clue! Click on the Scavenger Hunt icon to view the message.";

/* Parse hunt config and current page */

const checkHuntForURLMatch = (
  huntConfig: HuntConfig
): ClueConfig | undefined => {
  logger.info("checking for match!");
  const {
    encrypted,
    clues,
    options: { silent },
  } = huntConfig;
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];

    const clueUrl = Decrypt(clue.url, encrypted);
    const reg = new RegExp(clueUrl);
    const currentUrl = getCurrentURL();
    if (!currentUrl.match(reg) && !currentUrl.includes(clueUrl)) {
      continue;
    }

    // Successfully found the matching URL. Now propagate the decrypted clue to the worker
    if (!silent) {
      alertWrapper(CLUE_FOUND_TEXT);
    }
    logger.info("found a match!");
    return clue;
  }

  return undefined;
};

/* Send messages to worker */

const sendClueFound = (maxProgress: number, solvedClue: ClueConfig) => {
  const currentProgress = solvedClue.id;
  const sendClueFoundMessage = () => {
    sendMessage({
      status: "Found",
    });
  };

  saveStorageValues(
    {
      maxProgress:
        currentProgress > maxProgress ? currentProgress : maxProgress,
      currentProgress,
    },
    sendClueFoundMessage
  );
};

const sendClueNotFound = () => {
  sendMessage({
    status: "Not Found",
  });
};

const sendEmptyOrInvalidHunt = () => {
  sendMessage({
    status: "Invalid",
  });
};

/* Handle storage and page */

const loadHuntCallback = (items: any) => {
  logger.info(items);
  try {
    if (items.huntConfig && nonNull(items.maxProgress)) {
      const urlMatchClue = checkHuntForURLMatch(items.huntConfig as HuntConfig);
      if (urlMatchClue) {
        sendClueFound(items.maxProgress, urlMatchClue);
      } else {
        sendClueNotFound();
      }
    } else {
      sendEmptyOrInvalidHunt();
    }
  } catch (err) {
    logger.warn(err);
    sendEmptyOrInvalidHunt();
  }
};

export const loadHuntProgress = () => {
  loadStorageValues(["huntConfig", "maxProgress"], loadHuntCallback);
};

loadHuntProgress();
