import React, { useState, useEffect, ChangeEvent } from 'react';
import Head from 'next/head';
//import { BugAntIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useScaffoldContract } from '~~/hooks/scaffold-eth/useScaffoldContract';
import { BigNumber, ethers, Signer } from 'ethers';
import { useAccount, useBalance, useSigner } from 'wagmi';
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth';
import { NextPage } from 'next';

const ExampleUI: NextPage = () => {
  const [token1Amount, setToken1Amount] = useState("0");
  const [token1Representation, setToken1Representation] = useState("0");
  const [token2Amount, setToken2Amount] = useState("0");
  const [token2Representation, setToken2Representation] = useState("0");
  const [tokenBalance, setTokenBalance] = useState<string | undefined>(undefined);
  const [connectedWalletTokenBalance, setConnectedWalletTokenBalance] = useState<string | undefined>(undefined);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [balanceUpdated, setBalanceUpdated] = useState(false);


  const handleToken1AmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);
  
    if (!isNaN(parsedValue)) {
      const weiValue = parsedValue * 10 ** 18;
      const stringWei = weiValue.toString();
      setToken1Representation(value);
      setToken1Amount(stringWei);
    } else {
      // Handle the case when the input value is not a valid number
      // For example, you can set the token2Amount to "0" or display an error message
    }
  };

  const handleToken2AmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);
  
    if (!isNaN(parsedValue)) {
      const weiValue = parsedValue * 10 ** 18;
      const stringWei = weiValue.toString();
      setToken2Representation(value);
      setToken2Amount(stringWei);
    } else {
      // Handle the case when the input value is not a valid number
      // For example, you can set the token2Amount to "0" or display an error message
    }

  };
   
  const { data: signer} = useSigner();
  const { data: happyContract } = useScaffoldContract({
    contractName: "Happy",
    signerOrProvider: signer as Signer,
  });

  const { data: happyDexContract } = useScaffoldContract({
    contractName: "HappyDEX",
  });

  const fetchConnectedWalletBalance = async () => {
    try {
      const account = connectedWalletAddr ?? '';
      const balance = await happyContract?.balanceOf(account);

      if (balance){
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        setConnectedWalletTokenBalance(formattedBalance);
        setBalanceUpdated(true);
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  const fetchBalance = async () => {
    try {
      const account = happyDexContract?.address ?? '';
      const balance = await happyContract?.balanceOf(account);

      if (balance){
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        setTokenBalance(formattedBalance);
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };
  
  useEffect(() => {

    fetchBalance();
    fetchConnectedWalletBalance();
  }, [happyContract]);


  const { data: dexBalance } = useBalance({
    address: happyDexContract?.address,
  })

  const {address: connectedWalletAddr } = useAccount()

  const handleApprove = async () => {
    try {

      // Call the approve function  
      const approvalTx = await happyContract?.approve(happyDexContract?.address || '', BigNumber.from(token1Amount));

      // Wait for the transaction to be mined
      await approvalTx?.wait();
  
      // Update the approval status
      setApprovalStatus(true);
    } catch (error) {
      console.error('Error approving tokens:', error);
    }
  }; 

  const { writeAsync: depositLP } = useScaffoldContractWrite({
    contractName: "HappyDEX",
    functionName: "deposit",
    value: token1Representation.toString()
  });

  const depositLPWrite = async () => {
    await depositLP();
    fetchConnectedWalletBalance();
    fetchBalance();
  };

  const { writeAsync: withdrawLP } = useScaffoldContractWrite({
    contractName: "HappyDEX",
    functionName: "withdraw",
    args: [BigNumber.from(token2Amount || "0")]
  });

  const withdrawLPWrite = async () => {
    await withdrawLP();
    fetchConnectedWalletBalance();
    fetchBalance();
  };

  
  return (
    <>
      <Head>
        <title>Happy Wanderer</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">LIQUIDITY POOL</span>
          </h1>
          <p className="text-center text-lg">You can provide liquidity to the exchange!</p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-2 pb-12">
        <div className="flex flex-col mx-auto items-center px-5 py-2 mb-12 rounded-3xl shadow-md">

          <p className='font-bold'>TOTAL LIQUIDITY</p>
          <p>$HAPPY Balance: {tokenBalance}</p>
          <p>ETH Balance: {dexBalance?.formatted} {dexBalance?.symbol}</p>
        </div>
        
        <div className="flex flex-col mx-auto items-center px-5 py-10 mb-12 rounded-3xl shadow-xl">
        <p className='pt-2'>YOUR $HAPPY BALANCE</p>
        <h1 className="font-bold text-center text-xl text-white rounded-md shadow-lg p-1 px-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"> {connectedWalletTokenBalance} </h1>
        </div>

          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">       
          <div className="flex justify-center items-center gap-1 flex-col sm:flex-col">
                    
          <p className='font-bold'>DEPOSIT </p>
          {/* <p>{happyContract?.address}</p> */}

          <div className="flex flex-col bg-base-100 px-12 py-12 text-center items-center rounded-3xl mb-12">    
          <div className="flex flex-col gap-9 ml-3 ">
        
              <div className="flex items-center mx-4 pb-5 px-5 py-7">
                <input
                  type="number"
                  value={token1Representation}
                  onChange={handleToken1AmountChange}
                  className=" py-3 px-12 rounded-md ml-4 shadow-lg"
                  placeholder="0"
                />   
              </div>

              {approvalStatus ? (
                <button
                onClick={depositLPWrite}
                className="py-2 rounded-md bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-green-500 hover:to-blue-500 shadow-lg text-white font-bold"
              >
                DEPOSIT
              </button>
              ) : (
                <button
                  onClick={handleApprove}
                  className="py-2 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg text-white font-bold"
                >
                  APPROVE
                </button>
              )}
            </div>
          </div>

          <p className='font-bold mt-12'>WITHDRAW </p>

          <div className="flex flex-col bg-base-100 py-12 mb-12 text-center items-center rounded-3xl shadow-lg">    
          <div className="flex flex-col ml-3 px-12 gap-7 ">
            
            <div className="flex items-center mx-4 pb-5 px-5 py-7 ">
                <input
                  value={token2Representation}
                  onChange={handleToken2AmountChange}
                  className=" py-3 px-12 rounded-md ml-4 shadow-lg"
                  placeholder="0"
                />                          
            </div>

             {approvalStatus ? (
               <button
               onClick={withdrawLPWrite}
               className="py-2 rounded-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 shadow-lg text-white font-bold"
             >
               WITHDRAW
             </button>
             ) : (
               <button
                 onClick={handleApprove}
                 className="py-2 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg text-white font-bold"
               >
                 APPROVE
               </button>
             )}
           </div>
      </div>
  
        </div>
        </div>
        </div>
        </div>
        </>
        );
};

export default ExampleUI;
