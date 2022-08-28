import './App.css';
import logo from './logo.svg';
import MainDisplay from './Component/MainDisplay';

import Home from './Pages/HomePage';
import Edit from './Pages/EditPage';
import { useState } from 'react';

function App() {

  return (
    <div className="App">
      <MainDisplay />
    </div>
  );
}

export default App;
