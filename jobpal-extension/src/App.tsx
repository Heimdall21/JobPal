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
  const [route, setRoute] = useState('/');

  return (
  <Router>
      <Navigate to={route} />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/edit" element={<Edit/>}/>
        </Routes>
        {(route !== '/edit')? <button onClick={()=>setRoute("/edit")}>Edit Profile</button>: <></>}
    </Router>
  );
}

export default App;
