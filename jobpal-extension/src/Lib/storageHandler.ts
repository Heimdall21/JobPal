import { useEffect, useState } from "react"

export const useChromeLocalStorage = (key: string, initVal: any) => {
    const [tempVal, setTempVal] = useState(initVal);

    const [actualVal, setActualVal] = useState(initVal);

    useEffect(() => {
        chrome.storage.local.get(key, val => {
            let newVal = val[key]
            if (newVal === undefined) {
                return;
            }
            setActualVal(newVal);
            setTempVal(newVal);
        });
    }, [key]);

    useEffect(()=>{
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local' && key in changes) {
                const {newValue} = changes[key];
                setActualVal(newValue);
                console.log(`update ${key}: ${JSON.stringify(newValue)}`);
            }

        });
    }, [key]);

    const storeVal = () => {
        chrome.storage.local.set({[key]: tempVal});
    }

    return [tempVal, setTempVal, actualVal, storeVal];
}

export const setAsyncChromeLocal = (key: string, val: any) => {
    return chrome.storage.local.set({[key]: val})
}

export const getAsyncChromeLocal = (key: string) => {
    return chrome.storage.local.get(key)
}
