import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import * as ReactDOM from "react-dom";
import { Fields, FillAllRequest, matchInputElements, transformPrefillData } from "../../ContentScripts/input";
import { getPrefillData } from "../../Lib/storageHandler";
import { PrefillData } from "../../Lib/StorageType";
import FieldsDisplay from "../FieldsDisplay";
import PrefillAllButton from "../Buttons/PrefillAllButton";
import EditButton from "../Buttons/EditButton";
import PrefillSection from "../PrefillSection/PrefillSection";
import { toToastItem } from "react-toastify/dist/utils";
import styles from "./MainDisplay.module.css";
import { fillAll } from "../../Lib/FillForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LabelInputMessage } from "../../ContentScripts/listener";
import Button from '@mui/material/Button';

const DummyData = [
  {
    section_title: 'Personal Details',
    section_fields: {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      country: 'Australia',
      mobile: '0404040404',
      emailAddress: 'john.doe@testemail.com'
    }
  },
  {
    section_title: 'Personal Details',
    section_fields: {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      country: 'Australia',
      mobile: '0404040404',
      emailAddress: 'john.doe@testemail.com'
    }
  },
  // {
  //   section_title: 'Personal Details',
  //   section_fields: {
  //     title: 'Mr',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     country: 'Australia',
  //     mobile: '0404040404',
  //     emailAddress: 'john.doe@testemail.com'
  //   }
  // }
]

function MainDisplay({data, formFields}: { data: PrefillData|null, formFields: Fields|null }) {
  const [dummyData, setDummyData] = useState(DummyData);
  const renderSectionsList = dummyData.map((section: any) => <PrefillSection section_title={section.section_title} section_fields={section.section_fields}/>);
  let navigate = useNavigate();

  const [matched, notmatched] = useMemo(
    ()=> data === null || formFields === null?
      [[], new Map()]:
      matchInputElements(transformPrefillData(data, window.location), formFields),
    [data, formFields]);

  return (
    <div className={`_main_display ${styles._main_display}`}>
      <h1 className={`mainDisplayHeading ${styles._jobpal_heading}`}>JobPal</h1>
      <EditButton
        border="none"
        color="black"
        height="200px"
        onClick={() => navigate('/edit')}
        radius="50%"
        width="200px"
      />
      <PrefillAllButton 
        border="none"
        color="black"
        height="200px"
        onClick={() => {
          debugger;
          console.log("test123");
          console.log('testing');
          console.log("data: ", data);
          console.log("formFields: ", formFields);
          if (data !== null && formFields !== null) {
            const val = arrayToMap(matched, 'frame', ({data, index})=>{return {data,index};});
            chrome.runtime.sendMessage<FillAllRequest>({
              type: "FillAll",
              value: Array.from(val.entries())
            })
            toast.success('prefill all matched elements');
            console.log("prefilled all values");
          } 
          
        }}
        radius="50%"
        width="200px"
      />
      <Button variant="text">Testing</Button>
      {/* {formFields === null?<></>: <FieldsDisplay fields={formFields} data={data} matched={matched} notMatched={notmatched}/>} */}
      {renderSectionsList}
    </div>
  );
}

function arrayToMap<T, K extends keyof T, U>(arr: T[], property: K, selector: ((value: T)=>U)): Map<T[K], U[]> {
  let ret: Map<T[K], U[]> = new Map();
  for (const elem of arr) {
    const key = elem[property];
    const valArray = ret.get(key);
    if (valArray !== undefined) {
      valArray.push(selector(elem));
    } else {
      ret.set(key, [selector(elem)]);
    }
  }
  return ret;
}

export default MainDisplay;
