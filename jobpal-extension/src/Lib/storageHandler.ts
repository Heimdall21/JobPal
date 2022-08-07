import { useEffect, useState } from "react"

export const useChromeStorage = (key: string, initVal: any, {initGetCallback=()=>{}, setValCallback=()=>{}} = {}) => {
    const [tempVal, setTempVal] = useState(initVal);

    const [actualVal, setActualVal] = useState(initVal);

    useEffect(() => {
        chrome.storage.sync.get(key, val => {
            let newVal = val[key]
            if (newVal === undefined) {
                return;
            }
            initGetCallback();
            setActualVal(newVal);
            setTempVal(newVal);
        });
    }, [initGetCallback, key]);

    useEffect(()=>{
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync' && key in changes) {
                const {newValue} = changes[key];
                setActualVal(newValue);
                setValCallback();
            }

        });
    }, [key, setValCallback]);

    const storeVal = () => {
        chrome.storage.sync.set({[key]: tempVal});
    }

    return [tempVal, setTempVal, actualVal, storeVal];
}

export const setAsyncChromeStroage = (key: string, val: any) => {
    return chrome.storage.sync.set({[key]: val})
}

export const getAsyncChromeStroage = (key: string) => {
    return chrome.storage.sync.get(key)
}
