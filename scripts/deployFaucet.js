const fs = require("fs");
require("dotenv").config();
const { promisify } = require("util");

async function main() {
    const [owner, signer2] = await ethers.getSigners();
  
    Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy(process.env.shoaibAddress, process.env.rayyanAddrss, process.env.popUpAddress);
    await faucet.deployTransaction.wait()

    let addresses = [
      `faucet=${faucet.address}`,
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


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
