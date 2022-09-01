import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import * as ReactDOM from "react-dom";
import { getAllLabelInputPairs, getLabelInputPairs, matchInputElements, transformPrefillData } from "../../ContentScripts/input";
import { getPrefillData } from "../../Lib/storageHandler";
import { PrefillData } from "../../Lib/StorageType";
import FieldsDisplay from "../FieldsDisplay";
import PrefillAllButton from "../Buttons/PrefillAllButton";
import EditButton from "../Buttons/EditButton";
import PrefillSection from "../PrefillSection/PrefillSection";
import { toToastItem } from "react-toastify/dist/utils";
import { fillAll } from "../../Lib/FillForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

function MainDisplay({data}: { data: PrefillData|null }) {
  // const [data, setDate] = useState(DummyData);
  // const renderSectionsList = data.map((
  //   section) => <PrefillSection section_title={section.section_title} section_fields={section.section_fields}/>
  // )
  let navigate = useNavigate();
  const [formFields, setFormFields] = useState<null|[string, HTMLInputElement|HTMLSelectElement][]>(null);
  useEffect(()=>{
    setTimeout(()=>{
      // const inputFields = getAllLabelInputPairs();
      const inputFields = getLabelInputPairs(document);
      setFormFields(inputFields);
    })
  }, []);

  const [matched, notmatched] = useMemo(
    ()=> data === null || formFields === null?
      [new Map(), new Map()]:
      matchInputElements(transformPrefillData(data, window.location), formFields),
    [data, formFields]);

  return (
    <div>
      {/* <h1>Hello, Welcome to React and TypeScript!</h1> */}
      {/* <h1>JobPal</h1> */}
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
          if (data !== null && formFields !== null) {
            fillAll(matched);
            toast.success('prefill all matched elements');
          }
        }}
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
{formFields === null?<></>: <FieldsDisplay fields={formFields} data={data} matched={matched} notMatched={notmatched}/>}
      {/* {renderSectionsList} */}
    </div>
  );
}

export default MainDisplay;
