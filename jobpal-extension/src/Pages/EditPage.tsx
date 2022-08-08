import { getPrefillData, storePrefillData } from '../Lib/storageHandler';
import '../App.css';
import { useEffect, useState } from 'react';
import {ExtendedSpecificPrefillData, ExtendedCommonPrefillData} from '../Lib/StorageType';
import GeneralForm from '../Component/GeneralForm';
import SpecificForm from '../Component/SpecificForm';

function Edit() {
    const [isLoading, setIsLoading] = useState(true);
    const [commonData, setCommonData] = useState<ExtendedCommonPrefillData>(getDefualtExtendedCommonPrefillData());
    const [specificData, setSpecificData] = useState<Map<string, ExtendedSpecificPrefillData>>(new Map());

    useEffect(()=>{
        getPrefillData((data)=>{
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            setIsLoading(false);
            setCommonData(data.common);
            setSpecificData(new Map(Object.entries(data.specific)));
        })
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        storePrefillData({
            common: commonData,
            specific: Object.fromEntries(specificData)
        }, ()=>{
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
            <GeneralForm commonData={commonData} setCommonData={setCommonData} />
            <div>Information For Specific Applications</div>
            <SpecificForm specificData={specificData} setSpecificData={setSpecificData}/>
            <button type="submit">Save</button>
        </form>
    );
}

function getDefualtExtendedCommonPrefillData():ExtendedCommonPrefillData {
    return {additional:{}}
}

export default Edit;