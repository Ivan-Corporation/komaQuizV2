import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          className="w-full px-4 py-2 border rounded-lg"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-lg"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}
