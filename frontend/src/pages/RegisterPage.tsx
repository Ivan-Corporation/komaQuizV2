import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen px-4 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f]">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 text-white"
      >
        <h1 className="text-3xl font-bold text-center">Register</h1>

        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md text-sm border border-red-400/30">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail size={18} />}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
          isPassword
        />

        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Register
        </Button>
      </motion.form>

      <p className="text-sm text-gray-400 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-400 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
