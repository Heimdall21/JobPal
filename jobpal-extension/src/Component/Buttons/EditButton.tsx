import React from "react";
import styles from './EditButton.module.css';

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
}

const EditButton: React.FC<Props> = ({
  border, 
  color, 
  children, 
  height, 
  onClick,
  radius,
  width
}) => {
  return (
    <button
      className={`_edit_prefills ${styles._edit_prefills}`}
      onClick={onClick}
    >
      edit
    </button>
  )
}

export default EditButton;