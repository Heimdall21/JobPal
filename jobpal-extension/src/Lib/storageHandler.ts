import { Dispatch, SetStateAction } from "react";
import {PrefillData} from "./StorageType"

const profileQueryKey = 'profile';

export const getPrefillData = (getCallback: (data: PrefillData)=>void) => {
    return chrome.storage.sync.get(profileQueryKey, pair=>{
        getCallback(pair[profileQueryKey]);
    });
}

export const asyncGetPrefillData = () => {
    return new Promise((resolve: (data: PrefillData)=>void) =>
        getPrefillData(resolve));
}

export const storePrefillData = (data: PrefillData, setCallback=()=>{}) => {
    return chrome.storage.sync.set({[profileQueryKey]: data}, setCallback);
}

export const onUpdatePrefillData = (callback: ((data:PrefillData)=>void))=>{
    return (
        changes:{ [key: string]: chrome.storage.StorageChange }, 
        areaName: string
    ) => {
        if (areaName === 'sync' && profileQueryKey in changes) {
            const {newValue} = changes[profileQueryKey];
            callback(newValue!);
        }
    };
}

export function initStorageData(setData: Dispatch<SetStateAction<PrefillData|null>>) {
    getPrefillData((newData)=> {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      } else if (newData === undefined) {
          setData({
            common: {additional: {}},
            specific: {}
          });
          return;
      }
      setData(newData)
    })
  }