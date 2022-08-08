import React, { useState } from "react";
import { ViewAdditionalType } from "../Lib/ViewFormType";
import styles from "./Form.module.css";

export default function AdditionalForm({setAdditional, data}: {
    data: ViewAdditionalType,
    setAdditional: (additionalData: ViewAdditionalType)=>void
}) {

    const nextId = Math.max(...data.map(val=>val.id),0);

    const addNewRow = ()=> {
        setAdditional([...data, {id: nextId, key:"", value:""}]);
    }

    const updateRow = (targetId: number)=>{
        return (newKey: string, newVal:string)=>
        setAdditional(
            data.map(v=>
                v.id===targetId?
                {key:newKey, value:newVal, id:targetId}:
                v
            )
        );
    }

    const removeRow = (targetId: number)=>{
        return ()=>{
            setAdditional(data.filter(v=> v.id !== targetId));
        }
    }

    const duplicateKey = (targetId: number)=>{
        return (key:string)=>data.every(v=>v.key !== key || v.id === targetId);
    }

    console.log("additional data: ", data);

    return (<>
        <button type="button" onClick={addNewRow}>Add Information</button>
        {data.map((elem)=><Row key={elem.id} _key={elem.key} value={elem.value} 
            updateRow={updateRow(elem.id)} 
            removeRow={removeRow(elem.id)}
            hasDuplicatedKey={duplicateKey(elem.id)}
        />)}
    </>);
}

function Row({_key, value, updateRow, removeRow, hasDuplicatedKey}:{
    _key: string,
    value: string,
    updateRow: (key: string, val:string)=>void,
    removeRow: ()=>void,
    hasDuplicatedKey: (key: string) => boolean
}) {
    const [error, setError] = useState<null|string>(null);
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        updateRow(_key, newVal);
    }
    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = e.target.value;
        updateRow(_key, newKey);
        if (hasDuplicatedKey(newKey)) {
            setError("Duplicated key!");
        } else if (newKey === '') {
            setError("Empty key!");
        }
    }

    return (<>
        <button type="button" onClick={removeRow}></button>
        <input type="text" value={value} placeholder={"key"} onChange={handleKeyChange}></input>
        <input type="text" value={value} placeholder={"value"} onChange={handleValueChange}></input>
        {error !== null && <div className={styles.WarningText}>{error}</div>}
    </>);
}
