require("dotenv").config();
const { promisify } = require("util");
const fs = require("fs");

// wethAddress= '0x36B81ebd01C31643BAF132240C8Bc6874B329c4C'
// factoryAddress= '0x862E3acDE54f01a4540C4505a4E199214Ff6cD49'
// swapRouterAddress= '0x8786A226918A4c6Cd7B3463ca200f156C964031f'
// nftDescriptorAddress= '0x37453c92a0E3C63949ba340ee213c6C97931F96D'
// positionDescriptorAddress= '0x72aC6A36de2f72BD39e9c782e9db0DCc41FEbfe2'
// positionManagerAddress= '0xAAd4F7BB5FB661181D500829e60010043833a85B'

// shoaibAddress= '0x4Bd915C3e39cfF4eac842255965E79061c38cACD'
// rayyanAddrss= '0x2B64822cf4bbDd77d386F51AA2B40c5cdbeb80b5'
// popUpAddress= '0x30A6d2B697635a0ECf1975d2386A0FE6b608B0Fb'


shoaibAddress = process.env.shoaibAddress;
rayyanAddrss = process.env.rayyanAddrss;
popUpAddress = process.env.popUpAddress;

wethAddress = process.env.wethAddress;
factoryAddress = process.env.factoryAddress;
swapRouterAddress = process.env.swapRouterAddress;
nftDescriptorAddress = process.env.nftDescriptorAddress;
positionDescriptorAddress = process.env.positionDescriptorAddress;
positionManagerAddress = process.env.positionManagerAddress;


const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  };

const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const Web3Modal = require("web3modal");

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// const MAINNET_URL = "https://eth-mainnet.g.alchemy.com/v2/dHmlLhgtpGD912yKoLHv37ggEsm3ziRw";
// const MAINNET_URL = "http://localhost:8541";






function encodePriceSqrt(reserve1, reserve0) {
    return BigNumber.from(
      new bn(reserve1.toString())
        .div(reserve0.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    );
  }



  async function deployPool(token0, token1, fee, price) {
    const [owner] = await ethers.getSigners();
    // console.log(
    //   'owner', owner
    // );
    // const MAINNET_URL = "test network url";
  
    // const WALLET_SECRET = "your";
    // const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);
    // const [ signer] = await ethers.getSigners();

    // const [ signer, owner] = await ethers.getSigners();
    // const provider =  ethers.provider;
    const provider =  new ethers.providers.JsonRpcProvider("https://ethereum-holesky.publicnode.com");
// const provider =
    console.log(
      '111111111'
    );
    const nonfungiblePositionManager = new Contract(
      positionManagerAddress,
      artifacts.NonfungiblePositionManager.abi,
      provider
    );
  
    console.log(
      '2222222', owner
    );
    
    const factory = new Contract(
      factoryAddress,
      artifacts.UniswapV3Factory.abi,
      provider
    );
    

    const create = await nonfungiblePositionManager
      .connect(owner)
      .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
        gasLimit: 5000000,
      });
  
      console.log(
        '3333333'
      );
    const poolAddress = await factory
      .connect(owner)
      .getPool(token0, token1, fee);

    return poolAddress;
  }


  async function main() {
    console.log('popUpAddress', popUpAddress, rayyanAddrss);
    const PopRay = await deployPool(
      popUpAddress,
      rayyanAddrss,
      3000,
      encodePriceSqrt(1, 1)
    );
  
    console.log("Pop_Ray=", `'${PopRay}'`);

    let addresses = [`PopRay=${PopRay}`];
    const data = "\n" + addresses.join("\n");
    const writeFile = promisify(fs.appendFile);
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