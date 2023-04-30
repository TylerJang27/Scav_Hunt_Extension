// Chrome manifest v3 migrated from a background worker to service worker

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
      chrome.tabs.create({ url: Decrypt(foundClue.html, encrypted) });
      return;
    }
    
    // Open the clue page for the most recently found clue.
    chrome.tabs.create({ url: "popup.html"});
  } else {
    console.warn("Error. Empty or invalid hunt.");
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request) {
    if (request.status == "Found") {
      chrome.action.setBadgeText({ text: "1" });
      return;
    } else if (request.status == "Not Found") {
      chrome.action.setBadgeText({ text: "" });
      return;
    } else if (request.status == "Invalid") {
      chrome.action.setBadgeText({ text: "X" });
      return;
    }
  }
  console.log("Invalid request", request);
});

chrome.action.onClicked.addListener(function (tab) {
  chrome.action.setBadgeText({ text: "" });

  chrome.storage.local.get(
    ["huntConfig",
    "currentProgress"],
    function (items) {
      openClueCallback(items);
    });
});
