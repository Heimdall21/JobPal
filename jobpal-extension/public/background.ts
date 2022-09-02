chrome.action.onClicked.addListener((tab) => {
  const targetTabId = tab.id;
  if (targetTabId !== undefined) {
    chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      files: ['content.bundle.js']
    });
    chrome.runtime.onMessage.addListener((message, sender)=>{
      if (message.type === 'Start') {
        chrome.tabs.sendMessage(targetTabId, {
          type: 'StartListener'
        });
      } else if (message.type === 'LabelInputMessage') {
        chrome.tabs.sendMessage(targetTabId, {
          type: 'LabelInputResponse',
          data: message.value,
          frame: sender.frameId,
        }, {frameId: 0});
      } else if (message.type === 'fillAll') {
        // TODO: send fill messages to all listenerss
      }
    });
  }
});
