import React, { ChangeEvent } from 'react';
import {CommonPrefillData, ExtendedCommonPrefillData} from '../Lib/StorageType';
import AdditionalForm from './AdditionalForm';
import { DateString } from './DateString';
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
            console.log(val);
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

    function FormYearOfGradField() {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            const num = parseInt(val, 10);
            if (!isNaN(num) && num > 0 && num <= 9999) {
                updateGeneralField('yearOfGrad', num);
            } else {
                removeGeneralField('yearOfGrad');
            }
        }

        return (<>
        <label htmlFor={'yearOfGrad'}> Year of Graduation</label>
        <input type="number" min="1900" max="2099" step="1" value={generalData.yearOfGrad === undefined? '': generalData.yearOfGrad.toString()} placeholder={"Predicted Year of Graduation"} onChange={handleChange}></input>
        </>)
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
        {FormYearOfGradField()}


        <div className='Category'>Links</div>
        {FormInputField("github", "Github Link")}
        {FormInputField("linkedin", "LinkedIn Link")}

        <div className='Category'>Additional Information</div>
        <AdditionalForm data={additionalData} addFields={addAdditionalField} removeFields={removeAdditionalField} updateFields={updateAdditionalField}/>
    </div>
    );
}
