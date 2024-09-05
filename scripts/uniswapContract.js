const { Contract, ContractFactory, utils, BigNumber } = require("ethers");
const WETH9 = require("../src/Context/WETH9.json");

const fs = require("fs");
const { promisify } = require("util");


const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
    NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    WETH9,
}

const linkLibraries = ({ bytecode, linkReferences }, libraries) => {
    Object.keys(linkReferences).forEach((fileName) => {
      Object.keys(linkReferences[fileName]).forEach((contractName) => {
        if (!libraries.hasOwnProperty(contractName)) {
          throw new Error(`Missing link library name ${contractName}`);
        }
  
        const address = utils
          .getAddress(libraries[contractName])
          .toLowerCase()
          .slice(2);
  
        linkReferences[fileName][contractName].forEach(({ start, length }) => {
          const start2 = 2 + start * 2;
          const length2 = length * 2;
  
          bytecode = bytecode
            .slice(0, start2)
            .concat(address)
            .concat(bytecode.slice(start2 + length2, bytecode.length));
        });
      });
    });
  
    return bytecode;
  };

  async function main() {
    const [signer] = await ethers.getSigners();


    let NFTDescriptor = new ContractFactory(
      artifacts.NFTDescriptor.abi,
      artifacts.NFTDescriptor.bytecode,
      signer
    );
    let nftDescriptor = await NFTDescriptor.deploy();
    await nftDescriptor.deployTransaction.wait()
    console.log('nftDescriptor', nftDescriptor.address);


    let Weth = new ContractFactory(
      artifacts.WETH9.abi,
      artifacts.WETH9.bytecode,
      signer
    );
    let weth = await Weth.deploy();
    await weth.deployTransaction.wait()
    console.log('weth', weth.address);

    let Factory = new ContractFactory(
        artifacts.UniswapV3Factory.abi,
        artifacts.UniswapV3Factory.bytecode,
        signer
      );
    let factory = await Factory.deploy();
    await factory.deployTransaction.wait()
    console.log('factory', factory.address);

    let SwapRouter = new ContractFactory(
        artifacts.SwapRouter.abi,
        artifacts.SwapRouter.bytecode,
        signer
      );
    let swapRouter = await SwapRouter.deploy(factory.address, weth.address);
    await swapRouter.deployTransaction.wait()
    console.log('swapRouter', swapRouter.address);

    const linkedBytecode = linkLibraries(
        {
          bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
          linkReferences: {
            "NFTDescriptor.sol": {
              NFTDescriptor: [
                {
                  length: 20,
                  start: 1261,
                },
              ],
            },
          },
        },
        {
          NFTDescriptor: nftDescriptor.address,
        }
      );
    // console.log('linkedBytecode', linkedBytecode);
    let NonfungibleTokenPositionDescriptor = new ContractFactory(
    artifacts.NonfungibleTokenPositionDescriptor.abi,
    linkedBytecode,
    signer
    );
    // const nativeCurrencyLabelBytes = utils.formatBytes32String("WETH");
    let nonfungibleTokenPositionDescriptor =
    await NonfungibleTokenPositionDescriptor.deploy(weth.address);
    await nonfungibleTokenPositionDescriptor.deployTransaction.wait()
    console.log('nonfungibleTokenPositionDescriptor', nonfungibleTokenPositionDescriptor.address);


    let NonfungiblePositionManager = new ContractFactory(
        artifacts.NonfungiblePositionManager.abi,
        artifacts.NonfungiblePositionManager.bytecode,
        signer
      );
      let nonfungiblePositionManager = await NonfungiblePositionManager.deploy(
        factory.address,
        weth.address,
        nonfungibleTokenPositionDescriptor.address
      );
      await nonfungiblePositionManager.deployTransaction.wait()
      console.log('nonfungiblePositionManager', nonfungiblePositionManager.address);

    console.log("wethAddress=", `'${weth.address}'`);
    console.log("factoryAddress=", `'${factory.address}'`);
    console.log("swapRouterAddress=", `'${swapRouter.address}'`);
    console.log("nftDescriptorAddress=", `'${nftDescriptor.address}'`);
    console.log(
        "positionDescriptorAddress=",
        `'${nonfungibleTokenPositionDescriptor.address}'`
      );

    console.log(
    "positionManagerAddress=",
    `'${nonfungiblePositionManager.address}'`
    );


    let addresses = [
      `wethAddress=${weth.address}`,
      `factoryAddress=${factory.address}`,
      `swapRouterAddress=${swapRouter.address}`,
      `nftDescriptorAddress=${nftDescriptor.address}`,
      `positionDescriptorAddress=${nonfungibleTokenPositionDescriptor.address}`,
      `positionManagerAddress=${nonfungiblePositionManager.address}`,
    ];
    const data = addresses.join("\n");


    const writeFile = promisify(fs.writeFile);
    const filePath = ".env";
    return writeFile(filePath, data)
      .then(() => {
        console.log("Addresses recorded.");
      })
      .catch((error) => {
        console.error("Error logging addresses:", error);
        throw error;
      });

  }

  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
