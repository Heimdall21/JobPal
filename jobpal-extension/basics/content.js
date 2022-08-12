console.log('contents script running!!!');

// dummy variable
var testVariable = [
  { name: 'inputField1'},
  { name: 'inputField2'},
  { name: 'inputField3'},
  { name: 'inputField4'},
  { name: 'inputField5'}
]

// input variables
var inputFieldHTML = '';
testVariable.forEach(function(inputVariable, index){
  inputFieldHTML += '<li>Input field name: ' + inputVariable.name+' - </li>'
});

// JobPal extension UI ===
var isDisplayed = true;
var uiDisplay = document.createElement('div');
uiDisplay.className = '_uiDisplay';
// uiDisplay.innerHTML = '<h1>JobPal</h1><p>prefill options</p><<ul>' + inputFieldHTML + '</ul>';
uiDisplay.innerHTML = `
  <h1 class="_jobpal_heading">JobPal</h1>
  <p>prefill options</p>
  <ul>
    ${inputFieldHTML}
  </ul>
`
uiDisplay.style.display = 'block';
document.body.appendChild(uiDisplay);
// JobPal extension UI ===


// coupon button ===
var couponButton = document.createElement('div');
couponButton.className = '_coupon__button';
couponButton.style.cssText = 'height:30px;width:30px:border-radius:100%;'
+'border:1px solid;background:white;color:blue;'
+'cursor:pointer; position:fixed; top:5px; right:5px;text-align:center;'
+'z-index:9999999999;display:flex;justify-content:center; align-items:center';
// var img = document.createElement('img');
// img.setAttribute('src', 'jobpal.png');
// couponButton.appendChild(img);
couponButton.innerHTML = 'JP';
document.body.appendChild(couponButton);
// coupon button ===


// basic button ====
var testButton = document.createElement('mybutton');
//testButton.className = '_button';
testButton.innerHTML = `
  <button class="button-3" style={{background: green}}>
    <span class="button__text">Click me</span>
  </button>
`;
uiDisplay = document.querySelector('._uiDisplay');
uiDisplay.appendChild(testButton);
// basic button ====


// var createEvent = function(){
//   document.querySelector('._coupon__button').addEventListener('click', function(event){
//     console.log('jobpal button clicked!');
//     if(isDisplayed === true) {
//       document.querySelector('._uiDisplay').style.display = 'none';
//       isDisplayed = false;
//     } else {
//       // display it again
//       document.querySelector('._uiDisplay').style.display = 'block';
//       isDisplayed = true;
//     }
//   })
// }

// createEvent();
