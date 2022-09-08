import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
// import EditForm from './Pages/EditPage';
import { onUpdatePrefillData } from './Lib/storageHandler';
import { initStorageData } from './App';
import { ToastContainer } from 'react-toastify';

import { AdditionalPrefillData, PrefillData, CommonPrefillData, ExtendedSpecificPrefillData } from './Lib/StorageType';

import { ViewCommonData, ViewAdditionalType, ViewSpecificData, ViewCommonKeys } from './Component/ViewFormType';
import GeneralForm from './Component/GeneralForm';
import SpecificForm from './Component/SpecificForm';
import AdditionalForm from './Component/AdditionalForm';
import styles from './Component/Form.module.css';
import { storePrefillData } from './Lib/storageHandler';
import { toast } from 'react-toastify';

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

// TODO: FIX the problem so we can import instead of copy and paste
// For some reason, import EditForm from EditPage will cause an error
// we just copy the code from EditPage.tsx
function EditForm({storageData}:{storageData: PrefillData}) {

    const [commonData, setCommonData] = useState<ViewCommonData>(getViewCommonData(storageData));
    const [additionalCommonData, setAdditionalCommonData] = useState<ViewAdditionalType>(getViewAdditionalCommonData(storageData));
    const [specificData, setSpecificData] = useState<ViewSpecificData[]>(getViewSpecificData(storageData));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const newData = toModel(commonData, additionalCommonData, specificData);
        storePrefillData(newData, ()=> {
            if (chrome.runtime.lastError) {
                toast.error(chrome.runtime.lastError.message);
            } else {
                toast.success("store successfully!");
            }
        });
    }

    return (
    <form onSubmit={handleSubmit} className={styles.FormContainer}>
        <div className={styles.Section}>General Information</div>
        <div>
            <GeneralForm commonData={commonData} setCommonData={setCommonData} />
            <AdditionalForm data={additionalCommonData} setAdditional={setAdditionalCommonData}/>
        </div>
        <div className={styles.Section}>Information For Specific Job Applications</div>
        <SpecificForm data={specificData} setData={setSpecificData}/>
        <div className={styles.SubmitButtonContainer}>
            <button type="submit" className={styles.SubmitButton}>Save</button>
        </div>
    </form>
    );
}

// data to view model
function getViewCommonData(data: PrefillData): ViewCommonData {
  const viewCommonData = new ViewCommonData();
  const {additional: _, yearOfGrad, ...common} = data.common;
  return {
      ...viewCommonData,
      ...common,
      yearOfGrad: yearOfGrad?.toString() || ''
  }
}

function getViewAdditionalCommonData(data: PrefillData): ViewAdditionalType {
  const {additional} = data.common;
  return toViewAdditionalType(additional);
}

// data model to view model
function toViewAdditionalType(additionalData: AdditionalPrefillData): ViewAdditionalType {
  return Object.entries(additionalData).map((val, i)=>{
      return {
          id: i,
          key: val[0],
          value: val[1],
          isUpdating: false
      };
  });
}

function getViewSpecificData(data: PrefillData): ViewSpecificData[] {
  return Object.entries(data.specific).map(([url, val], index)=>{
      const {companyName, role, shortcut, additional} = val;
      return {
          id: index,
          url: url,
          companyName: companyName || '',
          role: role || '',
          shortcut: shortcut || '',
          additional: toViewAdditionalType(additional)
      }
  });
}

// view model to data model
function toModel(commonData: ViewCommonData, additionalData: ViewAdditionalType, viewSpecificData: ViewSpecificData[]): PrefillData {
  const specificData: ([string, ExtendedSpecificPrefillData]|null)[] = viewSpecificData.map(toSpecificDataModel)
  let specificDataModel: [string, ExtendedSpecificPrefillData][] = [];
  for (let elem of specificData) {
      if (elem !== null) {
          specificDataModel.push(elem);
      }
  }
  const additionalDataModel = Object.fromEntries(
      Object.entries(toAdditionalDataModel(additionalData))
          .filter(([key, _])=>!(key in ViewCommonKeys())));

  return {
      common: {
          ...toCommonDataModel(commonData),
          additional: additionalDataModel
      },
      specific: Object.fromEntries(specificDataModel)
  }
}

function toCommonDataModel(commonData: ViewCommonData): CommonPrefillData {
  const {yearOfGrad, sex, ...common} = commonData;
  const numYearOfGrad = parseInt(yearOfGrad);

  let ret:CommonPrefillData = {};
  if (!isNaN(numYearOfGrad) && numYearOfGrad > 1900 && numYearOfGrad < 2099) {
      ret.yearOfGrad = numYearOfGrad;
  }
  if (sex !== '') {
      ret.sex = sex;
  }

  return {
      ...ret,
      ...filterEmptyString(common)
  };
}

function filterEmptyString(obj: any): any {
  return Object.fromEntries(Object.entries(obj).filter(([key, val])=>val !== ''));
}

function toAdditionalDataModel(additionalData: ViewAdditionalType): AdditionalPrefillData {
  let ret: AdditionalPrefillData = {};
  additionalData.forEach(({key, value}) => {
      if (key !== '' && value !== '' && 
          !(key in ret)) { // if the key already exists don't overwrite it
          ret[key] = value;
      }
  });
  return ret;
}

function toSpecificDataModel(specificData: ViewSpecificData):[string, ExtendedSpecificPrefillData]|null {
  const {url, additional, ...rest} = specificData;
  const additionalData = toAdditionalDataModel(additional);
  if (url === '') {
      return null;
  }
  return [url, {
      additional: additionalData,
      ...filterEmptyString(rest)
  }];
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
