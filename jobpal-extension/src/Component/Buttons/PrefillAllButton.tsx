import React from "react";
import styles from './PrefillAllButton.module.css';

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
}

const PrefillAllButton: React.FC<Props> = ({
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
      className={`prefillAll ${styles._prefill_all_button}`}
      onClick={onClick}
    >
      Prefill all
    </button>
  )
}

export default PrefillAllButton;

// function PrefillAllButton() {
//   return (
//     <button className=""="button-3 bottom_margin" style={{background: green}}>
//       <span className=""="button__text">Prefill all</span>
//     </button>
//   );
// }

// export default MainDisplay;
