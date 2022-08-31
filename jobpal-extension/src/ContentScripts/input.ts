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
export function matchInputElements(data: Map<string, string>, formFields: [string, HTMLInputElement|HTMLSelectElement][]): [Map<string, FillData>, Map<string, string>] {
  const matched: Map<string, FillData> = new Map();
  const notMatched: Map<string, string> = new Map(data); // copy constructor

  const addMatched = (key:string, label:string, value:string, location:HTMLInputElement|HTMLSelectElement)=>{
    matched.set(label, {
      data: value,
      fillLocation: location
    });
    notMatched.delete(key);
  }
  
  // iterate through all input elements to find the element that matches the string
  for (const [label, inputElement] of formFields) {
    console.log(label, inputElement);

    const field = getMatchedField(data, label, inputElement);
    if (field) {
      addMatched(field, label, data.get(field), inputElement);

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

          if (inputElement instanceof HTMLInputElement) {
            // normal input element
            addMatched(field, label, value, inputElement);

          } else {

            // handle Select element specially as the value may not be in the options
            let found = false;
            for (let i=0; i < inputElement.options.length; i++) {
              if (inputElement.options[i].value === value) {
                found = true;
                break;
              }
            }

            if (found) {
              addMatched(field, label, value, inputElement);
            } else {
              // we may be able to resolve the issue if the field is sex
              if (field === 'sex') {
                const optionValue = tryMatchSexOption(value as 'M'|'F'|'X', inputElement);
                if (optionValue !== null) {
                  addMatched(field, label, optionValue, inputElement);
                }
              }
              notMatched.delete(field);
            }
          }

          break; // we have found the field, break the loop
        }
      }

    }
  }

  console.log(matched, notMatched);
  return [matched, notMatched];
}

// transform the data from local storage to the data to a map
export function transformPrefillData(prefillData: PrefillData, url: Location): Map<string, string> {
  const {additional: commonAdditional, ...common} = prefillData.common; 
  const host = url.host;
  let ret = null;

  if (prefillData.specific[host] !== undefined) {
    // TODO: NOTE: remove spcific additional?
    const {additional: specificAdditional} = prefillData.specific[host];
    ret = {
      ...common,
      ...commonAdditional,
      ...specificAdditional
    };
  }

  ret = {
    ...common,
    ...commonAdditional
  };
  return new Map(Object.entries(ret).map(([k, v])=>[k,v.toString()]))
}

function getMatchedField(data: Map<string, string>, label: string, inputElement: HTMLInputElement|HTMLSelectElement) {
  if (label in data) {
    return label;
  }

  if (inputElement.name in data) {
    return inputElement.name;
  }

  if (inputElement.innerText in data) {
    return inputElement.innerText;
  }

  return null;
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

function tryMatchSexOption(value: 'M'|'F'|'X', inputElement: HTMLSelectElement): string|null {
  const sexRegex = {
    'M': [/^\s*m\s*$/i, /^\s*male\s*$/i],
    'F': [/^\s*f\s*$/i, /^\s*female\s*$/i],
    'X': [/^\s*other\s*/i, /\s*decline\s*to\s*self\s*identify/i]
  }
  const matchStrs = sexRegex[value];
  for (let i = 0; i < inputElement.options.length; i++) {
    if (matchStrs.some((val)=>val.test(inputElement.options[i].innerText))) {
      return inputElement.options[i].value;
    }
  }
  return null;
}


// get all the lables and its corresponding input/select element if there a
// return an array of pairs of label and input elements
export function getLabelInputPair(): [string, HTMLInputElement|HTMLSelectElement][] {
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
