chrome.action.onClicked.addListener((tab) => {
  const targetTabId = tab.id;
  if (targetTabId !== undefined) {
    chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      files: ['content.bundle.js']
    });
    chrome.runtime.onMessage.addListener((message)=>{
      chrome.tabs.sendMessage(targetTabId, message);
    });
    chrome.tabs.sendMessage(targetTabId, {
      type: "start"
    });
  }
});
