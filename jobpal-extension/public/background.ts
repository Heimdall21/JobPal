import { LabelInputMessage, LabelInputRequest, ReadyMessage } from "../src/ContentScripts/listener";
import { FillAllRequest, StartRequest, VersionNum } from "../src/ContentScripts/input";

chrome.runtime.onMessage.addListener((message: MainRequest, sender)=>{
  const tab = sender.tab;
  if (tab === undefined) {
    console.error("tab is undefined");
    return;
  }
  const tabId = tab.id;
  if (tabId === undefined) {
    console.error("tabId is undefined");
    return;
  }

  if (message.type === 'Start') {
    chrome.tabs.sendMessage<StartListenerMessage>(tabId, {
      type: 'StartListener'
    });
  } else if (message.type === 'LabelInputMessage') {
    const frameId = sender.frameId;
    if (frameId === undefined) {
      console.error('frameId is undefined!');
    } else {
      chrome.tabs.sendMessage<LabelInputResponse>(tabId, {
        type: 'LabelInputResponse',
        data: message.value,
        frame: frameId,
        version: message.version
      }, {frameId: 0});
    }
  } else if (message.type === 'FillAll') {
    // send fill messages to all listeners
    message.value.forEach(([frameId, version, val])=>{
      chrome.tabs.sendMessage<FillListenerMessage>(tabId, {
        type: 'FillListener',
        value: val,
        version: version
      }, {frameId: frameId});
    });
  } else if (message.type === 'Ready') {
    hasStartedTabId(tabId)
    .then((hasStarted)=>{
      if (hasStarted) {
        chrome.tabs.sendMessage<StartListenerMessage>(tabId, {
          type: 'StartListener'
        }, {frameId: sender.frameId})
      }
    })
  } else if (message.type === 'Close') {
    removeStartedTabId(tabId);
  }
});

chrome.action.onClicked.addListener((tab) => {
  const targetTabId = tab.id;
  if (targetTabId !== undefined) {
    getStartedTabIds()
    .then(startedTabs=>{
      if (!startedTabs.includes(targetTabId)) {
        startedTabs.push(targetTabId);
        setStartedTabIds(startedTabs)
        .then(()=>injectContentJS(targetTabId))
        .catch(error=>console.error("onClicked: setStartedTabIds: ", error));
      }
    })
    .catch(error=>console.error("onClicked: getStartedTabIds: ", error));
  }
});

chrome.tabs.onRemoved.addListener((tabId)=>{
  removeStartedTabId(tabId)
  .catch(error=>console.error("onRemoved: ", error));
});

chrome.tabs.onReplaced.addListener((addedTabId, removedTabId)=>{
  removeStartedTabId(removedTabId)
  .then(()=>
  // add the new tab id after removing the old one
  addStartedTabIdIfAbsent(addedTabId)
    .then(()=>
      injectContentJS(addedTabId)) // inject script after adding the new tab id
    .catch(error=>console.error("onReplaced: add: ", error))
  .catch(error=>console.error("onReplaced: remove: ", error)));
});

chrome.tabs.onUpdated.addListener((tabId: number)=>{
  hasStartedTabId(tabId)
  .then((hasStarted)=>{
    if (hasStarted) {
      injectContentJS(tabId);
    }
  });
});

function injectContentJS(tabId: number) {
  return chrome.scripting.executeScript({
    target: {tabId: tabId },
    files: ['content.bundle.js']
  }).catch(error=>{
    console.error("failed to inject script: ", error);
    removeStartedTabId(tabId);
  });
}

function setStartedTabIds(tabIds: TabId[]): Promise<TabId[]> {
  return new Promise((resolve, reject)=>
  chrome.storage.session.set({startedTabIds: tabIds}, ()=>{
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError.message);
    } else {
      resolve(tabIds);
    }
  }));
}

function getStartedTabIds(): Promise<TabId[]> {
  return new Promise((resolve, reject)=>
  chrome.storage.session.get("startedTabIds", (items)=>{
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError.message);
    } else {
      const startedTabIds = items.startedTabIds;
      if (startedTabIds === undefined) {
        resolve([]);
      } else {
        resolve(startedTabIds);
      }
    }
  }));
}

async function hasStartedTabId(tabId: TabId) {
  const tabIds = await getStartedTabIds();
  if (tabIds.includes(tabId)) {
    return true;
  }
  return false;
}

async function addStartedTabIdIfAbsent(tabId: TabId) {
  const tabIds = await getStartedTabIds();
  if (!(tabIds.includes(tabId))) {
    tabIds.push(tabId);
    return setStartedTabIds(tabIds);
  } else {
    return;
  }
}

async function removeStartedTabId(tabId: TabId) {
  const tabIds = await getStartedTabIds();
  return await setStartedTabIds(tabIds.filter((val) => val === tabId));
}

type TabId = number;

export interface CloseRequest {
  type: 'Close'
}

type MainRequest = StartRequest | LabelInputRequest | FillAllRequest | ReadyMessage | CloseRequest;


interface StartListenerMessage {
  type: 'StartListener'
}

interface FillListenerMessage {
  type: 'FillListener',
  value: { index: number, data: any }[],
  version: VersionNum
}

interface MainResponseTypeTag {
  LabelInputResponse: 'LabelInputResponse'
}

interface LabelInputResponse {
  data: LabelInputMessage[],
  frame: number,
  type: MainResponseTypeTag['LabelInputResponse'],
  version: VersionNum
}

export type ListenerResponse = StartListenerMessage | FillListenerMessage;

export type MainResponse = LabelInputResponse;
