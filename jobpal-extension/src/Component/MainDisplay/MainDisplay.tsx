import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import PrefillAllButton from "../Buttons/PrefillAllButton";
import PrefillSection from "../PrefillSection/PrefillSection";
import styles from './MainDisplay.module.css';

// ReactDOM.render(
//   <div>
//     <h1>Hello, Welcome to React and TypeScript</h1>
//   </div>,
//   document.getElementById("root")
// );

function MainDisplay() {
  // should have a list of sections -> this needs to be fetched from the localStorage
  const [sections, setSections] = useState([]);


  useEffect(() => {
    // load sections from localStorage
    
  })

  return (
    <div>
      <h1 className={`${styles._jobpal_heading} ${styles.bottom_margin}`}>JobPal</h1>
      <PrefillAllButton 
        border="none"
        color="black"
        height="200px"
        onClick={() => console.log("You clicked the button!!")}
        radius="50%"
        width="200px"
      />
      <PrefillSection 
        title="Personal Details"
        border="solid 1px"
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
