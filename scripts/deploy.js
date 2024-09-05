const hre = require("hardhat");
const fs = require("fs");
const { promisify } = require("util");

async function main() {
  //ERC20 BOO TOKEN
  // const BooToken = await hre.ethers.getContractFactory("BooToken");
  // const booToken = await BooToken.deploy();
  // await booToken.deployed();
  // console.log(`BOO deployed to ${booToken.address}`);

  // //ERC20 LIFE TOKEN
  // const LifeToken = await hre.ethers.getContractFactory("LifeToken");
  // const lifeToken = await LifeToken.deploy();
  // await lifeToken.deployed();
  // console.log(`LIfe deployed to ${lifeToken.address}`);

  //SingleSwapToken
  const SingleSwapToken = await hre.ethers.getContractFactory(
    "SingleSwapToken"
  );
  const singleSwapToken = await SingleSwapToken.deploy();
  await singleSwapToken.deployed();
  console.log(`SingleSwapToken deployed to ${singleSwapToken.address}`);

  //SwapMultiHop
  const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
  const swapMultiHop = await SwapMultiHop.deploy();
  await swapMultiHop.deployed();
  console.log(`swapMultiHop deployed to ${swapMultiHop.address}`);

  //USER DATA CONTRACT
  const UserStorageData = await hre.ethers.getContractFactory(
    "UserStorageData"
  );
  const userStorageData = await UserStorageData.deploy();
  await userStorageData.deployed();
  console.log(`UserStorageData deployed to ${userStorageData.address}`);

  

  let addresses = [
    // `booToken=${booToken.address}`,
    // `lifeToken=${lifeToken.address}`,
    `singleSwapToken=${singleSwapToken.address}`,
    `swapMultiHop=${swapMultiHop.address}`,
    `userStorageData=${userStorageData.address}`
  ];
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
