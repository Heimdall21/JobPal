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

export const onUpdatePrefillData = (callback: ((data:PrefillData)=>void))=>{
    return ()=>{
        const onUpdate = (
            changes:{ [key: string]: chrome.storage.StorageChange }, 
            areaName: string
        ) => {
            if (areaName === 'sync' && profileQueryKey in changes) {
                const {newValue} = changes[profileQueryKey];
                callback(newValue!);
            }
        };
        chrome.storage.onChanged.addListener(onUpdate);
        return ()=>chrome.storage.onChanged.removeListener(onUpdate);
    }
    // usecase: useEffect(onUpdatePrefillData, []);
}
