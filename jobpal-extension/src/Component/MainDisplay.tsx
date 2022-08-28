import * as React from "react";
import * as ReactDOM from "react-dom";
import PrefillAllButton from "./Buttons/PrefillAllButton";
import PrefillSection from "./PrefillSection";

// ReactDOM.render(
//   <div>
//     <h1>Hello, Welcome to React and TypeScript</h1>
//   </div>,
//   document.getElementById("root")
// );

function MainDisplay() {
  return (
    <div>
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
    </div>
  );
}

export default MainDisplay;
