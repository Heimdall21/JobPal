import React from "react";
// import './App.css';
// import logo from './logo.svg';
// import MainDisplay from './Component/MainDisplay';
import styles from "./PrefillSection.module.css";


interface Props {
  title: string;
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  radius: string;
  width: string;
}

const PrefillSection: React.FC<Props> = ({
  title, 
  border, 
  color, 
  children,
  height,
  radius,
  width
}) => {

  return (
    // <div className={`${styles._section_body} ${styles.bottom_margin}`} >
    <div className='_section_body .bottom_margin' >
      <h1 className='_section_title'>{title}</h1>

    </div>
  );
}

export default PrefillSection;
