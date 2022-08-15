console.log('contents script running!!!');

// dummy variable
var testVariable = [
  { inputFieldDescription: 'Title', value: ''},
  { inputFieldDescription: 'First name', value: ''},
  { inputFieldDescription: 'Last name', value: ''},
  { inputFieldDescription: 'Country', value: ''},
  { inputFieldDescription: 'Mobile', value: ''},
  { inputFieldDescription: 'Email address', value: ''}
]

// input variables
var inputFieldHTML = '';
testVariable.forEach(function(inputVariable, index){
  inputFieldHTML += '<li>' + inputVariable.inputFieldDescription+' - </li>'
});

// JobPal extension UI ===
var isDisplayed = true;
var uiDisplay = document.createElement('div');
uiDisplay.className = '_uiDisplay';
// uiDisplay.innerHTML = '<h1>JobPal</h1><p>prefill options</p><<ul>' + inputFieldHTML + '</ul>';
uiDisplay.innerHTML = `
  <div>
    <h1 class="_jobpal_heading">JobPal</h1>
  </div>
  <div class="_section_body">
    <p class="_section_title">Personal details</p>
    <ul>
      ${inputFieldHTML}
    </ul>
  </div>
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


// prefill all button ====
var testButton = document.createElement('mybutton');
//testButton.className = '_button';
testButton.innerHTML = `
  <div>
    <button class="button-3" style={{background: green}}>
      <span class="button__text">Prefill all</span>
    </button>
  </div>
`;
uiDisplay = document.querySelector('._uiDisplay');
uiDisplay.appendChild(testButton);
// prefill all button ====


// prefill section button ===




// prefill section button ====


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


// ordering of elements
uiDisplay.insertBefore(testButton, uiDisplay.children[1]);
