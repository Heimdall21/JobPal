//debugger;
console.log("content script running");
var inputElements = document.getElementsByTagName("input");

input_mapping = {
  "first_name": [".*fname.*", ".*first_name.*", ".*first.*name.*"],
  "last_name": [".*lname.*", ".*last_name.*", ".*last.*name.*"],
  "preferred_name": [".*prefname.*"],
  "email": [".*email.*"],
  "phone": [".*phone.*"],
  "location": [".*loc.*"]
}

var inputDescriptionElements = document.getElementsByTagName("label");

var inputs = [];

for (var desInd = 0; desInd < inputDescriptionElements.length; desInd++) {
  var inputElement = document.getElementById(inputDescriptionElements[desInd].htmlFor) || document.getElementsByName(inputDescriptionElements[desInd].htmlFor)[0]
  if (!inputElement) {
    inputElement = inputDescriptionElements[desInd].querySelector("select, input:not([type='hidden'])")
  }
  if (inputElement) {
    inputs.push([inputDescriptionElements[desInd].innerText, inputElement])
  }
}
console.log(inputs)