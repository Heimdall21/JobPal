chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    files: ['listener.bundle.js']
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.bundle.js']
  });
});