import PayWithStyleWrapper from "./PayWith.style";
import StatusIcon from "../../assets/images/icons/status.png";
import Dropdown from "./Dropdown/Dropdown";
import { usePresaleData } from "../../utils/PresaleContext";

const PayWith = ({ variant }) => {
  const {
    setIsActiveBuyOnEth,
    setIsActiveBuyOnBnb,
    buyOnText,
    buyOnIcon,
    selectedImg,
    userChainId,
    currentPrice,
    tokenSymbol,
    paymentAmount,
    totalAmount,
    presaleStatus,
    handlePaymentInput,
    buyToken,
    Loader,
  } = usePresaleData();

  return (
    <PayWithStyleWrapper variant={variant}>
      {variant === "v1" && (
        <div className="mb-20 text-center">
          <h4 className="ff-title fw-600 text-white text-uppercase ">
            {/* 1 {tokenSymbol} = {currentPrice} US */}
          </h4>
        </div>
      )}

      <div className="pay-with-content">
        <div className="pay-with-content-left">
          {(variant === "v1" || variant === "v2" || variant === "v3") && (
            <ul className="pay-with-list">
              <li>
                {/* <button className="active"> */}
                {/* <img src={selectedImg} alt="icon" /> */}
                {/* </button> */}
              </li>
            </ul>
          )}

          {variant === "v4" && (
            <Dropdown
              userChainId={userChainId}
              setIsActiveBuyOnEth={setIsActiveBuyOnEth}
              setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
              variant="v2"
            />
          )}
          {variant === "v5" && (
            <Dropdown
              userChainId={userChainId}
              setIsActiveBuyOnEth={setIsActiveBuyOnEth}
              setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
              variant="v3"
            />
          )}
          {variant === "v6" && (
            <Dropdown
              userChainId={userChainId}
              setIsActiveBuyOnEth={setIsActiveBuyOnEth}
              setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
              variant="v4"
            />
          )}
        </div>

        {variant === "v2" && (
          <div className="pay-with-content-middle">
            <h4 className="ff-title fw-600 text-white text-uppercase">
              1 {tokenSymbol} = {currentPrice} US
            </h4>
          </div>
        )}

        {variant === "v3" && (
          <div className="pay-with-content-middle">
            <h4 className="ff-title2 fw-400 text-white text-uppercase">
              1 {tokenSymbol} = {currentPrice} U
            </h4>
          </div>
        )}
      </div>

      <form action="/" method="post">
        <div className="presale-item mb-30">
          <div className="presale-item-inner">
            <label>Pay token (SOL)</label>
            <input
              type="number"
              placeholder="enter solana"
              value={paymentAmount}
              onChange={handlePaymentInput}
            />
          </div>
          <div className="presale-item-inner">
            <label>Get Token ({tokenSymbol})</label>
            <input type="number" placeholder="0" value={totalAmount} disabled />
          </div>
        </div>
      </form>

      <div className="presale-item-msg">
        {presaleStatus && (
          <div className="presale-item-msg__content">
            <img src={StatusIcon} alt="icon" />
            <p>{presaleStatus}</p>
          </div>
        )}
      </div>
      {/* {!Loader && ( */}
      <button disabled={Loader} onClick={buyToken} className="presale-item-btn">
        Buy now
      </button>
      {/* )} */}
      {/* <button onClick={buyToken} className="presale-item-btn">
        Buy now
      </button> */}
    </PayWithStyleWrapper>
  );
};

export default PayWith;
