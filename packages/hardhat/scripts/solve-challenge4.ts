import { AbiCoder, HDNodeWallet, keccak256, Mnemonic, getBytes } from "ethers";
import { ethers } from "hardhat";
import hre from "hardhat";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";

async function main() {
    const hAccounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;
    const derivationPath = "m/44'/60'/0'/0/12";
    const challenge4Account = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(hAccounts.mnemonic), derivationPath);
    console.log("Account #12 address:", challenge4Account.address);

    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    // Step 1: Create the message (matching Solidity's abi.encode)
    const abiCoder = AbiCoder.defaultAbiCoder();
    const encodedMessage = abiCoder.encode(
        ["string", "address"],
        ["BG CTF Challenge 4", deployer.address]
    );
    
    // Step 2: Hash the message
    const messageHash = keccak256(encodedMessage);
    console.log("Message hash:", messageHash);
    
    // Step 3: Sign with the minter's private key
    const signature = await challenge4Account.signMessage(getBytes(messageHash));
    console.log("Signature:", signature);

}

main().catch(console.error);