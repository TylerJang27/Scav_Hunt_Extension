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
    if (window.clue.html != undefined) {
      //note: preempts the clickable or submit behaviors
      chrome.tabs.create({url: window.clue.html});
    } else {
      if (window.clue.interact == "clickable") {
        if (bg.clue.visible) {
          chrome.tabs.create({url: 'popup.html'});
        } else {
          alert("Click the special text on the page!");
        }
      } else if (window.clue.interact == "submit") {
        chrome.tabs.create({url: 'popup.html'});
      } else {
        chrome.tabs.create({url: 'popup.html'});
      }
    }
  }
})