import { ViewAdditionalType, ViewSpecificData } from "./ViewFormType"
import AdditionalForm from "./AdditionalForm";
import styles from "./Form.module.css";
import Button from '@mui/material/Button';

export default function SpecificForm({data, setData}: {
    data: ViewSpecificData[], 
    setData: React.Dispatch<React.SetStateAction<ViewSpecificData[]>>
}) {
    const nextId = Math.max(...data.map(val=>val.id),-1)+1;
    const addRow = ()=>{
            setData([...data, {id: nextId, url:'', companyName:'', role: '', shortcut:'', additional: []}]);
    }

    const removeRow = (targetId:number)=> {
        return ()=>setData(data.filter(v=>v.id!==targetId));
    }

    const handleDataChange = (targetId: number)=>{
        return <K extends keyof ViewSpecificData>(key: K, val: ViewSpecificData[K])=> {
            setData(data.map(v=>
                v.id===targetId?
                {...v, [key]: val}:
                v
            ))
        }
    }

    return (<div>
        <Button onClick={addRow}>Add URL</Button>
        {data.map(({id, url, additional, ...rest})=><FormRow key={id} _key={url} val={rest} additional={additional} setData={handleDataChange(id)} removeRow={removeRow(id)}/>)}
    </div>);
}

function FormRow({_key, val, additional, setData, removeRow}:{
    _key: string,
    val: Omit<ViewSpecificData, 'id' | 'url' | 'additional'>,
    additional: ViewAdditionalType,
    setData: <K extends keyof ViewSpecificData>(key: K, val: ViewSpecificData[K])=>void,
    removeRow: ()=>void
}) {

    const handleValueChange = <K extends keyof Omit<ViewSpecificData, 'id'| 'additional'>>(key: K) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setData(key, e.target.value);
        }
    }

    return (<div>
        <div className={styles.RemoveButtonContainer}>
            <Button onClick={removeRow}>Remove URL</Button>
        </div>
        <input type="text" value={_key} placeholder={"url"} onChange={handleValueChange('url')}></input>
        <input type="text" value={val.companyName} placeholder={"companyName"} onChange={handleValueChange('companyName')}></input>
        <input type="text" value={val.role} placeholder={"role"} onChange={handleValueChange('role')}></input>
        <input type="text" value={val.shortcut} placeholder={"shortcut"} onChange={handleValueChange('shortcut')}></input>
        <AdditionalForm data={additional} setAdditional={(newAdditional)=>setData('additional', newAdditional)}/>
    </div>);
}