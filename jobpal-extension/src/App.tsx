import './App.css';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from 'react-router-dom';

import Home from './Pages/HomePage';
import Edit from './Pages/EditPage';
import { useState } from 'react';

function App() {

  return (
    <Edit/>
  );
}

export default App;
