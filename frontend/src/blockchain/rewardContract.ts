import { createPublicClient, createWalletClient, custom, http } from "viem";
import { arbitrum } from "viem/chains";
import achievementSBTArtifact from "../blockchain/AchievementSBT.json";
import tokenArtifact from "./XPToken.json";
import { BrowserProvider, Contract, parseUnits } from "ethers";

const tokenAddress = "0x8B0A9416bE294804A773A5d64E0C469FBCcfc5dd";
const contractAbi = achievementSBTArtifact.abi;
const TokenAbi = tokenArtifact.abi;

// Replace with your deployed contract
export const CONTRACT_ADDRESS = "0xD5EA29d17A8ad6359b64Dee8994AF9250B4d86B9";

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

export const mintRewardTokens = async (to: string, amount: number) => {
  if (!window.ethereum) throw new Error("No wallet found");
  //   @ts-ignore
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new Contract(tokenAddress, TokenAbi, signer);

  const tx = await contract.mint(to, parseUnits(String(amount), 18));
  await tx.wait();

  return tx.hash;
};

export const mintAchievement = async (
  userAddress: `0x${string}`,
  achievement: string,
  metadataUri: string
) => {
  const walletClient = createWalletClient({
    chain: arbitrum,
    // @ts-ignore
    transport: custom(window.ethereum),
  });

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: "mint",
    args: [userAddress, achievement, metadataUri],
    account: userAddress,
  });

  const txHash = await walletClient.writeContract(request);
  return txHash;
};
