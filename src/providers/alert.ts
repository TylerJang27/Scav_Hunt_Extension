export const alertWrapper = (msg: any) => {
  //TODO: CHANGE alertWrapper APPEARANCE, https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box

  // getProvider().tabs.query({currentWindow: true, active: true}, function (tabs) {
  //   getProvider().tabs.sendMessage(tabs[0].id, msg, setMessage);
  // })
  // Potentially also chrome.notifications
  alert(msg);
};
