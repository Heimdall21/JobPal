import {PrefillData} from "./StorageType"

const profileQueryKey = 'profile';

export const getPrefillData = (getCallback: (data: PrefillData)=>void) => {
    return chrome.storage.sync.get(profileQueryKey, pair=>{
        getCallback(pair[profileQueryKey]);
    });
}

export const storePrefillData = (data: PrefillData, setCallback=()=>{}) => {
    return chrome.storage.sync.set({[profileQueryKey]: data}, setCallback);
}
