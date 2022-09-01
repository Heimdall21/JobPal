import { FillData, matchInputElements, transformPrefillData } from "../ContentScripts/input";
import { PrefillData } from "../Lib/StorageType";

function FieldsDisplay({ fields, data,matched, notMatched }:{
    fields: [string, HTMLInputElement|HTMLSelectElement][],
    data: (PrefillData|null)
    matched: Map<string, FillData>,
    notMatched: Map<string, string>
}) {
    const labels = fields.map((val, index)=><LabelDisplay key={index} text={val[0].trim().slice(0, 15)}/>);
    if (data === null) {
        return <div>
            {labels}
        </div>
    } else {
        return (<div>
            {labels}
            <MatchedFields matched={matched}/>
            <NotMatchedFields notMatched={notMatched}/>
        </div>);
    }
}

function LabelDisplay({text}:{text:string}) {
    return <div>{text}</div>;
}

function MatchedFields({matched}:{matched: Map<string, FillData>}) {
    return (
    <>
    <div>Matched: </div>
    {Array.from(matched.entries()).map(([k, v], index)=><div key={index}>{`${k}: ${v.data}`}</div>)}
    </>);
}

function NotMatchedFields({notMatched}:{notMatched: Map<string, string>}) {
    return (
        <>
        <div>Not Matched: </div>
        {Array.from(notMatched.entries()).map(([k, v], index)=><div key={index}>{`${k}: ${v}`}</div>)}
    </>);
}

export default FieldsDisplay;