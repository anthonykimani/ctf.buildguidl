import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Real deployed contract addresses - UPDATE THESE
  const CHALLENGE2_ADDRESS = "0x0b997E0a306c47EEc755Df75fad7F41977C5582d";
  const NFTFLAGS_ADDRESS = "0xc1Ebd7a78FE7c075035c516B916A7FB3f33c26cE"; // You'll need this
  
  console.log("🔗 Deployer:", deployer.address);
  console.log("🎯 Challenge #2:", CHALLENGE2_ADDRESS);

  // Get Challenge2 contract
  const challenge2 = await ethers.getContractAt(
    "Season1Challenge2",
    CHALLENGE2_ADDRESS
  );

  // Deploy the solver contract
  console.log("\n🔧 Deploying solver contract...");
  const Solver = await ethers.getContractFactory("SolveChallenge2");
  const solver = await Solver.connect(deployer).deploy();
  await solver.waitForDeployment();
  const solverAddress = await solver.getAddress();
  console.log("✅ Solver deployed:", solverAddress);

  // Call Challenge #2 through the solver
  console.log("\n🥈 Calling Challenge #2...");
  const tx = await solver.connect(deployer).callChallenge2(CHALLENGE2_ADDRESS);
  console.log("📤 Transaction hash:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);
  
  // If you have NFTFlags address, check ownership
  if (NFTFLAGS_ADDRESS !== "YOUR_NFTFLAGS_ADDRESS") {
    const nftFlags = await ethers.getContractAt("Season1NFTFlags", NFTFLAGS_ADDRESS);
    try {
      const owner2 = await nftFlags.ownerOf(2);
      console.log("🏆 Token #2 owner:", owner2);
    } catch (error) {
      console.log("ℹ️  Could not fetch token owner (might not be minted yet)");
    }
  }
  
  console.log("\n🎉 Challenge #2 called successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});