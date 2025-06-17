const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const XPToken = await hre.ethers.getContractFactory("XPToken");
  const xpToken = await XPToken.deploy("1000000000000000000000000"); // 1 million tokens with 18 decimals
  await xpToken.waitForDeployment();
  console.log("XPToken deployed to:", await xpToken.getAddress());

  const AchievementSBT = await hre.ethers.getContractFactory("AchievementSBT");
  const achievementSBT = await AchievementSBT.deploy(deployer.address); // pass required constructor param
  await achievementSBT.waitForDeployment();
  console.log("AchievementSBT deployed to:", await achievementSBT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
