import './App.css';
import logo from './logo.svg';
import MainDisplay from './Component/MainDisplay';

import Home from './Pages/HomePage';
import Edit from './Pages/EditPage';
import { useState } from 'react';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!!
        </a>
      </header>
      {/* <MainDisplay /> */}
    </div>
  );
}

export default App;
