import { getLabelInputPairs } from "./input";
const element = document.createElement('h1');
element.innerText = "Hello World";
const body = document.querySelector('body');
if (body !== null) {
    body.appendChild(element);
}
console.log(getLabelInputPairs(document));
