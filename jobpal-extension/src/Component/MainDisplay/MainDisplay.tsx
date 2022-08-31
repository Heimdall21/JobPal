import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { getLabelInputPair } from "../../ContentScripts/input";
import { getPrefillData } from "../../Lib/storageHandler";
import { PrefillData } from "../../Lib/StorageType";
import FieldsDisplay from "../FieldsDisplay";
import PrefillAllButton from "../Buttons/PrefillAllButton";
import EditButton from "../Buttons/EditButton";
import PrefillSection from "../PrefillSection/PrefillSection";
import { toToastItem } from "react-toastify/dist/utils";
import styles from "./MainDisplay.module.css";

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
  }
  // {
  //   section_title: 'Education',
  //   section_fields: {
  //     education: [
  //       {
  //         sub_section_title: 'Education 1',
  //         school: 'UNSW',
  //         degree: 'Bachelor of Computer Science',
  //         discipline: 'Software Engineering',
  //         start_date: '01/01/2017',
  //         end_date: '31/12/2022'
  //       }
  //     ]
  //   }
  // },
  // {
  //   section_title: 'Interviewed before',
  //   section_fields: {
  //     workAuthorisation: false,
  //     sponsorshipRequirements: false,
  //     visaStatus: "On a student visa that lasts until July 2023"
  //   }

  // }
]

function MainDisplay() {
  // const [formFields, setFormFields] = useState<null|[string, HTMLInputElement|HTMLSelectElement][]>(null);
  // const [data, setData] = useState<PrefillData|null>(null);
  const [data, setDate] = useState(DummyData);
  const renderSectionsList = data.map((
    section) => <PrefillSection section_title={section.section_title} section_fields={section.section_fields}/>
  )
  
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     const inputFields = getLabelInputPair();
  //     setFormFields(inputFields);
  //   })
  // }, []);

  // useEffect(()=>{
    
  //   getPrefillData((newData)=> {
  //     if (chrome.runtime.lastError) {
  //       console.error(chrome.runtime.lastError);
  //       return;
  //     } else if (newData === undefined) {
  //         setData({
  //           common: {additional: {}},
  //           specific: {}
  //         });
  //         return;
  //     }
  //     setData(newData)
  //   })
  // }, []);

  return (
    <div>
      <h1 className={`mainDisplayHeading ${styles._jobpal_heading}`}>JobPal</h1>
      <EditButton
        border="none"
        color="black"
        height="200px"
        onClick={() => console.log("You clicked the button!")}
        radius="50%"
        width="200px"
      />
      <PrefillAllButton 
        border="none"
        color="black"
        height="200px"
        onClick={() => console.log("You clicked the button!")}
        radius="50%"
        width="200px"
      />
      {/* <PrefillSection 
        title="Personal Details"
        border="solid"
        color="black"
        children="Test child"
        height="150px"
        width="200px"
        radius="20px"
      /> */}
{/* {formFields === null?<></>: <FieldsDisplay fields={formFields} data={data}/>} */}
      {renderSectionsList}
    </div>
  );
}

export default MainDisplay;
