import React, { ChangeEvent, useState } from 'react';
import { DateString } from '../Lib/DateString';
import { ViewCommonData } from './ViewFormType';
import styles from "./Form.module.css";

export default function GeneralForm({commonData, setCommonData}: {
    commonData: ViewCommonData, 
    setCommonData: React.Dispatch<React.SetStateAction<ViewCommonData>>
}) {
    function updateCommonField<K extends keyof ViewCommonData>(field: K, value: ViewCommonData[K]) {
        setCommonData({
            ...commonData,
            [field]: value,
        })
    }

    function FormInputField<K extends keyof Omit<ViewCommonData,'dateOfBirth'| 'yearOfGrad' |'sex'>>(field: K, labelText: string) {
        const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
            const val = e.target.value;
            console.log(field, val);
            updateCommonField(field, val);
        }

        return (<>
            <label htmlFor={field}>{labelText}</label>
            <input type={"text"} id={field} name={field} value={commonData[field]} onChange={handleChange}></input>
        </>);
    }

    function FormSexField() {
        const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
            const val = e.target.value;
            console.log(val);
            if (val === '' || val === 'M' || val === 'F' || val === 'X') {
                updateCommonField('sex', val);
            } else {
                updateCommonField('sex', '');
            }
        }

        return (<>
        <label htmlFor='sex'>Sex</label>
        <select id="sex" name="sex" value={commonData.sex || ""} onChange={handleChange}>
            <option value="" disabled={true} hidden={true}>Please Choose Your Sex</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="X">Other</option>
        </select>
        </>);
    }

    function FormDateOfBirthField() {
        const [error, setError] = useState<string|null>(null);
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            console.log("dateOfBirth", val);
            updateCommonField('dateOfBirth', val);
            if (!DateString.validate(val)) {
                setError("not a valid data")
            }
        }

        return (<>
        <label htmlFor={'dateOfBirth'}>Date Of Birth</label>
        <input type={"date"} id={'dateOfBirth'} name={'dateOfBirth'} value={commonData.dateOfBirth}
        onChange={handleChange}></input>
        {error != null && <div className={styles.WarningText}>{error}</div>}
        </>);
    }

    return (
    <div>
        <div className={styles.Category}>Personal Information</div>
        {FormInputField("givenName", "First Name")}
        {FormInputField("familyName", "Last Name")}
        {FormInputField("phone", "Phone Number")}
        {FormInputField("email", "Email")}

        {FormSexField()}

        {FormDateOfBirthField()}

        {FormInputField("address", "Address")}
        {FormInputField("postalCode", "Postal Code")}

        <div className={styles.Category}>Education</div>
        {FormInputField("university", "University")}
        {FormInputField("degree", "Degree")}
        <FormYearOfGradField setField={updateCommonField} yearOfGrad={commonData.yearOfGrad}/>

        <div className={styles.Category}>Links</div>
        {FormInputField("github", "Github Link")}
        {FormInputField("linkedin", "LinkedIn Link")}
    </div>
    );
}

function FormYearOfGradField({setField, yearOfGrad}:{
    setField: <K extends keyof ViewCommonData>
    (field: K, value: ViewCommonData[K])=>void,
    yearOfGrad: string
}) {
    const field = 'yearOfGrad';
    const [error, setError] = useState<string|null>(null);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const num = parseInt(val, 10);
        console.log("yearOfGrad", val, num)
        setField(field, val);
        if (!isNaN(num)) {
            if (num < 1900 || num > 2099) {
                setError("The number should be between 1900 and 2099!");
            } else {
                setError(null);
            }
        } else if (val !== '') {
            setError("Invalid date!");
        }
    }

    return (<>
    <label htmlFor={field}> Year of Graduation</label>
    <input type="number" min="1900" max="2099" step="1" value={yearOfGrad === undefined? '': yearOfGrad.toString()} placeholder={"Predicted Year of Graduation"} onChange={handleChange}></input>
    {error !== null && <div className={styles.WarningText}>{error}</div>}
    </>)
}

