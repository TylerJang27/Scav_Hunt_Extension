window.clue = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request != null) {
    window.clue = request;
  } else {
    window.clue = {};
  }
})

chrome.browserAction.onClicked.addListener(function (tab) {
  if (window.clue.error != undefined) {
    alert("There is a problem with the clues:\n" + window.clue.error);
  } else if (window.clue.url == undefined) {
    alert("Keep looking!");
    //TODO: CHANGE ALERT APPEARANCE, https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box
  } else {
    chrome.tabs.create({url: 'popup.html'});
  }
})