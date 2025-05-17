import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";
import QuizList from "./pages/QuizList";
import QuizDetailPage from "./pages/QuizDetailPage";

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
          <Route path="/" element={<div>Dashboard</div>} />
           <Route path="/quizzes" element={<QuizList />} />
           <Route path="/quizzes/:id" element={<QuizDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}
