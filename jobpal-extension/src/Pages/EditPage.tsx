import { getPrefillData, storePrefillData } from '../Lib/storageHandler';
import '../App.css';
import { useEffect, useState } from 'react';
import { AdditionalPrefillData, PrefillData, CommonPrefillData, ExtendedSpecificPrefillData } from '../Lib/StorageType';
import { ViewCommonData, ViewAdditionalType, ViewSpecificData } from '../Lib/ViewFormType';
import GeneralForm from '../Component/GeneralForm';
import SpecificForm from '../Component/SpecificForm';
import AdditionalForm from '../Component/AdditionalForm';
import styles from "./Form.module.css";

function Edit() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [commonData, setCommonData] = useState<ViewCommonData>(getDefaultViewCommonData());
    const [additionalCommonData, setAdditionalCommonData] = useState<ViewAdditionalType>([]);
    const [specificData, setSpecificData] = useState<ViewSpecificData[]>([]);

    useEffect(()=>{
        getPrefillData((data)=>{
            setIsLoading(false);
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            } else if (data === undefined) {
                return;
            }
            setCommonData(getViewCommonData(data));
            setAdditionalCommonData(getViewAdditionalCommonData(data));
            setSpecificData(getViewSpecificData(data));
        })
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        storePrefillData(toModel(commonData, additionalCommonData, specificData),
        ()=>{
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            console.log("store successfully!");
        });
    }

    if (isLoading) {
        return <></>
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>General Information</div>
            <div className={styles.FormContainer}>
                <GeneralForm commonData={commonData} setCommonData={setCommonData} />
                <div className='Category'>Additional Information</div>
                <AdditionalForm data={additionalCommonData} setAdditional={setAdditionalCommonData}/>
            </div>
            <div>Information For Specific Applications</div>
            <SpecificForm specificData={specificData} setSpecificData={setSpecificData}/>
            <button type="submit">Save</button>
        </form>
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
    return Object.entries(data.specific).map(([url, val])=>{
        const {companyName, role, shortcut, additional} = val;
        return {
            url: url,
            companyName: companyName || '',
            role: role || '',
            shortcut: shortcut || '',
            additional: toViewAdditionalType(additional)
        }
    });
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
    additionalData.forEach(({key, value, isUpdating}) => {
        if (key !== '' && value !== '' && !isUpdating) {
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

export default Edit;