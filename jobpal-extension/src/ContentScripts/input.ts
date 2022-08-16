import {INPUT_MAP} from './mapping';
import {asyncGetPrefillData} from '../Lib/storageHandler';
import { PrefillData } from '../Lib/StorageType';

export function matchInputElements(data: {[field:string]:(string|number)}): [Map<string, FillData>, Map<string, string>] {
  const matched: Map<string, FillData> = new Map();
  const notMatched: Map<string, string> = new Map(Object.entries(data).map(([k, v])=>[k,v.toString()]));
  
  // iterate through all input elements to find the element that matches the string
  const inputElements = document.getElementsByTagName("input");
  for (let i = 0; i < inputElements.length; i++) {
    const inputElement = inputElements[i];
    console.log(inputElement.name);

    if (inputElement.name in data) {
      const field = inputElement.name;
      matched.set(field, {
        data: data[field].toString(),
        fillLocation: inputElement
      });

    } else {

      for (const [field, matchStr] of Object.entries(INPUT_MAP)) {
        if (field in notMatched && isInputElementMatch(inputElement, new RegExp(matchStr))) {
          const value = notMatched.get(field);
          if (value !== undefined) {
            matched.set(field, {
              data: value.toString(),
              fillLocation: inputElement
            });
          }
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

function isInputElementMatch(inputElem: HTMLInputElement, matchStr: RegExp) {
  if (matchStr.test(inputElem.name)) {
    return true;
  }
  // check the labels of the input element
  const labels = inputElem.labels;
  if (labels === null) {
    return false;
  }
  // iterate through the labels
  const labelList = labels.values();
  let it = labelList.next();
  while (!it.done) {
    const labelElem = it.value;
    if (matchStr.test(labelElem.innerText)) {
      return true;
    }
  }
  return false;
}

export interface FillData {
  data: string,
  fillLocation: HTMLInputElement
}
