import { FillData } from "../ContentScripts/input";

function fillOne({data, fillLocation}:FillData) {
    fillLocation.value = data;
}

function fillAll(matched:Map<string, FillData>) {
    matched.forEach((fillData)=>fillOne(fillData));
}

function fillSelected(selected:FillData[]) {
    selected.forEach((fillData)=>fillOne(fillData));
}

function copyTextToClipBoard(text:string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

export {
    fillOne,
    fillAll,
    fillSelected,
    copyTextToClipBoard
};
