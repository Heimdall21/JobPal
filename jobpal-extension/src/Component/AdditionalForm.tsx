import React, { useState } from "react";
import { AdditionalPrefillData } from "../Lib/StorageType";

export default function AdditionalForm({removeFields, updateFields, data}: {
    data: AdditionalPrefillData,
    removeFields: (key: string)=>void,
    updateFields: (key: string, val: string)=>void
}) {
    const [entries, setEntries] = useState(Object.entries(data).map((val)=>{
        return {
            field: val[0],
            value: val[1],
            isEditing: false
        };
    }));

    const addNewEntry = ()=> {
        setEntries([...entries, {field:"", value:"", isEditing: true}]);
    }

    const setIsEditable = (index: number)=>{
        return (isEditable:boolean)=>entries.map((v, i)=>
            i===index?
            {...v, isEditing:isEditable}:
            v);
    }

    return (<>
        <button type="button" onClick={addNewEntry}>Add Information</button>
        {entries.map((elem, index)=>
            elem.isEditing?
            (<EditingRow key={index} field={elem.field} value={elem.value} removeFields={removeFields} updateFields={
                (key, val)=>{
                    updateFields(key, val);
                    setIsEditable(index)(false);
                }
            } hasField={(k:string)=>data[k] !== undefined}/>):
            (<Row key={index} field={elem.field} value={elem.value} setIsEditable={setIsEditable(index)} updateFields={updateFields}/>)
        )}
    </>);
}

function EditingRow({field, value, removeFields, updateFields, hasField}:{
    field: string,
    value: string,
    removeFields: (key: string)=>void,
    updateFields: (key: string, val: string)=>void,
    hasField: (key: string)=>boolean
}) {
    const [tempField, setTempField] = useState(field);
    const [tempValue, setTempValue] = useState(value);
    const [hasError, setError] = useState(false);

    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = e.target.value;
        setTempField(newKey);
    }
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setTempValue(newVal);
    }

    const updateKeyValue = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (tempField === field) {
            updateFields(field, tempValue);
        } else {
            if (hasField(tempField)){
                setError(true);
            } else {
                removeFields(field);
                updateFields(tempField, tempValue);
            }
        }
    }

    return (<>
        <button type="button" onClick={()=>removeFields(field)}>Remove</button>
        <button type="button" onClick={updateKeyValue}>Update</button>
        <input type="text" value={tempField} placeholder={"key"} onChange={handleKeyChange}></input>
        <input type="text" value={tempValue} placeholder={"value"} onChange={handleValueChange}></input>
        {hasError && <div className="WarningText">The key has already been used!</div>}
    </>);
}

function Row({field, value, setIsEditable, updateFields}:{
    field: string,
    value: string,
    setIsEditable: (isEditable:boolean)=>void,
    updateFields: (key: string, val:string)=>void
}) {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        updateFields(field, newVal);
    }
    return (<>
        <button type="button" onClick={()=>setIsEditable(true)}>Edit</button>
        <label>{field}</label>
        <input type="text" value={value} placeholder={"value"} onChange={handleValueChange}></input>
    </>);
}
