import * as React from "react";
import * as ReactDOM from "react-dom";
import PrefillAllButton from "./Buttons/PrefillAllButton";

// ReactDOM.render(
//   <div>
//     <h1>Hello, Welcome to React and TypeScript</h1>
//   </div>,
//   document.getElementById("root")
// );

function MainDisplay() {
  return (
    <div>
      <h1>Hello, Welcome to React and TypeScript!</h1>
      <PrefillAllButton 
        border="none"
        color="black"
        height="200px"
        onClick={() => console.log("You clicked the button!")}
        radius="50%"
        width="200px"
      />
    </div>
  );
}

export default MainDisplay;
