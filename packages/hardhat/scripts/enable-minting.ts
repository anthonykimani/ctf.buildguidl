import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const nftFlags = await ethers.getContractAt(
    "Season1NFTFlags",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  
  console.log("Enabling minting from:", deployer.address);
  
  const tx = await nftFlags.connect(deployer).enable();
  await tx.wait();
  
  console.log("✅ Minting enabled!");
}

main().catch(console.error);