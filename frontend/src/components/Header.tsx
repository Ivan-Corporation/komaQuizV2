import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show header on authenticated pages
  const hideOnPaths = ['/login', '/register'];
  if (hideOnPaths.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          komaQuiz
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-4 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
