window.clue = {}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  window.clue[request.url] = request.count

  //TODO 2: SAVE THE REQUEST INFORMATION TO WINDOW.CLUE.___
  //ALSO TAKE CARE IF IT'S EMPTY, INSTEAD FILL THE CONTENT WITH "KEEP LOOKING!" OR SOMETHING SIMILAR



})

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({url: 'popup.html'})
})