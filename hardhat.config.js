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
    holesky: {
      url: "https://ethereum-holesky.publicnode.com",
      accounts: [
        "f399521ee015709075d5ea1c7d36546421ebbd045ced22f68dacc33846bf9631",
      ],
      // saveDeployments: true,
      chainId: 17000,
      blcokConfirmations: 6,
      // gasPrice: 204369036266,
      // ignition: {
      //   maxFeePerGasLimit: 500_000_000_000n, // 50 gwei
      //   maxPriorityFeePerGas: 20_000_000_000n, // 2 gwei
      // },
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/716tmTgN95MVQCemb_1GFOCuut89RU0B",
      accounts: [
        "f06afe3c80325f6f4b9b1d9cd94a22c3741ca2a44d043d46be69e240b374c9e7",
      ],
      saveDeployments: true,
      chainId: 11155111,
      blcokConfirmations: 6,
    },
    hardhat: {
      // forking: {
      //   url: "https://eth-mainnet.g.alchemy.com/v2/dHmlLhgtpGD912yKoLHv37ggEsm3ziRw",
      // }
    },
  },
};
