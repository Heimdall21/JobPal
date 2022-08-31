import '../App.css';
import React, { useEffect, useState } from 'react';

import { AdditionalPrefillData, PrefillData, CommonPrefillData, ExtendedSpecificPrefillData } from '../Lib/StorageType';

import { ViewCommonData, ViewAdditionalType, ViewSpecificData, ViewCommonKeys } from '../Component/ViewFormType';
import GeneralForm from '../Component/GeneralForm';
import SpecificForm from '../Component/SpecificForm';
import AdditionalForm from '../Component/AdditionalForm';
import styles from '../Component/Form.module.css';
import { useNavigate } from 'react-router-dom';

function Edit({storageData, updateStorageData}: {storageData: null|PrefillData, updateStorageData: (newData: PrefillData)=>void}) {
    let navigate = useNavigate();

    const [commonData, setCommonData] = useState<ViewCommonData>(storageData === null?new ViewCommonData():getViewCommonData(storageData));
    const [additionalCommonData, setAdditionalCommonData] = useState<ViewAdditionalType>(storageData === null?[]:getViewAdditionalCommonData(storageData));
    const [specificData, setSpecificData] = useState<ViewSpecificData[]>(storageData === null? []: getViewSpecificData(storageData));

    // update state when storageData is updated
    useEffect(()=>{
        setCommonData(getViewCommonData(storageData));
        setAdditionalCommonData(getViewAdditionalCommonData(storageData));
        setSpecificData(getViewSpecificData(storageData));
    }, [storageData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const newData = toModel(commonData, additionalCommonData, specificData);
        updateStorageData(newData);
    }

    if (storageData === null) {
        return <></>
    }
    return (
    <div>
        <div onClick={()=>navigate('/')}> <>&larr;</> </div>
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
    </div>
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