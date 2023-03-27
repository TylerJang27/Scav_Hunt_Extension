window.clue = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request != null) {
    window.clue = request;
    if (window.clue.url != undefined) {
      chrome.browserAction.setBadgeText({text: "1"});
    } else {
      chrome.browserAction.setBadgeText({text: ""});
    }
  } else {
    window.clue = {};
  }
})

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.browserAction.setBadgeText({text: ""});
  var en = window.clue.encrypted;
  if (window.clue.error != undefined) {
    my_alert("There is a problem with the clues:\n" + window.clue.error);
  } else if (window.clue.url == undefined) {
    my_alert("Keep looking!");
  } else {
    if (window.clue.html != undefined) {
      //note: preempts the clickable or submit behaviors
      //in content.js html is preempted by text
      chrome.tabs.create({url: window.clue.html});
    } else {
      if (window.clue.interact == "clickable") {
        if (bg.clue.visible) {
          chrome.tabs.create({url: 'popup.html'});
        } else {
          my_alert("Click the special text on the page!");
        }
      } else if (window.clue.interact == "submit") {
        chrome.tabs.create({url: 'popup.html'});
      } else {
        chrome.tabs.create({url: 'popup.html'});
      }
    }
  }
})

function my_alert(msg) {
  //TODO: CHANGE my_alert APPEARANCE, https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box

  // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, msg, setMessage);
  // })
  alert(msg);
}
