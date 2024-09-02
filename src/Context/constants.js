import booToken from "./BooToken.json";
import lifeToken from "./LifeToken.json";
import singleSwapToken from "./SingleSwapToken.json";
import swapMultiHop from "./SwapMultiHop.json";
import userStorgeData from './UserStorageData.json';
import IWETH from "./IWETH.json";

// export const BooTokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const BooTokenAddress = '0xD185B4846E5fd5419fD4D077dc636084BEfC51C0'
export const BooTokenABI = booToken.abi;

// export const LifeTokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const LifeTokenAddress = '0xF94AB55a20B32AC37c3A105f12dB535986697945'

export const LifeTokenABI = lifeToken.abi;

// export const SingleSwapTokenAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
export const SingleSwapTokenAddress = '0xBCF063A9eB18bc3C6eB005791C61801B7cB16fe4'
export const SingleSwapTokenABI = singleSwapToken.abi;

// export const SwapMultiHopAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
export const SwapMultiHopAddress = '0xF62eEc897fa5ef36a957702AA4a45B58fE8Fe312'
export const SwapMultiHopABI = swapMultiHop.abi;

//USER STORAGE Data
export const userStorageDataAddrss =
  "0x364C7188028348566E38D762f6095741c49f492B";
export const userStorageDataABI = userStorgeData.abi;

//IWETH
export const IWETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const IWETHABI = IWETH.abi;

//Dai
export const IDAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const IDAI = IWETH.abi;