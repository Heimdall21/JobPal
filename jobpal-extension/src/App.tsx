import './App.css';
import logo from './logo.svg';
import MainDisplay from './Component/MainDisplay/MainDisplay';
import { Routes, Route, MemoryRouter } from "react-router-dom";

import { PrefillData } from './Lib/StorageType';
import Edit from './Pages/EditPage';
import { useEffect, useState } from 'react';
import { getPrefillData, storePrefillData } from './Lib/storageHandler';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [data, setData] = useState<PrefillData|null>(null);

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
            <Route index element={<MainDisplay data={data}/>}/>
            <Route path="edit" element={
              data === null?
              <></>:
              <Edit storageData={data} updateStorageData={updateStorageDecorator(setData)}/>
            }/>
          </Route>
        </Routes>
      </MemoryRouter>
      <ToastContainer autoClose={300} position={'bottom-right'}/>
    </div>
  );
}

function updateStorageDecorator(setData: React.Dispatch<React.SetStateAction<PrefillData|null>>) {
  return (data:PrefillData)=>storePrefillData(data,
  ()=>{
      if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          toast.error(chrome.runtime.lastError.message);
          return;
      }
      toast.success("store successfully!");
      // refresh the form
      setData(data);
  });
}


export default App;
