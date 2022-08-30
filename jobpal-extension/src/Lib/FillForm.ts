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

export {
    fillOne,
    fillAll,
    fillSelected
};
