import { AdditionalPrefillData } from "../Lib/StorageType";

export default function AdditionalForm({addFields, removeFields, updateFields, data}: {
    addFields: (key: string, val: string)=>boolean,
    removeFields: (key: string)=>void,
    data: AdditionalPrefillData,
    updateFields: (key: string, val: string)=>void
}) {
    
    return <></>;
}