import React from 'react';
import {CommonPrefillData, ExtendedCommonPrefillData} from '../Lib/StorageType';
import AdditionalForm from './AdditionalForm';
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

    function toFormInputField<K extends keyof Omit<CommonPrefillData,'dateOfBirth'| 'yearOfGrad' |'sex'>>(field: K, labelText: string) {
        return (<>
            <label htmlFor={field}>{labelText}</label>
            <input type={"text"} id={field} name={field} value={generalData[field] || ''}></input>
        </>);
    }

    return (
    <div className={styles.FormContainer}>
        <div className='Category'>Personal Information</div>
        {toFormInputField("givenName", "First Name")}
        {toFormInputField("familyName", "Last Name")}
        {toFormInputField("email", "Email")}

        <label htmlFor='sex'>Sex</label>
        <select id="sex" name="sex" value={generalData.sex || ""}>
            <option value="" disabled={true} hidden={true}>Please Choose Your Sex</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="X">Other</option>
        </select>

        <label htmlFor={'dateOfBirth'}>Date Of Birth</label>
        <input type={"date"} id={'dateOfBirth'} name={'dateOfBirth'} value={
            generalData.dateOfBirth === undefined ? '' : dateToString(generalData.dateOfBirth)
        }></input>

        {toFormInputField("address", "Address")}
        {toFormInputField("postalCode", "Postal Code")}

        <div className='Category'>Education</div>
        {toFormInputField("university", "University")}
        {toFormInputField("degree", "Degree")}

        <label htmlFor={'yearOfGrad'}> Year of Graduation</label>
        <input type="number" min="1900" max="2099" step="1" value={generalData.yearOfGrad === undefined? '': generalData.yearOfGrad.toString()} placeholder={"Predicted Year of Graduation"}></input>

        <div className='Category'>Links</div>
        {toFormInputField("github", "Github Link")}
        {toFormInputField("linkedin", "LinkedIn Link")}

        <div className='Category'>Additional Information</div>
        <AdditionalForm data={additionalData} addFields={addAdditionalField} removeFields={removeAdditionalField} updateFields={updateAdditionalField}/>
    </div>
    );
}

function dateToString(date: Date):string {
    return date.toISOString().slice(0, 10);
}
