import React, { useEffect, useState, useMemo } from "react";
import { PresaleContext } from "./PresaleContext";
import EthIcon from "../assets/images/token/eth.png";
import SolIcon from "../assets/images/token/SOL.png";
import BnbIcon from "../assets/images/token/bnb.png";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Swal from 'sweetalert2'
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
  const [buyOnText, setBuyOnText] = useState("BUY ON SOL");
  const [buyOnIcon, setBuyOnIcon] = useState(BnbIcon);
  const [selectedImg, setSelectedImg] = useState(SolIcon);

  const [userChainId, setUserChainId] = useState(1);
  const [userBalance, setUserBalance] = useState("0 SOL");

  const [maxStage, setMaxStage] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentBonus, setCurrentBonus] = useState("20");
  const [currentPrice, setCurrentPrice] = useState("0.01");
  const [stageEnd, setStageEnd] = useState(1733996440);
  const [nextStage, setNextStage] = useState(0);
  const [nextPrice, setNextPrice] = useState("0.002");
  const [tokenName, setTokenName] = useState("SENSO TOKEN");
  const [tokenSymbol, setTokenSymbol] = useState("SENSO");
  const [presaleToken, setPresaleToken] = useState(100000);
  const [tokenSold, setTokenSold] = useState(20000);
  const [tokenPercent, setTokenPercent] = useState(20);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSubDecimals, setTokenSubDecimals] = useState(0);
  const [usdExRate, setUsdExRate] = useState(2506);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [paymentPrice, setPaymentPrice] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const network = WalletAdapterNetwork.Mainnet;
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
    let _inputValue = e.target.value; 
    setPaymentAmount(_inputValue); 

    try {
        let valueToSend = await buyWithSol(_inputValue);
        setTotalAmount(valueToSend);
    } catch (error) {
        console.error("Error in buyWithSol:", error);
    }

    // Uncomment if you need these calculations
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
    try {
      setLoader(true);
      let recipient = "2GEHHKbQzjwSZBX8EsemBxSS3kERg9asu7NHCNTDygMw";
      let amount = paymentAmount;
      if (!recipient || !amount) {
        // alert("Please enter both recipient address and amount.");
        Swal.fire({
          title: "Amount error",
          text: "Amount not entered?",
          icon: "error"
        });
        return;
      }

      const amountInLamports = parseFloat(amount) * 1_000_000_000; // Convert SOL to lamports
      if (isNaN(amountInLamports) || amountInLamports <= 0) {
        // alert("Invalid amount.");
        Swal.fire({
          title: "Invalid amount",
          text: "Invalid Amount entered",
          icon: "error"
        });
        return;
      }
      const connection = new Connection('https://patient-green-pond.solana-mainnet.quiknode.pro/06c90e18ae6c42237465bf27e4d705b57059a6eb', "confirmed");
      const senderPublicKey = window.solana.publicKey;

      if (!senderPublicKey) {
        // alert("Connect your wallet first.");
        Swal.fire({
          title: "Wallet Not connected",
          text: "Connect you wallet first",
          icon: "error"
        });
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

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm the transaction
      await connection.confirmTransaction(signature, "confirmed");
      // alert("Transaction successful!");
      Swal.fire({
        title: "Transaction Sucessfull",
        text: "transaction has been completed",
        icon: "success"
      });
      setLoader(false);
    } catch (error) {
      console.error("Error sending SOL:", error);
      Swal.fire({
        title: "Error while Transaction",
        text: "Server error",
        icon: "error"
      });
      setLoader(false);
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
