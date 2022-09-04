import { ListenerResponse } from "../../public/background";
import { fillOne } from "../Lib/FillForm";
import { getLabelInputPairs } from "./input";

let labelInputPairs: {
    label: HTMLLabelElement,
    input: HTMLInputElement|HTMLSelectElement,
}[]= [];

let version: number = -1;

let observer: MutationObserver|null = null;

let timer: ReturnType<typeof setTimeout> | null = null;

chrome.runtime.onMessage.addListener((message: ListenerResponse)=> {
    if (message.type === "StartListener") {
        if (version === -1) {
            version += 1;
            labelInputPairs = getLabelInputPairs(document);
            observer = new MutationObserver(onObserveMutation);
            const contanier = document.documentElement || document.body;
            observer.observe(contanier, {
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: true
            });
        }
        chrome.runtime.sendMessage<LabelInputRequest>({
            type: "LabelInputMessage",
            value: toLabelInputMessages(labelInputPairs),
            version
        });
    } else if (message.type === "FillListener") {
        if (version === -1) return;
        if (version !== message.version) return;
        for (const {index, data} of message.value) {
            fillOne({data: data, fillLocation: labelInputPairs[index].input});
        }
    }
});

// send ready to the background script
chrome.runtime.sendMessage<ReadyMessage>({type: 'Ready'});

function toLabelInputMessages(inputArr: {
    label: HTMLLabelElement,
    input: HTMLInputElement|HTMLSelectElement,
}[]): LabelInputMessage[] {
    return inputArr.map(({label, input})=>{
        if (input instanceof HTMLInputElement) {
            return {
                labelText: label.innerText,
                type: "input",
                inputName: input.name,
                inputId: input.id === ''? null: input.id,
                inputText: input.innerText,
            };
        } else {
            // iterate through all the options
            let optionsArr: Option[] = [];
            for (let i = 0; i < input.options.length; i++) {
                optionsArr.push({
                    text: input.options[i].innerText,
                    value: input.options[i].value,
                });
            }

            return {
                labelText: label.innerText,
                type: "select",
                inputId: input.id === ''?null:input.id,
                inputText: input.innerText,
                inputName: input.name,
                options: optionsArr
            };
        }
    });
}

function onObserveMutation(mutations: MutationRecord[], _observer: MutationObserver) {
    if (timer === null && requireUpdate(mutations)) {
        timer = setTimeout(()=>{
            updateLabelInputs();
            timer = null;
        }, 1);
    }
}

function requireUpdate(mutations: MutationRecord[]): boolean {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            if (
            containLabelOrInput(mutation.addedNodes) ||
            containLabelOrInput(mutation.removedNodes)
            ) return true;
        } else if (mutation.type === 'characterData') {
            if (mutation.target instanceof HTMLLabelElement) {
                return true;
            }
        }
    }
    return false;
}

function updateLabelInputs() {
    const prevLabelInputPairs = labelInputPairs;
    labelInputPairs = getLabelInputPairs(document);
    if (isLabelInputsUpdated(prevLabelInputPairs, labelInputPairs)) {
        version += 1;
        chrome.runtime.sendMessage<LabelInputRequest>({
            type: "LabelInputMessage",
            value: toLabelInputMessages(labelInputPairs),
            version
        });
    }
}

function isLabelInputsUpdated(old: typeof labelInputPairs, curr: typeof labelInputPairs): boolean {
    if (old.length !== curr.length) return true;
    for (let i = 0; i < old.length; i++) {
        if ((old[i].label !== curr[i].label) ||
        (old[i].input !== curr[i].input)) {
            return true
        }
    }
    return false;
}

function containLabelOrInput(nodes: NodeList): boolean {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (
        node instanceof HTMLLabelElement || 
        node instanceof HTMLInputElement ||
        node instanceof HTMLSelectElement) {
            return true;
        }
        if (containLabelOrInput(nodes[i].childNodes)) {
            return true;
        }
    }

    return false;
}

interface InputTypeTag {
    input: "input",
    select: "select"
};

interface InputType {
    labelText: string
    inputName: string,
    inputId: null|string,
    inputText: string,
}

interface SelectType extends InputType {
    options: Option[]
}

export interface Option {
    text: string,
    value: string
}

export type LabelInputMessage = InputType & {
    type: InputTypeTag["input"]
} | SelectType & {
    type: InputTypeTag["select"]
}

export interface LabelInputRequest {
    type: 'LabelInputMessage',
    value: LabelInputMessage[],
    version: number
}

export interface ReadyMessage {
    type: 'Ready'
}