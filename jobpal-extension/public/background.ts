import { LabelInputMessage, LabelInputRequest } from "../src/ContentScripts/listener";
import { FillAllRequest, StartRequest } from "./content";

chrome.action.onClicked.addListener((tab) => {
  const targetTabId = tab.id;
  if (targetTabId !== undefined) {
    chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      files: ['content.bundle.js']
    });
    chrome.runtime.onMessage.addListener((message: MainRequest, sender)=>{
      if (message.type === 'Start') {
        chrome.tabs.sendMessage<StartListenerMessage>(targetTabId, {
          type: 'StartListener'
        });
      } else if (message.type === 'LabelInputMessage') {
        const frameId = sender.frameId;
        if (frameId === undefined) {
          console.error('frameId is undefined!');
        } else {
          chrome.tabs.sendMessage<LabelInputResponse>(targetTabId, {
            type: 'LabelInputResponse',
            data: message.value,
            frame: frameId,
          }, {frameId: 0});
        }
      } else if (message.type === 'FillAll') {
        // send fill messages to all listeners
        message.value.forEach((val, frameId)=>{
          chrome.tabs.sendMessage<FillListenerMessage>(targetTabId, {
            type: 'FillListener',
            value: val
          }, {frameId: frameId});
        });
      }
    });
  }
});

type MainRequest = StartRequest | LabelInputRequest | FillAllRequest;

interface ListenerResponseTypeTag {
  StartListener: 'StartListener',
  FilListener: 'FillListener'
}

interface StartListenerMessage {
  type: ListenerResponseTypeTag['StartListener']
}

interface FillListenerMessage {
  type: ListenerResponseTypeTag['FilListener'],
  value: { index: number, data: any }[]
}

interface MainResponseTypeTag {
  LabelInputResponse: 'LabelInputResponse'
}

interface LabelInputResponse {
  data: LabelInputMessage[],
  frame: number,
  type: MainResponseTypeTag['LabelInputResponse']
}

export type ListenerResponse = StartListenerMessage | FillListenerMessage;

export type MainResponse = LabelInputResponse;
