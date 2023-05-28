import { ClueConfig, HuntConfig } from "./types/hunt_config";
import { SolvedOptions, SolvedClueWrapper } from "./types/progress";
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

/* Utils */

const alertWrapper = (msg: any) => {
  //TODO: CHANGE alertWrapper APPEARANCE, https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box

  // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, msg, setMessage);
  // })
  // Potentially also chrome.notifications
  alert(msg);
};

/* Parse hunt config and current page */

const checkHuntForURLMatch = (
  huntConfig: HuntConfig
): ClueConfig | undefined => {
  console.log("checking for match!");
  const {
    encrypted,
    clues,
    options: { silent },
  } = huntConfig;
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];

    const clueUrl = Decrypt(clue.url, encrypted);
    const reg = new RegExp(clueUrl);
    const currentUrl = window.location.href;
    if (!currentUrl.match(reg) && !currentUrl.includes(clueUrl)) {
      continue;
    }

    // Successfully found the matching URL. Now propagate the decrypted clue to the worker
    if (!silent) {
      alertWrapper(CLUE_FOUND_TEXT);
    }
    console.log("found a match!");
    return clue;
  }

  return undefined;
};

/* Send messages to worker */

const sendClueFound = (maxProgress: number, solvedClue: ClueConfig) => {
  const currentProgress = solvedClue.id;
  const sendClueFoundMessage = () => {
    chrome.runtime.sendMessage({
      status: "Found",
    });
  };

  chrome.storage.local.set(
    {
      maxProgress:
        currentProgress > maxProgress ? currentProgress : maxProgress,
      currentProgress,
    },
    sendClueFoundMessage
  );
};

const sendClueNotFound = () => {
  chrome.runtime.sendMessage({
    status: "Not Found",
  });
};

const sendEmptyOrInvalidHunt = () => {
  chrome.runtime.sendMessage({
    status: "Invalid",
  });
};

/* Handle storage and page */

const loadHuntCallback = (items: any) => {
  console.log(items);
  if (items.huntConfig && items.maxProgress !== undefined) {
    const urlMatchClue = checkHuntForURLMatch(items.huntConfig as HuntConfig);
    if (urlMatchClue) {
      sendClueFound(items.maxProgress, urlMatchClue);
    } else {
      sendClueNotFound();
    }
  } else {
    sendEmptyOrInvalidHunt();
  }
};

const loadHuntProgress = () => {
  chrome.storage.local.get(["huntConfig", "maxProgress"], function (items) {
    loadHuntCallback(items);
  });
};

loadHuntProgress();
