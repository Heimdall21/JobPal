import { useEffect, useState } from "react"

export const useChromeLocalStorage = (key: string, initVal: any, {initGetCallback=()=>{}, setValCallback=()=>{}} = {}) => {
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
                // console.log(`update ${key}: ${JSON.stringify(newValue)}`);
            }

        });
    }, [key, setValCallback]);

    const storeVal = () => {
        chrome.storage.sync.set({[key]: tempVal});
    }

    return [tempVal, setTempVal, actualVal, storeVal];
}

export const setAsyncChromeLocal = (key: string, val: any) => {
    return chrome.storage.sync.set({[key]: val})
}

export const getAsyncChromeLocal = (key: string) => {
    return chrome.storage.sync.get(key)
}
