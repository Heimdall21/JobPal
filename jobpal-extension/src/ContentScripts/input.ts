import {INPUT_MAP} from './mapping';
import { PrefillData } from '../Lib/StorageType';
import { LabelInputMessage, Option } from './listener';


// try to match the elements in the page to the data in the storage
// data: data form the storage
// formFields: data in labels and input/select elements
// return a map of matched data and a map of not matched data
export function matchInputElements(data: Map<string, string>, formFields: Fields): [MatchData, Map<string, string>] {
  const matched: MatchData = new Map();
  const notMatched: Map<string, string> = new Map(data); // copy constructor

  const addMatched = (key: string, value: string, frame: FrameId, version: VersionNum, labelInput: LabelInputMessage, index: IndexType)=>{
    const val = matched.get(frame);
    if (val === undefined) {
      matched.set(frame, [version, [{
        labelText: labelInput.labelText,
        data: value,
        index: index
      }]])
    } else {
      val[1].push({
        labelText: labelInput.labelText,
        data: value,
        index: index
      })
    }
    notMatched.delete(key);
  }
  
  // iterate through all input elements to find the element that matches the string
  formFields.forEach(([version, labelInputArr], frameId)=>{
    labelInputArr.forEach((labelInput, index) => {
      const field = getMatchedField(data, labelInput);
      if (field) {
        const val = data.get(field);
        if (val !== undefined) {
          addMatched(field, val, frameId, version, labelInput, index);
        }
      } else {

        // loop through the INPUT_MAP to find if the input element can be filled 
        // by the data from the local storage
        for (const [field, matchStrs] of Object.entries(INPUT_MAP)) {
          let value = data.get(field);
      
          if (value === undefined && field === 'fullname') {
            // handle the fullname field speically
            const last_name = data.get('familyName');
            const first_name = data.get('givenName');
            if (last_name && first_name) {
              value = first_name + " " + last_name;
            }
          }
          
          if (value !== undefined && isInputElementMatch(labelInput, matchStrs)) {
            if (labelInput.type === 'input') {
              // normal input element
              addMatched(field, value, frameId, version, labelInput, index);
            } else {

              // handle Select element specially as the value may not be in the options
              const found = labelInput.options.find(option => option.value === value || option.text === value);
              if (found !== undefined) {
                addMatched(field, value, frameId, version, labelInput, index);
              } else {
                // we may be able to resolve the issue if the field is sex
                if (field === 'sex') {
                  const optionValue = tryMatchSexOption(value as 'M'|'F'|'X', labelInput.options);
                  if (optionValue !== null) {
                    addMatched(field, optionValue, frameId, version, labelInput, index);
                  }
                }
              }

            }
            break; // we have found the field, break the loop
          }
        }

      }
    });
  });

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

function getMatchedField(data: Map<string, string>, labelInput: LabelInputMessage) {
  if (labelInput.labelText in data) {
    return labelInput.labelText;
  }

  if (labelInput.inputName in data) {
    return labelInput.inputName;
  }

  if (labelInput.inputText in data) {
    return labelInput.inputText;
  }

  if (labelInput.inputId !== null && labelInput.inputId in data) {
    return labelInput.inputId;
  }

  return null;
}

// check if the input/select element matches the regex strings
function isInputElementMatch(labelInput: LabelInputMessage, matchStrs: {label: RegExp[], input: RegExp[]}) {
  // check if the name of the input element
  for (const matchStr of matchStrs.input) {
    if (matchStr.test(labelInput.inputText) || 
    matchStr.test(labelInput.inputName)) {
      return true;
    }
  }

  // check the labels of the input element
  for (const matchStr of matchStrs.label) {
    if (matchStr.test(labelInput.labelText)) {
      return true;
    }
  }
  return false;
}

function tryMatchSexOption(value: 'M'|'F'|'X', options: Option[]): string|null {
  const sexRegex = {
    'M': [/^\s*m\s*$/i, /^\s*male\s*$/i],
    'F': [/^\s*f\s*$/i, /^\s*female\s*$/i],
    'X': [/^\s*other\s*/i, /\s*decline\s*to\s*self\s*identify/i]
  }
  const matchStrs = sexRegex[value];
  const matched = options.find(option=>matchStrs.some(val=>val.test(option.text)||val.test(option.value)));
  if (matched !== undefined) {
    return matched.value;
  }
  return null;
}


// get all the lables and its corresponding input/select element if there a
// return an array of pairs of label and input elements
export function getLabelInputPairs(doc: Document): {
  label: HTMLLabelElement,
  input: HTMLInputElement|HTMLSelectElement
}[] {
  let inputs: {
    label: HTMLLabelElement, 
    input: HTMLInputElement|HTMLSelectElement
  }[] = [];

  let inputDescriptionElements = doc.getElementsByTagName("label");
  for (let desInd = 0; desInd < inputDescriptionElements.length; desInd++) {
      let inputElement: HTMLInputElement | HTMLSelectElement | null = null;

      inputElement = 
        // get the element refered by the for attribute of the label element
        checkVisibleInput(doc.getElementById(inputDescriptionElements[desInd].htmlFor)) || 
        filterHidden(doc.getElementsByName(inputDescriptionElements[desInd].htmlFor)) ||
        // get a select or input element that is child of the label element
        filterHidden(inputDescriptionElements[desInd].querySelectorAll("select, input:not([type='hidden'])"));
      
      if (inputElement) {
        inputs.push({
          label: inputDescriptionElements[desInd], 
          input: inputElement
        })
      }
  }
  return inputs;
}

function filterHidden(elements: NodeListOf<HTMLElement>): HTMLInputElement | HTMLSelectElement | null {
  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i];
    if (isVisibleInput(elem)) {
      return elem;
    }
  }
  return null;
}

function isVisibleInput(element: Element|null): element is HTMLInputElement|HTMLSelectElement {
  if (element === null) return false;
  const computedStyle = window.getComputedStyle(element);
  return (
    // check the element is either an input or a select
    (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) &&
    // check display and visibility to ensure it is a visible element
    computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' &&
    !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length ) &&
    element.offsetParent !== null
  );
}

function checkVisibleInput(element: Element|null): HTMLInputElement | HTMLSelectElement | null {
  if (isVisibleInput(element)) {
    return element;
  } else {
    return null;
  }
}

export interface FillData {
  data: string,
  fillLocation: HTMLInputElement|HTMLSelectElement
}

export type MatchedItem = {
  labelText: string,
  data: any,
  index: IndexType
};

export type MatchData = Map<FrameId, [VersionNum, MatchedItem[]]>

export interface StartRequest {
  type: 'Start',
}

export interface StopRequest {
  type: 'Close',
}

export type FrameId = number;
export type IndexType = number;
export type VersionNum = number;
export interface FillAllRequest {
  type: 'FillAll',
  value: [FrameId, VersionNum, {index: IndexType, data: any}[]][]
}

export type Fields = Map<FrameId, [VersionNum, LabelInputMessage[]]>