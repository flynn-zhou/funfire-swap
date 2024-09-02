async function main() {
    const [owner, signer2] = await ethers.getSigners();
  
    Shoaib = await ethers.getContractFactory("Shoaib");
    shoaib = await Shoaib.deploy();
  
    Rayyan = await ethers.getContractFactory("Rayyan");
    rayyan = await Rayyan.deploy();
  
    PopUp = await ethers.getContractFactory("PopUp");
    popUp = await PopUp.deploy();

    // await shoaib.connect(owner).mint(signer2.address, ethers.utils.parseEther("100000"))

    // await rayyan.connect(owner).mint(signer2.address, ethers.utils.parseEther("100000"))

    // await popUp.connect(owner).mint(signer2.address, ethers.utils.parseEther("100000")) 
  
    console.log("shoaibAddress=", `'${shoaib.address}'`);
    console.log("rayyanAddrss=", `'${rayyan.address}'`);
    console.log("popUpAddress=", `'${popUp.address}'`);
  }


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
