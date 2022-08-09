import React, { useState } from "react";
import { ViewAdditionalType } from "./ViewFormType";
import styles from "./Form.module.css";

export default function AdditionalForm({setAdditional, data}: {
    data: ViewAdditionalType,
    setAdditional: (additionalData: ViewAdditionalType)=>void
}) {

    const nextId = Math.max(...data.map(val=>val.id),-1)+1;

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
        return (key:string)=>!data.filter(v=>v.id!==targetId).every(v=>v.key !== key);
    }

    return (<>
        <div className='Category'>Additional Information</div>
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
        updateRow(newKey, value);
        if (newKey === '') {
            setError("Empty key!");
        } else if (hasDuplicatedKey(newKey)) {
            setError("Duplicated key!");
        } else {
            setError(null);
        }
    }

    return (<>
        <button type="button" onClick={removeRow}>Remove Row</button>
        <input type="text" value={_key} placeholder={"key"} onChange={handleKeyChange}></input>
        <input type="text" value={value} placeholder={"value"} onChange={handleValueChange}></input>
        {error !== null && <div className={styles.WarningText}>{error}</div>}
    </>);
}
