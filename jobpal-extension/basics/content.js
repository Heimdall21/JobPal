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

// JobPal extension UI 
var isDisplayed = false;
var uiDisplay = document.createElement('div');
uiDisplay.className = '_uiDisplay';
uiDisplay.innerHTML = '<h1>JobPal</h1><p>prefill options</p><<ul>' + inputFieldHTML + '</ul>';
uiDisplay.style.cssText = 'height:700px;width:300px;border-radius:10px;'
+'border:1px solid;background:white;color:blue;'
+'cursor:pointer;position:fixed;top:90px;right:5px;'
+'z-index:9999999999;display:flex;overflow:hidden;';
uiDisplay.style.display = 'none';
document.body.appendChild(uiDisplay);

// coupon button
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



// basic button ====
var testButton = document.createElement('button');
testButton.className = '_testButton';
testButton.innerHTML = `
  <h1>Hello, World<h1/>
  <p>And all who inhabit it</p>
`;
testButton.style.cssText = `
  height: 200px;
  width: 200px;
  border-radius=10px;
  border: 1px solid;
  background:white;
  color:blue;
  'z-index:9999999999;
  display:flex;
  justify-content:center; 
  align-items:center';
`
uiDisplay = document.querySelector('._uiDisplay');
uiDisplay.appendChild(testButton);
// basic button ====





var createEvent = function(){
  document.querySelector('._coupon__button').addEventListener('click', function(event){
    console.log('jobpal button clicked!');
    if(isDisplayed === true) {
      document.querySelector('._uiDisplay').style.display = 'none';
      isDisplayed = false;
    } else {
      // display it again
      document.querySelector('._uiDisplay').style.display = 'block';
      isDisplayed = true;
    }
  })
}

createEvent();
