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
            console.log(`initial get ${key}: ${JSON.stringify(newVal)}`);
        });
    }, [key]);

    useEffect(()=>{
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local' && key in changes) {
                const {newValue} = changes[key];
                setActualVal(newValue);
                console.log(`update ${key}: ${JSON.stringify(newValue)}`);
            }
            //  else {
            //     console.log(`area: ${areaName}, changes: ${JSON.stringify(changes)}`);
            // }
        });
    }, [key]);

    const storeVal = () => {
        chrome.storage.local.set({[key]: tempVal}, ()=>console.log(`stored ${key}: ${JSON.stringify(tempVal)}`));
    }

    return [tempVal, setTempVal, actualVal, storeVal];
}
