import React from "react";
import { FiX } from "react-icons/fi";
import { IconContext } from "react-icons";
import { Button } from "@mui/material";

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
}

const CloseButton: React.FC<Props> = ({
  border, 
  color, 
  children, 
  height, 
  onClick,
  radius,
  width
}) => {
  return (
    <IconContext.Provider value={{}}>
      <Button
        className="button-3 bottom_margin"
        onClick={onClick}
      >
        <FiX/>
      </Button>
    </IconContext.Provider>
  )
}

export default CloseButton;
