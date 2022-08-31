import React, { CSSProperties } from "react";
// import './App.css';
// import logo from './logo.svg';
// import MainDisplay from './Component/MainDisplay';
import styles from "./PrefillSection.module.css";

// section_fields: {
//   title: 'Mr',
//   firstName: 'John',
//   lastName: 'Doe',
//   country: 'Australia',
//   mobile: '0404040404',
//   emailAddress: 'john.doe@testemail.com'
// }


interface Props {
  section_title: string;
  section_fields?: any;
}

const PrefillSection: React.FC<Props> = ({
  section_title, 
  section_fields,
}) => {

  return (
    // <div className={`${styles._section_body} ${styles.bottom_margin}`} >
    <div className={`${styles._section_body} _section_body`} >
      <h1 className={`${styles._section_title} _section_title`}>{section_title}</h1>
      <h2 className={`${styles._section_field} _section_field`}>{section_fields.title}</h2>
      <h2 className={`${styles._section_field} _section_field`}>{section_fields.firstName}</h2>
      <h2 className={`${styles._section_field} _section_field`}>{section_fields.lastName}</h2>
    </div>
  );
}

export default PrefillSection;
