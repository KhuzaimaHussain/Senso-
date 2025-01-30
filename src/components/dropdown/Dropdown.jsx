import DropdownWrapper from "./Dropdown.style";
import { useState } from "react";
import EthIcon from "../../assets/images/token/eth.png";

const Dropdown = ({ variant }) => {
  const [titleText, setTitleText] = useState("ETH");
  const [selectedImg, setSelectedImg] = useState(EthIcon);

  return (
    <DropdownWrapper variant={variant}>
      <button className="dropdown-toggle">
        <img src={selectedImg} alt="icon" />
        <span>{titleText}</span>
      </button>
    </DropdownWrapper>
  );
};

export default Dropdown;
