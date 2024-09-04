
// wethAddress= '0xe8c3F27D20472e4f3C546A3f73C04B54DD72871d'
// factoryAddress= '0xd2983525E903Ef198d5dD0777712EB66680463bc'
// swapRouterAddress= '0x36B81ebd01C31643BAF132240C8Bc6874B329c4C'
// nftDescriptorAddress= '0x862E3acDE54f01a4540C4505a4E199214Ff6cD49'
// positionDescriptorAddress= '0x8786A226918A4c6Cd7B3463ca200f156C964031f'
// positionManagerAddress= '0x37453c92a0E3C63949ba340ee213c6C97931F96D'

// shoaibAddress= '0x72aC6A36de2f72BD39e9c782e9db0DCc41FEbfe2'
// rayyanAddrss= '0xAAd4F7BB5FB661181D500829e60010043833a85B'
// popUpAddress= '0x4Bd915C3e39cfF4eac842255965E79061c38cACD'

// SHO_RAY= '0x5bd6477f4cd963E38E4aAA5FA18A5555716C682B'
require("dotenv").config();

shoaibAddress = process.env.shoaibAddress;
rayyanAddrss = process.env.rayyanAddrss;
popUpAddress = process.env.popUpAddress;
wethAddress = process.env.wethAddress;

factoryAddress = process.env.factoryAddress;
swapRouterAddress = process.env.swapRouterAddress;
nftDescriptorAddress = process.env.nftDescriptorAddress;
positionDescriptorAddress = process.env.positionDescriptorAddress;
positionManagerAddress = process.env.positionManagerAddress;

SHO_RAY = process.env.shoRay;



const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
    Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
  };

  const { Contract } = require("ethers");
 const { Token } = require("@uniswap/sdk-core");
 const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");
 const { waffle } = require("hardhat");

 async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

   //  console.log(tickSpacing, fee, liquidity, slot0);
    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };

 }

 async function main() {
    const [ owner, signer2 ] = await ethers.getSigners();
    const provider = ethers.provider;
    const ShoaibContract = new Contract(
      shoaibAddress,
      artifacts.Shoaib.abi,
      provider
    );

    console.log('11111')
    const RayyanContract = new Contract(
      rayyanAddrss,
      artifacts.Rayyan.abi,
      provider
    );

    await ShoaibContract.connect(signer2).approve(
      positionManagerAddress,
      ethers.utils.parseEther("1000")
    );

    await RayyanContract.connect(signer2).approve(
      positionManagerAddress,
      ethers.utils.parseEther("1000")
    );
    console.log('22222')
    const poolContract = new Contract(
      SHO_RAY,
      artifacts.UniswapV3Pool.abi,
      provider
    );

    console.log('3333')
    const poolData = await getPoolData(poolContract);

    const ShoaibToken = new Token(31337, shoaibAddress, 18, "Shoaib", "SHO");
    const RayyanToken = new Token(31337, rayyanAddrss, 18, "Rayyan", "RAY");



    const pool = new Pool(
      ShoaibToken,
      RayyanToken,
      poolData.fee,
      poolData.sqrtPriceX96.toString(),
      poolData.liquidity.toString(),
      poolData.tick
    );


    const position = new Position({
      pool: pool,
      liquidity: ethers.utils.parseEther("1"),
      tickLower:
        nearestUsableTick(poolData.tick, poolData.tickSpacing) -
        poolData.tickSpacing * 2,
      tickUpper:
        nearestUsableTick(poolData.tick, poolData.tickSpacing) +
        poolData.tickSpacing * 2,
    });

    console.log('pool',   poolData)

   const { amount0: amount0Desired, amount1: amount1Desired } =
   position.mintAmounts; 

   params = {
    token0: shoaibAddress,
    token1: rayyanAddrss,
    fee: 3000,
    tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) -
    poolData.tickSpacing * 2,
    tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) +
    poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(), // ethers.utils.parseUnits('10', 18),
    amount1Desired: amount1Desired.toString(),
    amount0Min: 0,
    amount1Min: 0,
      recipient: signer2.address,
      deadline: Math.floor(Date.now() / 1000) + 1800,
   }

   const nonfungiblePositionManager = new Contract(
      positionManagerAddress,
      artifacts.NonfungiblePositionManager.abi,
      provider
    );

    console.log('params', params);
    const tx = await nonfungiblePositionManager
    .connect(owner)
    .mint(params, { gasLimit: "3000000" });

    console.log('params', params);


    const receipt = await tx.wait();
    console.log(receipt);
 }

 main()
 .then(() => process.exit(0))
 .catch((error) => {
   process.exit(1);
 });
