import React from 'react';
import {CommonPrefillData, ExtendedCommonPrefillData} from '../Lib/StorageType';
import styles from "./Form.module.css";

export default function GeneralForm({commonData, setCommonData}: {
    commonData: ExtendedCommonPrefillData, 
    setCommonData: React.Dispatch<React.SetStateAction<ExtendedCommonPrefillData>>
}) {
    const {additional: additionalData, ...generalData} = commonData;
    
    function updateGeneralField<K extends keyof CommonPrefillData>(field: K, value: CommonPrefillData[K]) {
        setCommonData({
            ...generalData,
            [field]: value,
            additional: additionalData
        })
    }

    function addAdditionalField(key: string, value: string):boolean {
        if (additionalData.hasOwnProperty(key)) {
            return false;
        }
        setCommonData({
            ...generalData,
            additional: {
                ...additionalData,
                [key]: value
            }
        });
        return true;
    }

    function updateAdditionalField(key: string, value: string) {
        setCommonData({
            ...generalData,
            additional: {
                ...additionalData,
                [key]: value
            }
        })
    }

    function removeAdditionalField(key: string) {
        const {[key]: _, ...newAdditionalData} = additionalData;
        setCommonData({
            ...generalData,
            additional: newAdditionalData
        })
    }

    return (
    <div className={styles.FormContainer}>
        <label htmlFor='givenName'>First Name</label>
        <input type={"text"} id="givenName" name='givenName' value={generalData.givenName || ""} placeholder={"Your Given Name"}></input>
        <label htmlFor='familyName'>Last Name</label>
        <input type={"text"} id="familyName" name="familyName" value={generalData.familyName || ""} placeholder={"Your Family Name"}></input>
        <label htmlFor='additionalName'>Additional Name</label>
        <input type={"text"} id="additionalName" name='additionalName' value={generalData.additionalName || ""} placeholder={"Your Additional Name"}></input>
        <label htmlFor='email'>Email</label>
        <input></input>
    </div>
    );
}