import './App.css';
import MainDisplay from './Component/MainDisplay/MainDisplay';
import { Routes, Route, MemoryRouter } from "react-router-dom";

import { PrefillData } from './Lib/StorageType';
import Edit from './Pages/EditPage';
import { useEffect, useState } from 'react';
import { initStorageData, onUpdatePrefillData } from './Lib/storageHandler';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Fields, StartRequest } from './ContentScripts/input';
import { MainResponse } from '../public/background';
import LogoButton from './Component/Buttons/LogoButton';

function App() {
  const [data, setData] = useState<PrefillData|null>(null);
  const [formFields, setFormFields] = useState<Fields>(new Map());
  const [minimised, setMinimised] = useState<Boolean>(false);
  const [closed, setClosed] = useState<Boolean>(false);

  useEffect(()=> {
    console.log("change detected")
    console.log(closed, minimised)
  }, [closed, minimised])

  // when a LabelInputResponse is received, add it to the formFields Map
  useEffect(()=>{
    chrome.runtime.onMessage.addListener((message: MainResponse)=> {
      if (message.type === 'LabelInputResponse') {
        const version = message.version;
        setFormFields((fields) => 
          new Map(fields.set(message.frame, [version, message.data]))
        );
      }
    });
  }, []);

  // check if the data has been changed
  useEffect(()=>{
    const onUpdate = onUpdatePrefillData(setData);
    chrome.storage.onChanged.addListener(onUpdate);

    return ()=>chrome.storage.onChanged.removeListener(onUpdate);
  }, []);

  // signal listeners to start
  useEffect(()=>{
    chrome.runtime.sendMessage<StartRequest>({
      type: "Start"
    });
  }, []);

  // get the initial data
  useEffect(()=>{
    initStorageData(setData);
  }, []);

  return (
    <div>
      {closed ? <div id="jobpal-closed"/> : minimised ? 
        <LogoButton 
          border="none"
          color="black"
          height="200px"
          onClick={() => setMinimised(false)}
          radius="50%"
          width="200px"/> 
        :
        <div className="App">
          <MemoryRouter>
            <Routes>
              <Route path='/'>
                <Route index element={<MainDisplay data={data} formFields={formFields} setMinimised={setMinimised} setClosed={setClosed}/>}/>
                <Route path="edit" element={
                  data === null?
                  <></>:
                  <Edit storageData={data} />
                }/>
              </Route>
            </Routes>
          </MemoryRouter>
          <ToastContainer autoClose={300} position={'bottom-right'}/>
        </div>
      }
    </div>
  );
}

export default App;
