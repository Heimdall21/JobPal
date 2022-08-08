import React, { ChangeEvent, useState } from 'react';
import {CommonPrefillData, ExtendedCommonPrefillData} from '../Lib/StorageType';
import AdditionalForm from './AdditionalForm';
import { DateString } from '../Lib/DateString';
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

    function removeGeneralField<K extends keyof CommonPrefillData>(field: K) {
        const {[field]: _, ...rest} = generalData;
        setCommonData({
            ...rest,
            additional: additionalData
        });
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

    function FormInputField<K extends keyof Omit<CommonPrefillData,'dateOfBirth'| 'yearOfGrad' |'sex'>>(field: K, labelText: string) {
        const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
            const val = e.target.value;
            console.log(field, val);
            if (val === '') {
                removeGeneralField(field);
                return;
            }
            updateGeneralField(field, val);
        }

        return (<>
            <label htmlFor={field}>{labelText}</label>
            <input type={"text"} id={field} name={field} value={generalData[field] || ''} onChange={handleChange}></input>
        </>);
    }

    function FormSexField() {
        const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
            const val = e.target.value;
            console.log(val);
            if (val === 'M' || val === 'F' || val === 'X') {
                updateGeneralField('sex', val);
            } else {
                removeGeneralField('sex');
            }
        }

        return (<>
        <label htmlFor='sex'>Sex</label>
        <select id="sex" name="sex" value={generalData.sex || ""} onChange={handleChange}>
            <option value="" disabled={true} hidden={true}>Please Choose Your Sex</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="X">Other</option>
        </select>
        </>);
    }

    function FormDateOfBirthField() {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            console.log("dateOfBirth", val);
            if (DateString.validate(val)) {
                updateGeneralField('dateOfBirth', val);
            } else if (val.trimStart() === '') {
                removeGeneralField('dateOfBirth');
            } else {
                console.error("not a date");
            }
        }

        return (<>
        <label htmlFor={'dateOfBirth'}>Date Of Birth</label>
        <input type={"date"} id={'dateOfBirth'} name={'dateOfBirth'} value={
            generalData.dateOfBirth === undefined ? '' : (DateString.validate(generalData.dateOfBirth)??'')
        }
        onChange={handleChange}></input>
        </>);
    }

    return (
    <div className={styles.FormContainer}>
        <div className='Category'>Personal Information</div>
        {FormInputField("givenName", "First Name")}
        {FormInputField("familyName", "Last Name")}
        {FormInputField("email", "Email")}

        {FormSexField()}

        {FormDateOfBirthField()}

        {FormInputField("address", "Address")}
        {FormInputField("postalCode", "Postal Code")}

        <div className='Category'>Education</div>
        {FormInputField("university", "University")}
        {FormInputField("degree", "Degree")}
        <FormYearOfGradField updateGeneralField={updateGeneralField} removeGeneralField={removeGeneralField} generalData={generalData}/>

        <div className='Category'>Links</div>
        {FormInputField("github", "Github Link")}
        {FormInputField("linkedin", "LinkedIn Link")}

        <div className='Category'>Additional Information</div>
        <AdditionalForm data={additionalData} addFields={addAdditionalField} removeFields={removeAdditionalField} updateFields={updateAdditionalField}/>
    </div>
    );
}

function FormYearOfGradField({updateGeneralField, generalData, removeGeneralField}:{
    updateGeneralField: <K extends keyof CommonPrefillData>
    (field: K, value: CommonPrefillData[K])=>void,
    removeGeneralField: <K extends keyof CommonPrefillData>(field: K)=>void,
    generalData: CommonPrefillData
}) {
    const field = 'yearOfGrad';
    const [invalid, setInvalid] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const num = parseInt(val, 10);
        console.log("yearOfGrad", val, num)
        if (!isNaN(num)) {
            updateGeneralField(field, num);
            if (num < 1900 || num > 2099) {
                setInvalid(true);
            } else {
                setInvalid(false);
            }
        } else if (val === '') {
            removeGeneralField(field);
        } else {
            removeGeneralField(field);
            setInvalid(true);
        }
    }

    return (<>
    <label htmlFor={field}> Year of Graduation</label>
    <input type="number" min="1900" max="2099" step="1" value={generalData.yearOfGrad === undefined? '': generalData.yearOfGrad.toString()} placeholder={"Predicted Year of Graduation"} onChange={handleChange}></input>
    {invalid && <div className={styles.WarningText}>The number should be between 1900 to 2099.</div>}
    </>)
}

