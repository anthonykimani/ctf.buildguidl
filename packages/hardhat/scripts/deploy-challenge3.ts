import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    // Real deployed contract addresses
    const CHALLENGE3_ADDRESS = "0x03bF70f50fcF9420f27e31B47805bbd8f2f52571";
    const NFTFLAGS_ADDRESS = "YOUR_NFTFLAGS_ADDRESS"; // Add this if you want to verify

    console.log("🔗 Deployer:", deployer.address);
    console.log("🎯 Challenge #3:", CHALLENGE3_ADDRESS);

    // Deploy the solver contract (this automatically solves the challenge!)
    console.log("\n🔧 Deploying solver contract...");
    const SolverFactory = await ethers.getContractFactory("SolveChallenge3");
    const solver = await SolverFactory.connect(deployer).deploy(CHALLENGE3_ADDRESS);
    await solver.waitForDeployment();

    const solverAddress = await solver.getAddress();
    console.log("✅ Solver deployed:", solverAddress);

    // Get the deployment transaction receipt
    const deployTx = solver.deploymentTransaction();
    if (deployTx) {
        const receipt = await deployTx.wait();
        console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);
        console.log("📤 Transaction hash:", deployTx.hash);
    }

    // Optional: Verify the NFT was minted
    if (NFTFLAGS_ADDRESS !== "YOUR_NFTFLAGS_ADDRESS") {
        console.log("\n🔍 Verifying NFT ownership...");
        const nftFlags = await ethers.getContractAt("Season1NFTFlags", NFTFLAGS_ADDRESS);
        try {
            const owner = await nftFlags.ownerOf(3);
            console.log("🏆 Token #3 owner:", owner);
            if (owner.toLowerCase() === deployer.address.toLowerCase()) {
                console.log("✅ You successfully minted the flag!");
            }
        } catch (error) {
            console.log("⚠️  Could not verify token ownership");
        }
    }

    console.log("\n🎉 Challenge #3 solved!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});