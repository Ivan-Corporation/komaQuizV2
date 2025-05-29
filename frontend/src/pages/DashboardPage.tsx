import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, User, BrainCircuit } from "lucide-react";
import Button from "../UI/Button";

export default function Dashboard() {
  const actions = [
    {
      to: "/quizzes",
      icon: <Sparkles size={32} className="text-indigo-400" />,
      title: "Start Quiz",
      desc: "Dive into AI-powered quizzes",
    },
    {
      to: "/generate",
      icon: <BrainCircuit size={32} className="text-green-400" />,
      title: "Generate Quiz",
      desc: "Create your own smart quizzes",
    },
    {
      to: "/profile",
      icon: <User size={32} className="text-yellow-400" />,
      title: "Profile",
      desc: "Manage your account & stats",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] px-6 py-10 flex flex-col items-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10"
      >
        Welcome to KomaquizV2 🚀
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {actions.map((action, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#1f1f1f] border border-gray-700 p-6 rounded-2xl shadow-md flex flex-col items-start justify-between space-y-4 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)] transition"
          >
            <div>{action.icon}</div>
            <div>
              <h2 className="text-xl font-semibold">{action.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{action.desc}</p>
            </div>
            <Link to={action.to} className="w-full">
              <Button className="w-full">{action.title}</Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
