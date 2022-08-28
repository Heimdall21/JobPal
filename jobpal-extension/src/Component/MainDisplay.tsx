import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { getLabelInputPair } from "../ContentScripts/input";
import { getPrefillData } from "../Lib/storageHandler";
import { PrefillData } from "../Lib/StorageType";
import FieldsDisplay from "./FieldsDisplay";
import PrefillAllButton from "./Buttons/PrefillAllButton";
import PrefillSection from "./PrefillSection";

// ReactDOM.render(
//   <div>
//     <h1>Hello, Welcome to React and TypeScript</h1>
//   </div>,
//   document.getElementById("root")
// );

function MainDisplay() {
  const [formFields, setFormFields] = useState<null|[string, HTMLInputElement|HTMLSelectElement][]>(null);
  const [data, setData] = useState<PrefillData|null>(null);
  useEffect(()=>{
    setTimeout(()=>{
      const inputFields = getLabelInputPair();
      setFormFields(inputFields);
    })
  }, []);

  useEffect(()=>{
    getPrefillData((newData)=>setData(newData))
  }, []);

  return (
    <div>
      <h1>Hello, Welcome to React and TypeScript!</h1>
      <h1>JobPal</h1>
      <PrefillAllButton 
        border="none"
        color="black"
        height="200px"
        onClick={() => console.log("You clicked the button!")}
        radius="50%"
        width="200px"
      />
      <PrefillSection 
        title="Personal Details"
        border="solid"
        color="black"
        children="Test child"
        height="150px"
        width="200px"
        radius="20px"
      />
{formFields === null?<></>: <FieldsDisplay fields={formFields} data={data}/>}
    </div>
  );
}

export default MainDisplay;
