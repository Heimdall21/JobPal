import { useEffect, useState, useMemo, Dispatch, SetStateAction } from "react";
import { Fields, FillAllRequest, FrameId, MatchData, matchInputElements, transformPrefillData } from "../../ContentScripts/input";
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
import MinimiseButton from "../Buttons/MinimiseButton";
import CloseButton from "../Buttons/CloseButton";
import { StopRequest } from "../../ContentScripts/input";
import Grid from '@mui/material/Grid';
import { makeStyles } from '@material-ui/core/styles';

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
]

function MainDisplay({data, formFields, setMinimised, setClosed}: { data: PrefillData|null, formFields: Fields, setMinimised: Dispatch<SetStateAction<Boolean>>, setClosed: Dispatch<SetStateAction<Boolean>> }) {
  const [dummyData, setDummyData] = useState(DummyData);
  const renderSectionsList = dummyData.map((section: any) => (
    <Grid item xs={2} >
      <PrefillSection section_title={section.section_title} section_fields={section.section_fields}/>
    </Grid>
  ));
  let navigate = useNavigate();

  const [matched, notmatched] = useMemo(
    ()=> data === null || formFields === null?
      [new Map() as MatchData, new Map()]:
      matchInputElements(transformPrefillData(data, window.location), formFields),
    [data, formFields]);

  return (
    <div className={`_main_display ${styles._main_display}`}>
      <Grid 
        container 
        spacing={1}
        direction="column"
        alignItems="center"
      >
        <h1 className={`mainDisplayHeading ${styles._jobpal_heading}`}>JobPal</h1>
        <MinimiseButton
          border="none"
          color="black"
          height="200px"
          onClick={() => setMinimised(true)}
          radius="50%"
          width="200px"
        />
        <CloseButton
          border="none"
          color="black"
          height="200px"
          onClick={() => {setClosed(true); chrome.runtime.sendMessage<StopRequest>({type: "Close"});}}
          radius="50%"
          width="200px"
        />
        <Grid
          container
          item
          direction="row"
          spacing={16}
        >
          <Grid
            item
          >
            <Button 
              variant="text"
              onClick={() => {
                if (data !== null && formFields !== null) {
                  chrome.runtime.sendMessage<FillAllRequest>({
                    type: "FillAll",
                    value: Array.from(matched.entries())
                      .map(([key, [version, rest]])=>[key, version, rest])
                  })
                  toast.success('prefill all matched elements');
                }
              }}      
            >
              Prefill all
            </Button>
          </Grid>
          <Grid
            item
          >
            <Button
              onClick={() => navigate('/edit')}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
        
        {/* {formFields === null?<></>: <FieldsDisplay fields={formFields} data={data} matched={matched} notMatched={notmatched}/>} */}
        <Grid 
          container 
          item
          spacing={2}
          direction="column"
        >
          {renderSectionsList}
        </Grid>
      </Grid>
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
