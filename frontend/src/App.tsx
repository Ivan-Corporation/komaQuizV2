import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import { useAuthStore } from "./store/auth";
import { useEffect, useRef } from "react";
import QuizList from "./pages/QuizListPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import AIGeneratePage from "./pages/AIGeneratePage";
import AchievementsPage from "./pages/AchievementsPage";
import toast, { Toaster } from "react-hot-toast";
import { Settings } from "lucide-react";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const loadUserFromStorage = useAuthStore(
    (state) => state.loadUserFromStorage
  );

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenExpired = () => {
      logout();
      navigate("/login");
    };

    window.addEventListener("token-expired", handleTokenExpired);
    return () =>
      window.removeEventListener("token-expired", handleTokenExpired);
  }, [logout]);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      toast(
        "This is a test quiz app running on a Python backend. Source code for Rust and Golang versions coming soon.",
        {
          duration: 5000,
          position: 'bottom-left',
          style: {
            background: "#1f1f1f",
            color: "#f0f0f0",
          },
          icon: "ℹ️",
        }
      );
      toast(
        "You can change the quiz model in settings.",
        {
          duration: 5000,
          position: 'bottom-left',
          style: {
            background: "#1f1f1f",
            color: "#f0f0f0",
          },
          icon: "💡",
        }
      );
      hasShownToast.current = true;
    }
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetailPage />} />
          <Route path="/generate" element={<AIGeneratePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}
