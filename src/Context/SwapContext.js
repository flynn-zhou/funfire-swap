
'use client'
import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import axios from "axios";
import {
    checkIfWalletConnected,
    connectWallet,
    connectingWithBooToken,
    connectingWithLIfeToken,
    connectingWithSelfCreatedToken,
    connectingWithSingleSwapToken,
    connectingWithIWTHToken,
    connectingWithDAIToken,
    connectingWithUserStorageContract,
    connectingWithMultiHopContract,
  } from "../Utils/appFeature";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";

import { addLiquidityExternal } from "../Utils/addLiquidity";
import { getLiquidityData } from "../Utils/checkLiquidity";
import { connectingWithPoolContract } from "../Utils/deployPool";

export const SwapTokenContext = React.createContext();


// const localhardhatAccount0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export const SwapTokenContextProvider = ({ children }) => {

  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");
  const [tokenData, setTokenData] = useState([]);
  const [ getAllLiquidity, setGetAllLiquidity] = useState([]);

    //TOP TOKENS
    const [topTokensList, setTopTokensList] = useState([]);

  const addToken = [

    process.env.shoaibAddress,
    process.env.rayyanAddrss,
    process.env.popUpAddress,

    // "0x1c32f8818e38a50d37d1E98c72B9516a50985227",
    // "0x71d2EBF08bF4FcB82dB5ddE46677263F4c534ef3",


    // "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    // "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    // "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    // "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    // "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    // "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  ];
  //FETCH DATA
  const fetchingData = async () => {
    try {




      //GET USER ACCOUNT
      const userAccount = await checkIfWalletConnected();

      setAccount(userAccount);
      //CREATE PROVIDER
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      // console.log('provider123', await provider.getSigner().getAddress());
      //CHECK Balance
      const balance = await provider.getBalance(userAccount);
      const convertBal = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(convertBal);
      setEther(ethValue);


      //GET NETWORK
      const newtork = await provider.getNetwork();
      setNetworkConnect(newtork.name);
      console.log('newtork', newtork);
      let tmpTokenArry = []
      //ALL TOKEN BALANCE AND DATA
      addToken.map(async (el, i) => {
        //GETTING CONTRACT
        const contract = new ethers.Contract(el, ERC20, provider);

        //GETTING BALANCE OF TOKEN
        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertTokenBal = ethers.utils.formatEther(tokenLeft);
        // //GET NAME AND SYMBOL

        const symbol = await contract.symbol();
        const name = await contract.name();

        tmpTokenArry.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: el,
        });
      });
      console.log('tmpTokenArry',  tmpTokenArry, tokenData);
      setTokenData(tmpTokenArry)

      // //GET LIQUDITY
      const userStorageData = await connectingWithUserStorageContract();
      const userLiquidity = await userStorageData.getAllTransactions();
      console.log('userLiquidity',  userLiquidity);


      let tmpLiquidityArr = []
      let promiseTogetAll =  new Promise((resolve, reject) => {
        userLiquidity.forEach( async(el, i) => {
          console.log('hello there', el)
          const liquidityData = await getLiquidityData(
            el.poolAddress,
            el.tokenAddress0,
            el.tokenAddress1
          );
          console.log('liquidityData', liquidityData);
          tmpLiquidityArr.push(liquidityData);
          if(i === userLiquidity.length - 1) {
            resolve()
          }
        })
      })

      promiseTogetAll.then(() => {
        setGetAllLiquidity(tmpLiquidityArr)
      })
      // console.log('execuseme2', tmpLiquidityArr);
 

      // const wth = await connectingWithIWTHToken()
      // const userBalancewth = await wth.balanceOf(userAccount);
      // const tokenLeftwth = BigNumber.from(userBalancewth).toString();
      // const convertTokenBalWth = ethers.utils.formatEther(tokenLeftwth);
      // setWeth9(convertTokenBalWth);
      // console.log('convertTokenBalWth', convertTokenBalWth)

      // const dai = await connectingWithDAIToken()
      // const userBalancedai = await dai.balanceOf(userAccount);
      // const tokenLeftdai = BigNumber.from(userBalancedai).toString();
      // const convertTokenBalDai = ethers.utils.formatEther(tokenLeftdai);
      // setDai(convertTokenBalDai)
      // console.log('convertTokenBalDai', convertTokenBalDai)
      const URL = "https://gateway.thegraph.com/api/4e93311b7999e13e8c95ccb52c2d4d4c/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

      const query = `
      {
        tokens(orderBy: volumeUSD, orderDirection: desc, first:20){
          id
          name
          symbol
           decimals
          volume
          volumeUSD
           totalSupply
           feesUSD
           txCount
           poolCount
           totalValueLockedUSD
           totalValueLocked
           derivedETH
        }
      }
      `;

      const axiosData = await axios.post(URL, { query: query });
      console.log(axiosData.data.data.tokens);
      setTopTokensList(axiosData.data.data.tokens);

    } catch (error) {
      console.log(error);
    }
  };


  

 //SINGL SWAP TOKEN
 const singleSwapToken = async ({ token1, token2, swapAmount }) => {
  console.log(
    token1.tokenAddress.tokenAddress,
    token2.tokenAddress.tokenAddress,
    swapAmount
  );
  try {
    let singleSwapToken;
    let weth;
    let dai;
    singleSwapToken = await connectingWithSingleSwapToken();
    // console.log('singleSwapToken'. singleSwapToken);
    weth = await connectingWithIWTHToken();
    // dai = await connectingWithDAIToken();

    // let tokenOneContract = await connectingWithIWTHToken(token1.tokenAddress)

    let token1Contract = await connectingWithSelfCreatedToken(token1.name, token1.tokenAddress)
    let token2Contract = await connectingWithSelfCreatedToken(token2.name, token2.tokenAddress)


    const decimals0 = 18;
    const inputAmount = swapAmount;
    const amountIn = ethers.utils.parseUnits(
      inputAmount.toString(),
      decimals0
    );
      
    // console.log('tokenOneContract', tokenOneContract);
    console.log('token1', token1)
    console.log('token2', token2)

    // await weth.deposit({ value: amountIn });
    // console.log(amountIn);
    await token1Contract.approve(singleSwapToken.address, amountIn);
    //SWAP

    const transaction = await singleSwapToken.swapExactInputSingle(
      token1.tokenAddress,
      token2.tokenAddress,
      amountIn,
      {
        gasLimit: 300000,
      }
    );
    await transaction.wait();
    console.log('transaction', transaction);
    const balance = await token2Contract.balanceOf(account);
    const transferAmount = BigNumber.from(balance).toString();
    const ethValue = ethers.utils.formatEther(transferAmount);
    setDai(ethValue);
    console.log("token2Contract balance:", ethValue);
  } catch (error) {
    console.log(error);
  }
};



 //Multi SWAP TOKEN
 const multiSwapToken = async ({ token1, token2, swapAmount }) => {
  // alert('123')
  console.log(
    token1,
    token2,
    swapAmount
  );
  try {
    let multiSwapToken;
    let weth;
    let dai;
    multiSwapToken = await connectingWithMultiHopContract();
    // console.log('singleSwapToken'. singleSwapToken);
    weth = await connectingWithIWTHToken();
    let token1Contract = await connectingWithSelfCreatedToken(token1.name, token1.tokenAddress)
    let token2Contract = await connectingWithSelfCreatedToken(token2.name, token2.tokenAddress)
    console.log('token1Contract', token1Contract, token2Contract)
    // let tokenOneContract = await connectingWithIWTHToken(token1.tokenAddress)


    const decimals0 = 18;
    const inputAmount = swapAmount;
    const amountIn = ethers.utils.parseUnits(
      inputAmount.toString(),
      decimals0
    );
      
    // console.log('tokenOneContract', tokenOneContract);
    console.log('token1 ', token1)
    console.log('token2 ', token2)

    await weth.deposit({ value: amountIn });
    // console.log(amountIn);
    await weth.approve(multiSwapToken.address, amountIn);
    //SWAP

    const transaction = await multiSwapToken.swapExactInputMultihop(
      token1.tokenAddress,
      token2.tokenAddress,
      amountIn,
      {
        gasLimit: 300000,
      }
    );
    await transaction.wait();
    console.log(transaction);
    const balance = await token2Contract.balanceOf(account);
    const transferAmount = BigNumber.from(balance).toString();
    const ethValue = ethers.utils.formatEther(transferAmount);
    // setDai(ethValue);
    console.log("token2 balance:", ethValue);
  } catch (error) {
    console.log(error);
  }
};


  //CREATE AND ADD LIQUIDITY
  const createLiquidityAndPool = async ({
    tokenAddress0,
    tokenAddress1,
    fee,
    tokenPrice1,
    tokenPrice2,
    slippage,
    deadline,
    tokenAmmountOne,
    tokenAmmountTwo,
  }) => {
    try {
      console.log(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmmountOne,
        tokenAmmountTwo
      );
      //CREATE POOL
      const createPool = await connectingWithPoolContract(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        {
          gasLimit: 500000,
        }
      );

      const poolAddress = createPool;
      console.log('poolAddress',poolAddress);

      //CREATE LIQUIDITY
      const info = await addLiquidityExternal(
        tokenAddress0,
        tokenAddress1,
        poolAddress,
        fee,
        tokenAmmountOne,
        tokenAmmountTwo
      );
      console.log('addLiquidityExternal', info);

      //ADD DATA
      const userStorageData = await connectingWithUserStorageContract();

      const userLiqudity = await userStorageData.addToBlockchain(
        poolAddress,
        tokenAddress0,
        tokenAddress1
      );
    } catch (error) {
      console.log(error);
    }
  }; 

  useEffect(() => {
    fetchingData()
    if (typeof window !== "undefined") {
      // alert('123')
      // @ts-ignore
      console.log('here i am ')
        window.Browser = {
          T: () => {
          }
        };
      }
    // singleSwapToken();
  }, []);
  // const topTokensList = []
    return (
      <SwapTokenContext.Provider
        value={{
         account,
         weth9,
         dai,
         networkConnect,
         ether,
         tokenData,
         getAllLiquidity,
         topTokensList,
         connectWallet, 
         singleSwapToken,
         multiSwapToken,
         getPrice,
         swapUpdatePrice,
         addLiquidityExternal,
         createLiquidityAndPool
        }}
      >
        {children}
      </SwapTokenContext.Provider>
    );
  };
  