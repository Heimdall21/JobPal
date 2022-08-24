import {INPUT_MAP} from './mapping';
import {asyncGetPrefillData} from '../Lib/storageHandler';
import { PrefillData } from '../Lib/StorageType';

// the "main" function to get all the matched data by getting the elements in the page
export async function getMatchedData() {
  const prefillData = await asyncGetPrefillData();
  const data = transformPrefillData(prefillData, window.location); // NOTE: may not need if we do not have specific url
  const formFields = getLabelInputPair();
  return matchInputElements(data, formFields);
}

// try to match the elements in the page to the data in the storage
// data: data form the storage
// formFields: an array of pairs of label and inputelements
// return an array of matched and notmatchedmap
export function matchInputElements(data: {[field:string]:(string|number)}, formFields: [string, HTMLInputElement|HTMLSelectElement][]): [Map<string, FillData>, Map<string, string>] {
  const matched: Map<string, FillData> = new Map();
  const notMatched: Map<string, string> = new Map(Object.entries(data).map(([k, v])=>[k,v.toString()])); // transform data from local storage to a map
  
  // iterate through all input elements to find the element that matches the string
  for (const [label, inputElement] of formFields) {
    console.log(label, inputElement);

    if (inputElement.name in data) {
      const field = inputElement.name;
      matched.set(field, {
        data: data[field].toString(),
        fillLocation: inputElement
      });

    } else {
      // loop through the INPUT_MAP to find if the input element can be filled 
      // by the data from the local storage
      for (const [field, matchStrs] of Object.entries(INPUT_MAP)) {
        let value = notMatched.get(field);

        if (field === 'fullname') {
          // handle the fullname field speically
          const last_name = notMatched.get('familyName');
          const first_name = notMatched.get('givenName');
          if (last_name && first_name) {
            value = first_name + last_name;
          }
        }

        if (value !== undefined && isInputElementMatch(inputElement, label, matchStrs)) {
          matched.set(field, {
            data: value,
            fillLocation: inputElement
          });
          notMatched.delete(field);// remove the field from notMatched
          break; // we have found the field, break the loop
        }
      }

    }
  }

  console.log(matched, notMatched);
  return [matched, notMatched];
}

// transform the data from local storage to the data to a map
export function transformPrefillData(prefillData: PrefillData, url: Location): {[field:string]:(string|number)} {
  const {additional: commonAdditional, ...common} = prefillData.common; 
  const host = url.host;

  if (prefillData.specific[host] !== undefined) {
    // TODO: NOTE: remove spcific additional?
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


// check if the input/select element matches the regex strings
function isInputElementMatch(inputElem: HTMLInputElement|HTMLSelectElement, label: string, matchStrs: {label: RegExp[], input: RegExp[]}) {
  // check if the name of the input element
  for (const matchStr of matchStrs.input) {
    if (matchStr.test(inputElem.name)) {
      return true;
    }
  }

  // check the labels of the input element
  for (const matchStr of matchStrs.label) {
    if (matchStr.test(label)) {
      return true;
    }
  }
  return false;
}


// get all the lables and its corresponding input/select element if there a
// return an array of pairs of label and input elements
function getLabelInputPair(): [string, HTMLInputElement|HTMLSelectElement][] {
  let inputDescriptionElements = document.getElementsByTagName("label");
  let inputs: [string, HTMLInputElement|HTMLSelectElement][] = [];

  for (let desInd = 0; desInd < inputDescriptionElements.length; desInd++) {
      let inputElement: HTMLInputElement | HTMLSelectElement | null = null;

      const potentialInputElement: (HTMLElement | null | undefined) = document.getElementById(inputDescriptionElements[desInd].htmlFor) || document.getElementsByName(inputDescriptionElements[desInd].htmlFor)[0];
      if (potentialInputElement instanceof HTMLInputElement || potentialInputElement instanceof HTMLSelectElement ) {
        inputElement = potentialInputElement;
      }

      if (!inputElement) {
        const temp = inputDescriptionElements[desInd].querySelector("select, input:not([type='hidden'])") as (HTMLInputElement | HTMLSelectElement | null);
        if (temp !== null) {
          inputElement = temp;
        }
      }

      if (inputElement) {
        inputs.push([inputDescriptionElements[desInd].innerText, inputElement])
      }
  }
  return inputs;
}

export interface FillData {
  data: string,
  fillLocation: HTMLInputElement|HTMLSelectElement
}

getMatchedData();
