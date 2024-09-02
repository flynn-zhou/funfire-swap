// require("@nomicfoundation/hardhat-toolbox");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
    namedAccounts: {
      deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
      player: {
        default: 1,
      },
    },
  },
  networks: {
    // hardhat: {
    // // If you want to do some forking, uncomment this
    // forking: {
    //   url: MAINNET_RPC_URL
    // }
    // chainId: 31337,
    // blcokConfirmations: 6,
    // },
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/dHmlLhgtpGD912yKoLHv37ggEsm3ziRw",
      }
    }

  },
};
