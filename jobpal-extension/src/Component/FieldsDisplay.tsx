import { Fields, MatchData, MatchedItem } from "../ContentScripts/input";
import { LabelInputMessage } from "../ContentScripts/listener";
import { PrefillData } from "../Lib/StorageType";

function FieldsDisplay({ fields, data,matched, notMatched }:{
    fields: Fields,
    data: (PrefillData|null)
    matched: MatchData,
    notMatched: Map<string, string>
}) {
    const labelsArrs = Array.from(fields.values()).map(val=>val[1]);
    const labels: LabelInputMessage[] = ([] as LabelInputMessage[]).concat(...labelsArrs);
    const labelDisplays = labels.map((val, index)=><LabelDisplay key={index} text={val.labelText.trim().slice(0, 15)}/>);
    console.log("humbug: ", matched);
    if (data === null) {
        return <div>
            {labelDisplays}
        </div>
    } else {
        return (
          <div>
              {/* {labelDisplays} */}
              <MatchedFields matched={matched}/>
              {/* <NotMatchedFields notMatched={notMatched}/> */}
          </div>
        );
    }
}

function LabelDisplay({text}:{text:string}) {
    return <div>{text}</div>;
}

function MatchedFields({matched}:{matched: MatchData}) {
    return (
    <>
    <div>Matched: </div>
    {([] as MatchedItem[]).concat(...Array.from(matched.values()).map(val=>val[1]))
    .map(({labelText, data}, index)=>
        <div key={index}>{`${labelText}: ${data}`}</div>
    )}
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