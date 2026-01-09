import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const nftFlags = await ethers.getContractAt(
    "Season1NFTFlags",
    await (await ethers.getContract("Season1NFTFlags")).getAddress()
  );
  
  console.log("📊 Checking deployer status:");
  console.log("Deployer address:", deployer.address);
  
  // Check if deployer has minted token #1
  const hasMintedChallenge1 = await nftFlags.hasMinted(deployer.address, 1);
  console.log("Has minted Challenge #1:", hasMintedChallenge1);
  
  // Try to get token #1 owner (will revert if not minted)
  try {
    const owner1 = await nftFlags.ownerOf(1);
    console.log("Token #1 owner:", owner1);
  } catch (e) {
    console.log("Token #1 not minted yet");
  }
}

main().catch(console.error);