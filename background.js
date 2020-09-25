window.clue = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request != null) {
    window.clue = request;
    chrome.browserAction.setBadgeText({text: "1"});
  } else {
    window.clue = {};
  }
})

chrome.browserAction.onClicked.addListener(function (tab) {
  var en = window.clue.encrypted;
  if (window.clue.error != undefined) {
    my_alert("There is a problem with the clues:\n" + window.clue.error);
  } else if (window.clue.url == undefined) {
    my_alert("Keep looking!");
  } else {
    chrome.browserAction.setBadgeText({text: ""});
    if (window.clue.html != undefined) {
      //note: preempts the clickable or submit behaviors
      //in content.js html is preempted by text
      chrome.tabs.create({url: decryptSoft(window.clue.html, en)});
    } else {
      if (window.clue.interact == "clickable") {
        if (bg.clue.visible) {
          chrome.tabs.create({url: 'popup.html'});
        } else {
          my_alert("Click the special text on the page!");
        }
      } else if (window.clue.interact == "submit", en) {
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

function setMessage (res) {
  const div = document.createElement('div');
  div.textContent = `${res.count} bears`;
  document.body.appendChild(div);
}

function decryptSoft(blah, encrypted) {
  if (encrypted) {
      level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
          level1 += blah.charAt(k);
      }
      return (atob(level1));
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