import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import abi from "./abi";

function App() {
  const [inp, setInp] = useState({ amount: "", account: "" });
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        
        // Request account access if needed

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const w3 = new Web3(window.ethereum);
        setWeb3(w3);
      } catch (error) {
        console.error(error);
        alert('Failed to connect to MetaMask. Please check the console for details.');
      }
    } else {
      alert('MetaMask extension not detected! Please install MetaMask to use this feature.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInp(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = async () => {
    const { account, amount } = inp;
    if (account === "" || amount === "") {
      alert("Please fill all the fields");
    } else {
      try {
        const transactionParameters = {
          from: account,
          to: "0x1071fDf1D094A7af98E4cc1d6Ec1145E0b4B21f9",
          value: web3.utils.toWei(amount, 'ether'),
        };
        const res = await web3.eth.sendTransaction(transactionParameters);
        const receipt = await web3.eth.getTransactionReceipt(res.transactionHash);
        if (receipt && receipt.status) {
          alert('Transaction successful!');
        } else {
          alert('Transaction failed!');
        }
      } catch (error) {
        console.error(error);
        alert('Transaction failed. Please check the console for details.');
      }
    }
  }

  const getBalance = async () => {
    try {
      const balance = await contract.methods.getBalance().call();
      alert(balance);
    } catch (error) {
      console.error(error);
      alert('Failed to get balance. Please check the console for details.');
    }
  }

  const contractConnection = async () => {
    try {
      const ctrct = new web3.eth.Contract(abi, "0x1071fDf1D094A7af98E4cc1d6Ec1145E0b4B21f9");
      setContract(ctrct);
      alert('Successfully connected to contract!');
    } catch (error) {
      console.error(error);
      alert('Connection failed. Please check the console for details.');
    }
  }
  const takeRiskEarnDouble = async () => {
    try {
      // No need to send any value with the transaction as it's handled within the contract
      const tx = await contract.methods.takeRiskEarnDouble().send({ from: "0x7E0bA3B4bcF150C32e837f43284fB298B5a9A4DE" });
      setResponse(`Transaction successful. Tx Hash: ${tx.transactionHash}`);
    } catch (error) {
      console.error(error);
      setResponse('Transaction failed. Please check the console for details.');
    }
  };
  

  return (
    <>
      <button style={{ padding: "6px", minWidth: "60px", margin: "10px" }} onClick={contractConnection}>Connect to Contract</button>
      <br />
      <br />
      <input type="number" placeholder="Enter amount" defaultValue={inp.amount} style={{ padding: "6px", margin: "10px" }} name="amount" onChange={handleChange}></input>
      <input type="text" placeholder="Enter Account" defaultValue={inp.account} style={{ padding: "6px", margin: "10px" }} name="account" onChange={handleChange}></input>
      <button style={{ padding: "6px", minWidth: "60px" }} onClick={handleSubmit}>Add Account</button>
      <br />
      <br />
      <button style={{ padding: "6px", minWidth: "60px", margin: "10px" }} onClick={getBalance}>See contract Address Balance</button>
      <br />
      <br />
      <button style={{ padding: "6px", minWidth: "60px", margin: "10px" }} onClick={takeRiskEarnDouble}>Choose and send money to winner</button>
      {response && <p>{response}</p>}
    </>
  );
}

export default App;
