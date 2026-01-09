import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Get contract instances
  const challenge1 = await ethers.getContractAt(
    "Season1Challenge1", 
    await (await ethers.getContract("Season1Challenge1")).getAddress()
  );
  const challenge2 = await ethers.getContractAt(
    "Season1Challenge2", 
    await (await ethers.getContract("Season1Challenge2")).getAddress()
  );
  const nftFlags = await ethers.getContractAt(
    "Season1NFTFlags",
    await (await ethers.getContract("Season1NFTFlags")).getAddress()
  );

  console.log("🎯 Challenge #1:", await challenge1.getAddress());
  console.log("🎯 Challenge #2:", await challenge2.getAddress());
  console.log("🎖️  NFT Flags:", await nftFlags.getAddress());

  // Check if minting is enabled
  const isEnabled = await nftFlags.enabled();
  console.log("Minting enabled:", isEnabled);
  
  if (!isEnabled) {
    console.log("⚠️  Enabling minting...");
    const tx = await nftFlags.connect(deployer).enable();
    await tx.wait();
    console.log("✅ Minting enabled!");
  }

  // Solve Challenge #1
  console.log("\n🥇 Solving Challenge #1...");
  const tx1 = await challenge1.connect(deployer).registerMe("Builder2025");
  await tx1.wait();
  const owner1 = await nftFlags.ownerOf(1);
  console.log("🏆 Token #1 owner:", owner1);

  // Deploy solver & solve Challenge #2
  console.log("\n🔧 Deploying solver contract...");
  const Solver = await ethers.getContractFactory("SolveChallenge2");
  const solver = await Solver.connect(deployer).deploy();
  await solver.waitForDeployment();
  console.log("✅ Solver deployed:", await solver.getAddress());

  console.log("\n🥈 Solving Challenge #2...");
  const tx2 = await solver.connect(deployer).callChallenge2(await challenge2.getAddress());
  await tx2.wait();
  
  const owner2 = await nftFlags.ownerOf(2);
  console.log("🏆 Token #2 owner:", owner2);
  console.log("\n🎉 All challenges completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});