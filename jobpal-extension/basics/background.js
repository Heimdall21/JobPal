console.log('background running');

chrome.runtime.onInstalled.addListener(() => {
  console.log('running running');
})
chrome.action.onClicked.addListener(buttonClicked);

function buttonClicked() {
  console.log("button clicked!");
}