import React from 'react';
import App from '../src/App';
import ReactDOM from 'react-dom/client';

// check if the container already exists
// if there is already a container, do not insert a new container
const ROOT_ID = 'jobpal-root';
const container = document.getElementById(ROOT_ID);
if (container === null) {
  const body = document.querySelector('body');
  const app = document.createElement('div');
  app.id = ROOT_ID;
  if (body) {
    body.appendChild(app)
    console.log("insert app container")
  }

  const root = ReactDOM.createRoot(app);
  root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>);
} else {
  const isClosed = document.getElementById('jobpal-closed');
  if (isClosed) {
    const root = ReactDOM.createRoot(container);
    root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>);
  }
}

// const root = ReactDOM.createRoot(container);
// root.render(<App />)

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

console.log('content.js ready to go!');
