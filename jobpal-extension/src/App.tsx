import './App.css';
import logo from './logo.svg';
import MainDisplay from './Component/MainDisplay/MainDisplay';
import { Routes, Route, MemoryRouter } from "react-router-dom";

import { PrefillData } from './Lib/StorageType';
import Edit from './Pages/EditPage';
import { useEffect, useState } from 'react';
import { getPrefillData, onUpdatePrefillData, storePrefillData } from './Lib/storageHandler';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Fields, StartRequest } from './ContentScripts/input';
import { MainResponse } from '../public/background';


function App() {
  const [data, setData] = useState<PrefillData|null>(null);
  const [formFields, setFormFields] = useState<Fields>(new Map());

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

  useEffect(()=>{
    const onUpdate = onUpdatePrefillData(setData);
    chrome.storage.onChanged.addListener(onUpdate);

    return ()=>chrome.storage.onChanged.removeListener(onUpdate);
  }, []);

  useEffect(()=>{
    chrome.runtime.sendMessage<StartRequest>({
      type: "Start"
    });
  }, []);


  useEffect(()=>{
    getPrefillData((newData)=> {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      } else if (newData === undefined) {
          setData({
            common: {additional: {}},
            specific: {}
          });
          return;
      }
      setData(newData)
    })
  }, []);

  return (
    <div className="App">
      <MemoryRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<MainDisplay data={data} formFields={formFields}/>}/>
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
  );
}

export default App;
