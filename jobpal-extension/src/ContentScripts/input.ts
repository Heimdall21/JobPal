import {INPUT_MAP} from './mapping';
import {asyncGetPrefillData} from '../Lib/storageHandler';
import { PrefillData } from '../Lib/StorageType';

export function matchInputElements(data: {[field:string]:(string|number)}) {
  const inputElements = document.getElementsByTagName("input");
  const matched: Map<string, string> = new Map();
  const notMatched: Map<string, string> = new Map(Object.entries(data).map(([k, v])=>[k,v.toString()]));

  for (let i = 0; i < inputElements.length; i++) {
    const inputElement = inputElements[i];
    console.log(inputElement.name);

    if (inputElement.name in data) {
      const field = inputElement.name;
      matched.set(field, data[field].toString());

    } else {

      for (const [field, matchStr] of Object.entries(notMatched)) {
        if (field in data && new RegExp(matchStr).test(inputElement.name)) {
          matched.set(field, data[field].toString());
          notMatched.delete(field);// remove the field from notMatched
          break; // we have found the field, break the loop
        }
      }

    }
  }
  console.log(matched, notMatched);
  return [matched, notMatched];
}

export function transformPrefillData(prefillData: PrefillData, url: Location): {[field:string]:(string|number)} {
  const {additional: commonAdditional, ...common} = prefillData.common; 
  const host = url.host;

  if (prefillData.specific[host] !== undefined) {
    const {additional: specificAdditional} = prefillData.specific[host];
    return {
      ...common,
      ...commonAdditional,
      ...specificAdditional
    };
  }

  return {
    ...common,
    ...commonAdditional
  };
}

export async function getMatchedData() {
  const prefillData = await asyncGetPrefillData();
  const data = transformPrefillData(prefillData, window.location);
  return matchInputElements(data);
}