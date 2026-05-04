import { ethers, keccak256, toUtf8Bytes } from "ethers";

// Contract address from deployment
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Local Hardhat network
const RPC_URL = "http://127.0.0.1:8545";

// Contract ABI — updated to use bytes32 for recipient
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "recipient",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "method",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TransactionLogged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_recipient",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_method",
        type: "string",
      },
    ],
    name: "logTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getTransactionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

/**
 * Log a transaction to the blockchain — with hashing
 */
export async function logTransactionToBlockchain(
  recipient: string,
  amount: number,
  method: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Connect to local Hardhat node
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Get signer (first account from Hardhat node)
    const signer = await provider.getSigner(0);

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Convert amount to wei (multiply by 10^18 for precision)
    const amountInWei = ethers.parseUnits(amount.toString(), 18);

    // Hash the recipient before sending it to blockchain
    const hashedRecipient = keccak256(toUtf8Bytes(recipient));

    console.log("🧩 Hashed recipient:", hashedRecipient);

    console.log("📝 Logging transaction to blockchain...");
    console.log({
      recipient: hashedRecipient,
      amount: amountInWei.toString(),
      method,
    });

    // Call smart contract function
    const tx = await contract.logTransaction(hashedRecipient, amountInWei, method);

    console.log("⏳ Transaction submitted:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
    };
  } catch (error) {
    console.error("❌ Blockchain logging failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown blockchain error",
    };
  }
}

/**
 * Get total transaction count from blockchain
 */
export async function getBlockchainTransactionCount(): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const count = await contract.getTransactionCount();
    return Number(count);
  } catch (error) {
    console.error("❌ Failed to get transaction count:", error);
    return 0;
  }
}

/**
 * Check if blockchain is connected
 */
export async function isBlockchainConnected(): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    await provider.getNetwork();
    return true;
  } catch (error) {
    console.error("❌ Blockchain not connected:", error);
    return false;
  }
}
