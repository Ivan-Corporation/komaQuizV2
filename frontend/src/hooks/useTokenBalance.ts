import { useEffect, useState } from "react";
import { ethers } from "ethers";
import tokenArtifact from "../blockchain/XPToken.json";
import { BrowserProvider } from "ethers";

const tokenAddress = "0x8B0A9416bE294804A773A5d64E0C469FBCcfc5dd";
const TokenAbi = tokenArtifact.abi;

export const useTokenBalance = (wallet: string | undefined) => {
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet || !window.ethereum) return;
       //   @ts-ignore
      const provider = new BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, TokenAbi, provider);
      const raw = await contract.balanceOf(wallet);
      setBalance(ethers.formatUnits(raw, 18));
    };
    fetchBalance();
  }, [wallet]);

  return balance;
};
