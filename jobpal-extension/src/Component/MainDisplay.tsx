import '../App.css';
import PrefillAllButton from "./Buttons/PrefillAllButton";
import PrefillSection from "./PrefillSection";
import MinimiseButton from "./Buttons/MinimiseButton";
import CloseButton from "./Buttons/CloseButton";
import { Dispatch, SetStateAction } from "react";

interface DisplayProps {
  setMinimised: Dispatch<SetStateAction<boolean>>;
  setClosed: Dispatch<SetStateAction<boolean>>;
}

function MainDisplay({setMinimised, setClosed}: DisplayProps) {
  return (
    <div className="App">
      <h1>JobPal</h1>
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
        onClick={() => setClosed(true)}
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
      <PrefillSection 
        title="Personal Details"
        border="solid"
        color="black"
        children="Test child"
        height="150px"
        width="200px"
        radius="20px"
      />
    </div>
  );
}

export default MainDisplay;
