import React from 'react';
import App from '../src/App';
import ReactDOM from 'react-dom/client';

// const root = ReactDOM.createRoot(
//   document.getElementById('root')
// );
const body = document.querySelector('body');
const app = document.createElement('div');
app.id = 'react-root'
if (body) {
  body.appendChild(app)
  console.log("insert app container")
}

const container = document.getElementById('react-root');
const root = ReactDOM.createRoot(container);
root.render(
<React.StrictMode>
  <App />
</React.StrictMode>);


// const root = ReactDOM.createRoot(container);
// root.render(<App />)

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

console.log('content.js ready to go!');