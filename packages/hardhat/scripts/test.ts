import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const challenge2 = await ethers.getContractAt(
    "Season1Challenge2", 
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );
  const nftFlags = await ethers.getContractAt(
    "Season1NFTFlags",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  console.log("🎮 Testing Challenge 2");
  console.log("Your address:", signer.address);
  
  try {
    await challenge2.justCallMe();
    console.log("✅ Success!");
  } catch (e: unknown) {
    // TypeScript-safe error handling
    let errorStr = "Unknown error";
    
    if (e instanceof Error) {
      errorStr = e.message;
    } else if (typeof e === "string") {
      errorStr = e;
    } else if (typeof e === "object" && e !== null && "message" in e) {
      errorStr = String((e as { message: unknown }).message);
    }
    
    const reasonMatch = errorStr.match(/reverted with reason string '([^']+)'/);
    const reason = reasonMatch ? reasonMatch[1] : errorStr;
    console.log("❌ Reverted:", reason);
  }
}

main().catch(console.error);