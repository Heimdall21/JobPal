import { ListenerResponse } from "../../public/background";
import { fillOne } from "../Lib/FillForm";
import { getLabelInputPairs } from "./input";

let labelInputPairs: {
    label: HTMLLabelElement,
    input: HTMLInputElement|HTMLSelectElement,
}[]= [];

let version: number = -1;

chrome.runtime.sendMessage<ReadyMessage>({type: 'Ready'});

chrome.runtime.onMessage.addListener((message: ListenerResponse)=> {
    if (message.type === "StartListener") {
        if (version === -1) {
            version += 1;
            labelInputPairs = getLabelInputPairs(document);
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