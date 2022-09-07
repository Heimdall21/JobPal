import React from "react";
import { FiMinimize2 } from "react-icons/fi";
import { IconContext } from "react-icons";

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
}

const MinimiseButton: React.FC<Props> = ({
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
      <button
        className="button-3 bottom_margin"
        onClick={onClick}
      >
        <FiMinimize2/>
      </button>
    </IconContext.Provider>
  )
}

export default MinimiseButton;