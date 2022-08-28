import React from "react";
// import './App.css';
// import logo from './logo.svg';
// import MainDisplay from './Component/MainDisplay';


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
    <div className="PrefillSection">
      <h1>{title}</h1>
    </div>
  );
}

export default PrefillSection;
