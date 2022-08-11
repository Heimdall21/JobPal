import INPUT_MAP from './mapping.json';

export function replaceInputElements() {
    const inputElements = document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
        const inputElement = inputElements[i];
        console.log(inputElement.name)
        for (const [field, matchStr] of Object.entries(INPUT_MAP)) {
          if (new RegExp(matchStr).test(inputElement.name)) {
            inputElement.value = field;
          }
        }
    }
}

