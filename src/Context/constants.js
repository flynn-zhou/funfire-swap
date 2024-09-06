import booToken from "./BooToken.json";
import lifeToken from "./LifeToken.json";
import singleSwapToken from "./SingleSwapToken.json";
import swapMultiHop from "./SwapMultiHop.json";
import userStorgeData from './UserStorageData.json';
import IWETH from "./IWETH.json";
import faucet from './Faucet.json'

// export const BooTokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const BooTokenAddress = '0x0B306BF915C4d645ff596e518fAf3F9669b97016'
export const BooTokenABI = booToken.abi;

// export const LifeTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const LifeTokenAddress = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'

export const LifeTokenABI = lifeToken.abi;

// export const SingleSwapTokenAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
export const SingleSwapTokenAddress = process.env.singleSwapToken
export const SingleSwapTokenABI = singleSwapToken.abi;

// export const SwapMultiHopAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
export const SwapMultiHopAddress = process.env.swapMultiHop
export const SwapMultiHopABI = swapMultiHop.abi;

//USER STORAGE Data
export const userStorageDataAddrss = process.env.userStorageData;
export const userStorageDataABI = userStorgeData.abi;

//Faucet Data
export const faucetAddress = process.env.faucet;
export const faucetABI = faucet.abi;

//IWETH
export const IWETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const IWETHABI = IWETH.abi;

//Dai
export const IDAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const IDAI = IWETH.abi;


