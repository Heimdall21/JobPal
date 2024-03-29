import '../App.css';
import React, { useState } from 'react';

import { AdditionalPrefillData, PrefillData, CommonPrefillData, ExtendedSpecificPrefillData } from '../Lib/StorageType';

import { ViewCommonData, ViewAdditionalType, ViewSpecificData, ViewCommonKeys } from '../Component/ViewFormType';
import GeneralForm from '../Component/GeneralForm';
import SpecificForm from '../Component/SpecificForm';
import AdditionalForm from '../Component/AdditionalForm';
import styles from '../Component/Form.module.css';
import { useNavigate } from 'react-router-dom';
import { storePrefillData } from '../Lib/storageHandler';
import { toast } from 'react-toastify';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';

const useStyles = makeStyles(() => ({
  card: {
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 8px 16px 0 #BDC9D7',
    overflow: 'hidden',
  },
  header: {
    fontFamily: 'Barlow, san-serif',
    backgroundColor: '#fff',
  },
  headline: {
    color: '#122740',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  link: {
    color: '#2281bb',
    padding: '0 0.25rem',
    fontSize: '0.875rem',
  },
  actions: {
    color: '#BDC9D7'
  },
  divider: {
    backgroundColor: '#d9e2ee',
    margin: '0 20px',
  }
}));


function Edit({storageData}: {storageData: PrefillData}) {
    let navigate = useNavigate();

    return (
    <div>
        <div onClick={()=>navigate('/')}> <>&larr;</> </div>
        <EditForm storageData={storageData}/>
    </div>
    );
}

export function EditForm({storageData}:{storageData: PrefillData}) {

    const [commonData, setCommonData] = useState<ViewCommonData>(getViewCommonData(storageData));
    const [additionalCommonData, setAdditionalCommonData] = useState<ViewAdditionalType>(getViewAdditionalCommonData(storageData));
    const [specificData, setSpecificData] = useState<ViewSpecificData[]>(getViewSpecificData(storageData));
    const customStyles = useStyles();

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
      <Column p={0} gap={0} className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.FormContainer}>
          <div className={styles.Section}>General Information</div>
          <div>
              <GeneralForm commonData={commonData} setCommonData={setCommonData} />
              <AdditionalForm data={additionalCommonData} setAdditional={setAdditionalCommonData}/>
          </div>
          <div className={styles.Section}>Information For Specific Job Applications</div>
          <SpecificForm data={specificData} setData={setSpecificData}/>
          <div className={styles.SubmitButtonContainer}>
              <Button type="submit" className={styles.SubmitButton}>Save</Button>
          </div>
      </form>
    </Column>
    

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

export default Edit;