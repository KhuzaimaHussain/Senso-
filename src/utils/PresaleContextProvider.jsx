import React, { useEffect, useState, useMemo } from "react";
import { PresaleContext } from "./PresaleContext";
import EthIcon from "../assets/images/token/eth.png";
import SolIcon from "../assets/images/token/SOL.png";
import BnbIcon from "../assets/images/token/bnb.png";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
const PresaleContextProvider = ({ children }) => {
  const [IsActiveBuyOnEth, setIsActiveBuyOnEth] = useState(false);
  const [IsActiveBuyOnBnb, setIsActiveBuyOnBnb] = useState(true);

  const [buyOnItem, setBuyOnItem] = useState(2);
  const [buyOnText, setBuyOnText] = useState("BUY ON BNB");
  const [buyOnIcon, setBuyOnIcon] = useState(BnbIcon);
  const [selectedImg, setSelectedImg] = useState(SolIcon);

  const [userChainId, setUserChainId] = useState(1);
  const [userBalance, setUserBalance] = useState("0 ETH");

  const [maxStage, setMaxStage] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentBonus, setCurrentBonus] = useState("20");
  const [currentPrice, setCurrentPrice] = useState("0.01");
  const [stageEnd, setStageEnd] = useState(1733996440);
  const [nextStage, setNextStage] = useState(0);
  const [nextPrice, setNextPrice] = useState("0.002");
  const [tokenName, setTokenName] = useState("GITTU TOKEN");
  const [tokenSymbol, setTokenSymbol] = useState("GITTU");
  const [presaleToken, setPresaleToken] = useState(100000);
  const [tokenSold, setTokenSold] = useState(20000);
  const [tokenPercent, setTokenPercent] = useState(20);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSubDecimals, setTokenSubDecimals] = useState(0);
  const [usdExRate, setUsdExRate] = useState(2506);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [paymentPrice, setPaymentPrice] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState();
  const [buyAmount, setBuyAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const network = WalletAdapterNetwork.Devnet;
  const [Loader, setLoader] = useState(false);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const fetchSolanaPrice = async () => {
    try {
      const url = "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT";
      const response = await axios.get(url);
      return response.data.price;
    } catch (error) {
      throw new Error("Error fetching Solana price");
    }
  };
  const buyWithSol = async (amountOfCurrency) => {
    try {
      setLoader(true);
      const tokenPrice = 0.01;
      const solPrice = await fetchSolanaPrice();
      const amountInSOL = amountOfCurrency * solPrice;
      // Get the amount in USDT from BuyWithUSDT function
      const tokentoSell = amountInSOL / tokenPrice;
      setLoader(false);
      return tokentoSell;
    } catch (error) {}
  };
  const handlePaymentInput = async (e) => {
    const _inputValue = e.target.value;
    let valueToSend = await buyWithSol(_inputValue);
    setTotalAmount(valueToSend);
    setPaymentAmount(_inputValue);

    // const _ethToUsd = _inputValue * usdExRate;
    // const _getToken = parseInt(_ethToUsd / currentPrice);

    // const pay = parseFloat(usdExRate * _inputValue).toFixed(3);
    // setPaymentUsd(pay);

    // setBuyAmount(_getToken);

    // const _bonusAmount = parseInt((_getToken * currentBonus) / 100);
    // setBonusAmount(_bonusAmount);

    // const _totalAmount = _getToken + _bonusAmount;
    // setTotalAmount(_totalAmount);

    // setPaymentPrice(_inputValue);
  };
  const buyToken = async () => {
    console.log("buy button is clicked");
    console.log("I am in Sol transfer function");
    try {
      setLoader(true);
      let recipient = "2GEHHKbQzjwSZBX8EsemBxSS3kERg9asu7NHCNTDygMw";
      let amount = paymentAmount;
      if (!recipient || !amount) {
        alert("Please enter both recipient address and amount.");
        return;
      }

      const amountInLamports = parseFloat(amount) * 1_000_000_000; // Convert SOL to lamports
      if (isNaN(amountInLamports) || amountInLamports <= 0) {
        alert("Invalid amount.");
        return;
      }

      const connection = new Connection(endpoint, "confirmed");
      const senderPublicKey = window.solana.publicKey;
      console.log(connection);

      if (!senderPublicKey) {
        alert("Connect your wallet first.");
        return;
      }

      const recipientPublicKey = new PublicKey(recipient).toString();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: amountInLamports,
        })
      );

      // Fetch the latest blockhash
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = senderPublicKey;

      // Request the wallet to sign the transaction
      const signedTransaction = await window.solana.signTransaction(
        transaction
      );
      console.log(
        "recipientPublicKey",
        recipientPublicKey,
        transaction,
        latestBlockhash
      );

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm the transaction
      await connection.confirmTransaction(signature, "confirmed");
      VlnSendingFunction(respAmount);
      alert("Transaction successful!");
      setLoader(false);
    } catch (error) {
      console.error("Error sending SOL:", error);
      // alert("Transaction failed. Check the console for details.");
    }
  };

  return (
    <PresaleContext.Provider
      value={{
        buyOnItem,
        setBuyOnItem,
        buyOnText,
        setBuyOnText,
        buyOnIcon,
        setBuyOnIcon,
        selectedImg,
        setSelectedImg,
        userChainId,
        userBalance,
        maxStage,
        currentStage,
        currentBonus,
        currentPrice,
        stageEnd,
        nextStage,
        nextPrice,
        tokenName,
        tokenSymbol,
        presaleToken,
        tokenSold,
        tokenPercent,
        tokenDecimals,
        tokenSubDecimals,
        usdExRate,
        paymentUsd,
        paymentPrice,
        paymentAmount,
        buyAmount,
        bonusAmount,
        totalAmount,
        Loader,
        handlePaymentInput,
        buyToken,
      }}
    >
      {children}
    </PresaleContext.Provider>
  );
};

export default PresaleContextProvider;
