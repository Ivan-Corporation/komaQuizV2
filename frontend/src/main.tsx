import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import { AuthProvider } from "./context/AuthContext.tsx";
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrum, mainnet } from '@reown/appkit/networks'

useAuthStore.getState().loadUserFromStorage();



const projectId = 'dda5e44610d2ff16e9dd43db383e963e';

const networks = [arbitrum, mainnet];

const metadata = {
  name: 'KomaQuizV2',
  description: 'AppKit Example',
  url: window.location.origin,
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

createAppKit({
  adapters: [new EthersAdapter()],
  // @ts-expect-error types problem
  networks,
  metadata,
  projectId,
  features: {
    analytics: true
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
