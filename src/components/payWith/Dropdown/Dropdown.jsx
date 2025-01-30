import DropdownWrapper from "./Dropdown.style";
import { useState } from "react";
import EthIcon from "../../../assets/images/token/eth.png";
import Data from "../../../assets/data/networkInfo";

const Dropdown = ({
  setIsActiveBuyOnEth,
  setIsActiveBuyOnBnb,
  variant,
}) => {
  const dropdownList = Data;

  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [titleText, setTitleText] = useState("ETH");
  const [selectedImg, setSelectedImg] = useState(EthIcon);

  const dropdownHandle = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const handleDropdownData = ( item) => {
    event.preventDefault();
    setTitleText(item.title);
    setSelectedImg(item.icon);
    setIsDropdownActive(false);
    if (item.id == 1) {
      setIsActiveBuyOnBnb(false);
      setIsActiveBuyOnEth(true);
    }
    if (item.id == 2) {
      setIsActiveBuyOnEth(false);
      setIsActiveBuyOnBnb(true);
    }
  };

  return (
    <DropdownWrapper variant={variant}>
      <button
        className={`dropdown-toggle ${isDropdownActive ? "active" : ""}`}
        onClick={dropdownHandle}
      >
        <img src={selectedImg} alt="icon" />
        <span>{titleText}</span>
      </button>
      {isDropdownActive && (
        <ul className="dropdown-list">
          {dropdownList?.map((item, i) => (
            <li key={i}>
              <a href="#" onClick={() => handleDropdownData(item)}>
                <img src={item.icon} alt="icon" />
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;
