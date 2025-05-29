import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AwardIcon, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const hideOnPaths = ["/login", "/register"];
  const shouldHide = hideOnPaths.includes(location.pathname);

  useEffect(() => {
    if (shouldHide) return;
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [shouldHide]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  if (shouldHide) return null;

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
        >
          komaQuiz
        </h1>

        <div className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] px-3 py-2 rounded-xl transition"
          >
            <User className="text-white" size={20} />
            {user && (
              <span className="hidden sm:inline text-white text-sm truncate max-w-[200px]">
                {user.email}
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
                  onClick={() => navigateToProfile()}
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
    </header>
  );
}
