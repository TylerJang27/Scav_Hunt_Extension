import { logger } from "src/logger";
import { alertWrapper } from "src/providers/alert";
import { getCurrentURL } from "src/providers/href";
import { sendMessage } from "src/providers/runtime";
import { loadStorageValues, saveStorageValues } from "src/providers/storage";
import { ClueConfig, HuntConfig } from "src/types/hunt_config";
import { SomeProgress } from "src/types/progress";
import { Decrypt } from "src/utils/encrypt";
import { nonNull } from "src/utils/helpers";

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
  huntConfig: HuntConfig,
): ClueConfig | undefined => {
  const {
    encrypted,
    clues,
    options: { silent },
  } = huntConfig;
  logger.info(`checking for match among ${clues.length} clues`);

  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];
    // We could check for url earlier, but this is useful for testing fidelity without much cost.
    const currentUrl = getCurrentURL();
    const clueUrl = Decrypt(clue.url, encrypted, huntConfig.name);
    const reg = new RegExp(clueUrl);
    logger.info(`checking ${currentUrl} against ${clueUrl}`);
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

  console.log("tyler doing the popup thing"); // todo: remove
  saveStorageValues(
    {
      maxProgress:
        currentProgress > maxProgress ? currentProgress : maxProgress,
      currentProgress,
    },
    sendClueFoundMessage,
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

const loadHuntCallback = (items: SomeProgress) => {
  logger.info(items);
  try {
    if (items.huntConfig && nonNull(items.maxProgress)) {
      const urlMatchClue = checkHuntForURLMatch(items.huntConfig);
      if (urlMatchClue) {
        sendClueFound(items.maxProgress!, urlMatchClue);
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
