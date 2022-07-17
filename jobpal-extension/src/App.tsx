import './App.css';
import {
  Link,
} from 'react-router-dom';

import Home from './Pages/HomePage';

function App() {
  return (<>
    <Home/>
    <Link to="edit.html" target="_blank" rel="noopener noreferrer">Edit Profile</Link>
  </>);
}

export default App;
