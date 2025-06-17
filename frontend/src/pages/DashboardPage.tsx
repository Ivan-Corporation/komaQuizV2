import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  User,
  BrainCircuit,
  Trophy,
  TrophyIcon,
  Users,
  Settings,
} from "lucide-react";
import Button from "../UI/Button";
import { useUserInfo } from "../hooks/useUserInfo";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const userInfo = useUserInfo();
  const userLevel = userInfo?.level || 0;



  const actions = [
    {
      to: "/generate",
      icon: <BrainCircuit size={32} className="text-green-400" />,
      title: "AI-powered Quiz",
      desc: "Dive into AI-powered quizzes",
      locked: false,
    },

    {
      to: "/profile",
      icon: <User size={32} className="text-blue-400" />,
      title: "Profile",
      desc: "Manage your account, achievements, and quiz history",
      locked: false,
    },

    {
      to: "/achievements",
      icon: <TrophyIcon size={32} className="text-yellow-400" />,
      title: "Achievements",
      desc: "Achievements description and rewards",
      locked: false,
    },
    {
      to: "/settings",
      icon: <Settings size={32} className="text-purple-400" />,
      title: "Settings",
      desc: "Change quiz model, settings, and more",
      locked: false,
    },
    {
      to: "/quizzes",
      icon: <Sparkles size={32} className="text-indigo-400" />,
      title: "Start Quiz",
      desc: "Hardcore manual quizzes",
      locked: userLevel < 100,
      lockNote: "Level 100 required",
    },
    {
      to: "/leaderboard",
      icon: <Users size={32} className="text-purple-400" />,
      title: "Leaderboard",
      desc: "Top scorers in the community",
      locked: true,
      lockNote: "Locked",
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
        {actions.map((action, idx) => {
          const isAIQuiz = action.title === "AI-powered Quiz";

          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 0 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={!action.locked ? { scale: 1.05 } : {}}
              className={`relative p-6 rounded-2xl border shadow-md flex flex-col items-start justify-between space-y-4 transition duration-300 ${
                action.locked
                  ? "opacity-40 pointer-events-none bg-[#1f1f1f] border-gray-700"
                  : isAIQuiz
                  ? "bg-gradient-to-br from-[#111827] via-[#1e3a8a] to-[#0f172a] border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] card-shine"
                  : "bg-[#1f1f1f] border-gray-700 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
              }`}
            >
              {isAIQuiz && (
                <span className="absolute top-3 right-3 bg-indigo-600 text-xs px-2 py-1 rounded-md font-semibold shadow-md">
                  ⚡ Recommended
                </span>
              )}

              <div className="flex items-center gap-2">
                {action.icon}
                {action.locked && (
                  <span className="text-xs text-red-500 font-semibold">
                    🔒 {action.lockNote}
                  </span>
                )}
              </div>

              <div>
                <h2
                  className={`text-xl font-semibold ${
                    isAIQuiz ? "text-indigo-300" : ""
                  }`}
                >
                  {action.title}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isAIQuiz
                    ? "Let AI craft a quiz tailored to your skills"
                    : action.desc}
                </p>
              </div>

              {action.locked ? (
                <button
                  className="w-full bg-gray-700 text-gray-400 py-2 px-4 rounded-md cursor-not-allowed"
                  disabled
                >
                  Locked
                </button>
              ) : (
                <Link to={action.to} className="w-full">
                  <Button
                    className={`w-full ${
                      isAIQuiz ? "bg-indigo-600 hover:bg-indigo-500" : ""
                    }`}
                  >
                    {action.title}
                  </Button>
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
