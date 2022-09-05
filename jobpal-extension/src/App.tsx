import './App.css';
import logo from './logo.svg';
import MainDisplay from './Component/MainDisplay';

import Home from './Pages/HomePage';
import Edit from './Pages/EditPage';
import { useState } from 'react';
import LogoButton from './Component/Buttons/LogoButton';

function App() {
  const [minimised, setMinimised] = useState(false);
  const [closed, setClosed] = useState(false);
  return (
    <div>
      {closed ? <></> : minimised ? 
        <LogoButton 
          border="none"
          color="black"
          height="200px"
          onClick={() => setMinimised(false)}
          radius="50%"
          width="200px"/> 
        :
        <MainDisplay
          setMinimised={setMinimised}
          setClosed={setClosed}
        /> 
      }
    </div>
  );
}

export default App;
