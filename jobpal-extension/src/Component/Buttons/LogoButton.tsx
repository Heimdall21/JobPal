import React, { useEffect, useState } from "react";
import "../../App.css";
import Button from '@mui/material/Button';

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
}

const LogoButton: React.FC<Props> = ({
  border, 
  color, 
  children, 
  height, 
  onClick,
  radius,
  width
}) => {
  var [logoSrcURL, setLogoSrcURL] = useState(chrome.runtime.getURL("jobpal.png"));
  useEffect(() => {
    const url = chrome.runtime.getURL("jobpal.png");
    setLogoSrcURL(url);
  },[])
  return (
    <Button
      className="button-3 bottom_margin logo"
      onClick={onClick}
    >
      <img 
        src={logoSrcURL}
      />
    </Button>
  )
}

export default LogoButton;