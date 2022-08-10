//debugger;
console.log("content script running");
var inputElements = document.getElementsByTagName("input");
console.log(inputElements);

input_mapping = {
  "first_name": ".*f.*name",
  "last_name": ".*l.*name",
  "preferred_name": ".*pref.*name",
  "email": ".*email.*",
  "phone": ".*phone.*",
  "location": ".*loc.*"
}

for (var ind = 0; ind < inputElements.length; ind++) {
  console.log(inputElements[ind].name)
  for (var field in input_mapping) {
    if (inputElements[ind].name.match(input_mapping[field])) {
      inputElements[ind].value = field
    }
  }
}