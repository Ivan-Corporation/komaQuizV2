import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
   <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/quiz" element={<div>Quiz</div>} />
      </Route>
    </Routes>
  );
}
