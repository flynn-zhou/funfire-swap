import { ethers } from "ethers";
import Web3Modal from "web3modal";

import {
    BooTokenAddress,
    BooTokenABI,
    LifeTokenAddress,
    LifeTokenABI,
    SingleSwapTokenAddress,
    SingleSwapTokenABI,
    SwapMultiHopAddress,
    SwapMultiHopABI,  
    IWETHAddress,
    IWETHABI,
    IDAIAddress,
    IDAI,
    userStorageDataAddrss,
    userStorageDataABI,
  } from "../Context/constants";

export const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const firstAccount = accounts[0];
      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  };

  //CONNECT WALLET
export const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const firstAccount = accounts[0];
      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  };


  //BOO TOKEN FETCHING
export const fetchBooContract = (signerOrProvider) =>
    new ethers.Contract(BooTokenAddress, BooTokenABI, signerOrProvider);
  
  //CONNECTING With BOO TOKEN CONTRACT
  export const connectingWithBooToken = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchBooContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };


  //FETCHING CONTRACT------------------------

//LIFE TOKEN FETCHING
export const fetchLifeContract = (signerOrProvider) =>
    new ethers.Contract(LifeTokenAddress, LifeTokenABI, signerOrProvider);
  
  //CONNECTING With LIFE TOKEN CONTRACT
  export const connectingWithLIfeToken = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchLifeContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };
  

  //SingleSwapToken TOKEN FETCHING
export const fetchSingleSwapContract = (signerOrProvider) =>
    new ethers.Contract(
      SingleSwapTokenAddress,
      SingleSwapTokenABI,
      signerOrProvider
    );
  
  //CONNECTING With SingleSwapToken TOKEN CONTRACT
  export const connectingWithSingleSwapToken = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchSingleSwapContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };

  //IWTH TOKEN FETCHING
export const fetchIWTHContract = (signerOrProvider, address) =>
    new ethers.Contract(address ? address : IWETHAddress, IWETHABI, signerOrProvider);
  
  //CONNECTING With SingleSwapToken TOKEN CONTRACT
  export const connectingWithIWTHToken = async (addrerss) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchIWTHContract(signer, addrerss);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };

  //IWTH TOKEN FETCHING
// const DAIAddress = "";
export const fetchDAIContract = (signerOrProvider) =>
  new ethers.Contract(IDAIAddress, IDAI, signerOrProvider);

//CONNECTING With SingleSwapToken TOKEN CONTRACT
export const connectingWithDAIToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchDAIContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};


//NEW MULTIHOP
export const fetchMultiHopContract = (signerOrProvider) =>
    new ethers.Contract(SwapMultiHopAddress, SwapMultiHopABI, signerOrProvider);
  
  //CONNECTING With SingleSwapToken TOKEN CONTRACT
  export const connectingWithMultiHopContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchMultiHopContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };
  

  //USER CONTRACT CONNECTION---------
export const fetchUserStorageContract = (signerOrProvider) =>
  new ethers.Contract(
    userStorageDataAddrss,
    userStorageDataABI,
    signerOrProvider
  );

//CONNECTING With SingleSwapToken TOKEN CONTRACT
export const connectingWithUserStorageContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const contract = fetchUserStorageContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};



//USER CONTRACT CONNECTION---------
export const fetchSelfCreatedToken = async (signerOrProvider, tokenName, address) => {
  const contractFile = await import(`../Context/${tokenName}.json`)
  return  new ethers.Contract(
    address,
    contractFile.abi,
    signerOrProvider
  );
}


export const connectingWithSelfCreatedToken = async(tokenName, address) => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const contract = await fetchSelfCreatedToken(signer, tokenName, address);
    return contract;
  } catch (error) {
    console.log(error);
  }
}