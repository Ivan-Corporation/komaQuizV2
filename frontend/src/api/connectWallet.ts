import api from "./axios";

export const connectWalletToBackend = async (wallet_address: string) => {
  try {
    await api.post("/users/me/wallet", {
      wallet_address,
    });
    console.log("Wallet linked with backend.");
  } catch (err) {
    console.error("Failed to link wallet:", err);
  }
};