require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./smarts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test"
  },
  networks: {
    arbitrum: {
      url: "https://arb-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
      accounts: [process.env.PRIVATE_KEY]
    },
    arbitrumSepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
  apiKey: {
    arbitrumOne: process.env.ARBISCAN_API_KEY,
    arbitrumSepolia: process.env.ARBISCAN_API_KEY
  }
}
};