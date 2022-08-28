import React from "react";

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
      onClick={onClick}
    >
      Prefill Button!
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
