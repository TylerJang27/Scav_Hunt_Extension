window.clue = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request != null) {
    window.clue = request;
  } else {
    window.clue = {};
  }
})

chrome.browserAction.onClicked.addListener(function (tab) {
  var en = window.clue.encrypted;
  if (window.clue.error != undefined) {
    alert("There is a problem with the clues:\n" + window.clue.error);
  } else if (window.clue.url == undefined) {
    alert("Keep looking!");
    //TODO: CHANGE ALERT APPEARANCE, https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box
  } else {
    if (window.clue.html != undefined) {
      //note: preempts the clickable or submit behaviors
      //in content.js html is preempted by text
      chrome.tabs.create({url: decryptSoft(window.clue.html, en)});
    } else {
      if (window.clue.interact == encryptSoft("clickable", en)) {
        if (bg.clue.visible) {
          chrome.tabs.create({url: 'popup.html'});
        } else {
          alert("Click the special text on the page!");
        }
      } else if (window.clue.interact == encryptSoft("submit", en)) {
        chrome.tabs.create({url: 'popup.html'});
      } else {
        chrome.tabs.create({url: 'popup.html'});
      }
    }
  }
})

function decryptSoft(blah, encrypted) {
  if (encrypted) {
      level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
          level1 += blah.charAt(k);
      }
      return (atob(levelc));
  }
  return blah;
}

function encryptSoft(text, encrypted) {
  if (encrypted) {
      var level1 = btoa(text);
      var level2 = level1.split("");
      var level3 = "";
      for (var k = 0; k < level2.length-1; k++) {
          level3 += level1.charAt(k) + Math.random().toString(36).charAt(2);
      }
      return (level3 + level2[level2.length - 1]);
  }
  return text;
}