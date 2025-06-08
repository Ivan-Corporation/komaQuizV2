import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { AwardIcon, LogOut, User, Github } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserInfo } from "../hooks/useUserInfo";
import { connectWalletToBackend } from "../api/connectWallet";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInfo: any = useUserInfo();

  const hideOnPaths = ["/login", "/register"];
  const shouldHide = hideOnPaths.includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

const { address } = useAppKitAccount();

// console.log("🔗 useAppKitAccount:", address, isConnected, caipAddress, status, embeddedWalletInfo);

useEffect(() => {
  const walletAddress = address;

  if (walletAddress && userInfo?.wallet_address !== walletAddress) {
    console.log("🔗 Linking wallet via useAppKit:", walletAddress);
    connectWalletToBackend(walletAddress);
  }
}, [address, userInfo?.wallet_address]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  if (shouldHide) return null;

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1
            onClick={() => navigate("/")}
            className="md:text-2xl text-sm font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
          >
            komaQuiz
          </h1>
          <a
            href="https://github.com/Ivan-Corporation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-gray-400 transition"
            title="GitHub - Ivan Corporation"
          >
            <Github size={20} />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <appkit-button />
          </div>
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] px-3 py-2 rounded-xl transition"
            >
              <User className="text-white" size={20} />
              {userInfo && (
                <span className="hidden sm:inline text-white text-sm truncate ">
                  {userInfo?.email}{" "}
                  <span className="text-gray-400 ml-1">
                    (Lv. {userInfo.level})
                  </span>
                </span>
              )}
            </div>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-40 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <div
                    onClick={navigateToProfile}
                    className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm text-white transition cursor-pointer"
                  >
                    <AwardIcon size={16} /> Profile
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-red-600 text-sm text-white transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
