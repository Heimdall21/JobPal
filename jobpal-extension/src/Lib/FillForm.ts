import { FillData } from "../ContentScripts/input";

function fillOne({data, fillLocation}:FillData) {
    console.log(fillLocation);
    fillLocation.focus();
    fillLocation.value = data;
    fillLocation.dispatchEvent(new Event('change'));
    fillLocation.blur();
}

function fillAll(matched:Map<string, FillData>) {
    matched.forEach((fillData)=>fillOne(fillData));
}

function fillSelected(selected:FillData[]) {
    selected.forEach((fillData)=>fillOne(fillData));
}

// return a promise for error handling/ log when the operation succeeds
function copyTextToClipBoard(text:string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

export {
    fillOne,
    fillAll,
    fillSelected,
    copyTextToClipBoard
};
