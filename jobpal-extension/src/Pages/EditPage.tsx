import '../App.css';
import { useEffect, useState } from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getPrefillData, storePrefillData } from '../Lib/storageHandler';
import { AdditionalPrefillData, PrefillData, CommonPrefillData, ExtendedSpecificPrefillData } from '../Lib/StorageType';

import { ViewCommonData, ViewAdditionalType, ViewSpecificData } from '../Component/ViewFormType';
import GeneralForm from '../Component/GeneralForm';
import SpecificForm from '../Component/SpecificForm';
import AdditionalForm from '../Component/AdditionalForm';
import styles from '../Component/Form.module.css';

function Edit() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [commonData, setCommonData] = useState<ViewCommonData>(getDefaultViewCommonData());
    const [additionalCommonData, setAdditionalCommonData] = useState<ViewAdditionalType>([]);
    const [specificData, setSpecificData] = useState<ViewSpecificData[]>([]);

    function setPrefillData(data: PrefillData) {
        // set the initial view model
        setCommonData(getViewCommonData(data));
        setAdditionalCommonData(getViewAdditionalCommonData(data));
        setSpecificData(getViewSpecificData(data));
    }

    useEffect(()=>{
        // get initial data
        getPrefillData((data)=>{
            setIsLoading(false);
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                toast.error(chrome.runtime.lastError.message);
                return;
            } else if (data === undefined) {
                return;
            }
            setPrefillData(data);
        })
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const newData = toModel(commonData, additionalCommonData, specificData);
        storePrefillData(newData,
        ()=>{
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                toast.error(chrome.runtime.lastError.message);
                return;
            }
            toast.success("store successfully!");
            // refresh the form
            setPrefillData(newData);
        });
    }

    if (isLoading) {
        return <></>
    }
    return (
    <div>
        <form onSubmit={handleSubmit} className={styles.FormContainer}>
            <div>General Information</div>
            <div>
                <GeneralForm commonData={commonData} setCommonData={setCommonData} />
                <AdditionalForm data={additionalCommonData} setAdditional={setAdditionalCommonData}/>
            </div>
            <div>Information For Specific Applications</div>
            <SpecificForm data={specificData} setData={setSpecificData}/>
            <button type="submit">Save</button>
        </form>
        <ToastContainer autoClose={300} position={'bottom-right'}/>
    </div>
    );
}

function getDefaultViewCommonData(): ViewCommonData {
    return {
        givenName: '',
        additionalName: '',
        familyName: '',
        email: '',
        sex: '',
        dateOfBirth: '',
        address: '',
        postalCode: '',
        university: '',
        degree: '',
        yearOfGrad: '',
        github: '',
        linkedin: ''
    }
}

// data to view model
function getViewCommonData(data: PrefillData): ViewCommonData {
    const ViewCommonData = getDefaultViewCommonData();
    const {additional: _, yearOfGrad, ...common} = data.common;
    return {
        ...ViewCommonData,
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

    return {
        common: {
            ...toCommonDataModel(commonData),
            additional: toAdditionalDataModel(additionalData)
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
        if (key !== '' && value !== '') {
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