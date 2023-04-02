(window as any).clue = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request != null) {
    (window as any).clue = request;
    if ((window as any).url != undefined) {
      chrome.action.setBadgeText({ text: "1" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  } else {
    (window as any).clue = {};
  }
});

// TODO: TYLER REPLACE WITH ACTION
chrome.action.onClicked.addListener(function (tab) {
  chrome.action.setBadgeText({ text: "" });
  var clue = (window as any).clue;
  var en = clue.encrypted;
  if (clue.error != undefined) {
    my_alert("There is a problem with the clues:\n" + clue.error);
  } else if (clue.url == undefined) {
    my_alert("Keep looking!");
  } else {
    if (clue.html != undefined) {
      //note: preempts the clickable or submit behaviors
      //in content.js html is preempted by text
      chrome.tabs.create({ url: clue.html });
    } else {
      if (clue.interact == "clickable") {
        // TODO: REPLACE GETBACKGROUNDPAGE WITH SENDMESSAGE
        // https://developer.chrome.com/docs/extensions/migrating/api-calls/#replace-browser-page-actions
        const bg = chrome.extension.getBackgroundPage() as any;
        if (bg.clue.visible) {
          chrome.tabs.create({ url: "popup.html" });
        } else {
          my_alert("Click the special text on the page!");
        }
      } else if (clue.interact == "submit") {
        chrome.tabs.create({ url: "popup.html" });
      } else {
        chrome.tabs.create({ url: "popup.html" });
      }
    }
  }
});

function my_alert(msg: any) {
  //TODO: CHANGE my_alert APPEARANCE, https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box

  // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, msg, setMessage);
  // })
  alert(msg);
}
