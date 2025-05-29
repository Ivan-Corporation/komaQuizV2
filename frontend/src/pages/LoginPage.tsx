import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex flex-col justify-center items-center h-screen px-4 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f]">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 text-white"
      >
        <h1 className="text-3xl font-bold text-center glow">KomaQuizV2</h1>

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

        <Button type="submit">Login</Button>
      </motion.form>

      <p className="text-sm text-gray-400 mt-4">
        Don’t have an account?{" "}
        <a href="/register" className="text-indigo-400 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}
