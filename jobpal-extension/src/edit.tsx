import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { EditForm } from './Pages/EditPage';
import { initStorageData, onUpdatePrefillData } from './Lib/storageHandler';
import { ToastContainer } from 'react-toastify';
import { PrefillData } from './Lib/StorageType';

const root = ReactDOM.createRoot(
  document.getElementById('jobpal-root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <EditApp/>
  </React.StrictMode>
);

function EditApp() {
    const [data, setData] = useState<PrefillData|null>(null);
    // check if the data has been changed
    useEffect(()=>{
        const onUpdate = onUpdatePrefillData(setData);
        chrome.storage.onChanged.addListener(onUpdate);

        return ()=>chrome.storage.onChanged.removeListener(onUpdate);
    }, []);

    // // get the initial data
    useEffect(()=>{
        initStorageData(setData);
    }, []);

    return <>
      {data === null?<></>:<EditForm storageData={data}/>}
      <ToastContainer autoClose={300} position={'bottom-right'}/>
    </>;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
