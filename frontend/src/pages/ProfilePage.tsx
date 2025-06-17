import { useEffect, useState, type Key } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import AiAnalyticsDashboard from "../components/AiAnalyticsDashboard";
import { motion, useAnimation } from "framer-motion";
import { useUserInfo } from "../hooks/useUserInfo"; // make sure path is correct
import { useAppKitAccount } from "@reown/appkit/react";
import { useTokenBalance } from "../hooks/useTokenBalance";
import tokenIcon from "../assets/KOMQ.svg";


interface Submission {
  id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  submitted_at: string;
}

const parseAchievement = (key: string) => {
  if (key.startsWith("First Quiz: ")) {
    const topic = key.split(": ")[1];
    return {
      icon: "🟢",
      label: `First Quiz in ${topic}`,
      description: `You completed your first ${topic} quiz!`,
    };
  }

  if (key.startsWith("Perfect Score: ")) {
    const topic = key.split(": ")[1];
    return {
      icon: "💯",
      label: `Perfect Score in ${topic}`,
      description: `You answered every question correctly in a ${topic} quiz.`,
    };
  }

  if (key === "Novice") {
    return {
      icon: "🧠",
      label: "Novice",
      description: "Earned 100+ total experience points.",
    };
  }

  if (key.startsWith("Expert in ")) {
    const topic = key.split("Expert in ")[1];
    return {
      icon: "📘",
      label: `Expert in ${topic}`,
      description: `Earned 300+ XP in ${topic}.`,
    };
  }

  if (key.startsWith("Master of ")) {
    const topic = key.split("Master of ")[1];
    return {
      icon: "🏅",
      label: `Master of ${topic}`,
      description: `Earned 500+ XP in ${topic}.`,
    };
  }

  return {
    icon: "✨",
    label: key,
    description: "You unlocked a special achievement!",
  };
};

export default function ProfilePage() {
  const user = useUserInfo();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAppKitAccount();
  const balance = useTokenBalance(user?.wallet_address);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.3, 1],
      transition: { duration: 1.5, repeat: Infinity, repeatType: "loop" },
    });
  }, [controls]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get("/users/me/submissions");
        setSubmissions(res.data);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">My Quiz History</h1>

      {loading || !user ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mb-6 p-6 rounded-xl bg-[#1f1f1f] border border-gray-700 text-white shadow-md"
          >


            {/* Profile Info */}
            <div className="space-y-2 max-w-full">
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <span className="font-medium text-white">Wallet:</span>{" "}
                {isConnected ? (
                  <>
                    <span className="text-green-400 truncate max-w-[160px]">
                      {address}
                    </span>
                    <span className="bg-green-600 text-white text-[8px] px-2 py-0.5 rounded-full">
                      Connected
                    </span>
                  </>
                ) : (
                  <span className="bg-red-600 text-white text-[8px] px-2 py-0.5 rounded-full">
                    Disconnected
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Email:</span>{" "}
                {user.email}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Joined:</span>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Level:</span>{" "}
                {user.level}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">XP:</span>{" "}
                {user.experience_points}
              </p>
            </div>

                        {/* Tokens Block */}
            <motion.div
              animate={{
                background:
                  "linear-gradient(135deg, #4f39f6, #4b0082, #1e3c72, #1e40af)", // dark purple-blue gradient
                boxShadow: "0 0 10px #4b0082, 0 0 20px #1e3c72",
              }}
              whileHover={{
                boxShadow: "0 0 30px #7e5bef, 0 0 60px #00d2ff",
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              className="md:absolute md:top-4 md:right-4 flex items-center gap-3 px-5 py-3 rounded-2xl cursor-default select-none mt-4 md:mt-0 mb-2"
              style={{ minWidth: "160px" }}
            >
              <img src={tokenIcon} alt="KOMQ Token Icon" className="w-12 h-12" />
              <div>
                <div className="text-xs uppercase font-semibold tracking-widest text-white/80">
                  KOMQ Tokens
                </div>
                <motion.div
                  animate={controls}
                  className="lg:text-3xl text-base font-extrabold text-white leading-none"
                >
                  {balance}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Achievements */}
          {user.achievements && user.achievements.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.achievements.map(
                  (key: string, idx: Key | null | undefined) => {
                    const ach = parseAchievement(key);
                    const isLatest = idx === user.achievements.length - 1;

                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl p-4 border border-gray-700 text-white bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] shadow-md hover:scale-[1.015] transition-transform duration-200 ${
                          isLatest
                            ? "ring-2 ring-purple-500/60 shadow-purple-500/40 animate-pulse"
                            : ""
                        }`}
                      >
                        <div className="text-2xl mb-2">{ach.icon}</div>
                        <p className="font-medium">{ach.label}</p>
                        <p className="text-sm text-gray-400">
                          {ach.description}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          <AiAnalyticsDashboard />

          {submissions.length === 0 ? (
            <div className="text-gray-400 mt-4 text-sm border border-gray-700 rounded-xl p-4 bg-[#1f1f1f]">
              You haven’t completed any quizzes yet. Once you do, your quiz
              history will appear here.
            </div>
          ) : (
            <div className="py-6">
              <div className="space-y-4  pb-6 h-[400px] overflow-y-auto">
                {submissions.map((submission) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 rounded-xl bg-[#262626] border border-gray-700 flex justify-between items-center text-white"
                  >
                    <div>
                      <p className="font-semibold">
                        Quiz ID: {submission.quiz_id}
                      </p>
                      <p className="text-sm text-gray-400">
                        Score: {submission.correct_answers} /{" "}
                        {submission.total_questions}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-indigo-400 hover:underline text-sm cursor-not-allowed">
                      Review (coming soon (never))
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
