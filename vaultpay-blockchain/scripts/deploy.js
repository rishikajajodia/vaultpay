const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying VaultPayLedger contract...");

  const VaultPayLedger = await hre.ethers.getContractFactory("VaultPayLedger");
  const ledger = await VaultPayLedger.deploy();
  
  await ledger.waitForDeployment();
  
  const address = await ledger.getAddress();
  
  console.log("✅ VaultPayLedger deployed to:", address);
  console.log("📝 Save this address - you'll need it for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });