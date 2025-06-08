import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";
import QuizList from "./pages/QuizListPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import AIGeneratePage from "./pages/AIGeneratePage";
import AchievementsPage from "./pages/AchievementsPage";



export default function App() {
  const loadUserFromStorage = useAuthStore(
    (state) => state.loadUserFromStorage
  );

  useEffect(() => {
    loadUserFromStorage();
  }, []);
  return (
    <>
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
        </Route>
      </Routes>
    </>
  );
}
