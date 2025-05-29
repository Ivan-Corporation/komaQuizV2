import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import AiAnalyticsDashboard from "../components/AiAnalyticsDashboard";
import { motion } from "framer-motion";

interface Submission {
  id: number;
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  submitted_at: string;
}

interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  level: number;
  experience_points: number;
  achievements?: string[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndSubmissions = async () => {
      try {
        const [userRes, submissionsRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/users/me/submissions"),
        ]);
        setUser(userRes.data);
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSubmissions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">My Quiz History</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-6 rounded-xl bg-[#1f1f1f] border border-gray-700 text-white shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
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
            </motion.div>
          )}
          {user?.achievements && user.achievements.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-white mb-1">
                Achievements
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {user.achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
          <AiAnalyticsDashboard />

          {submissions.length === 0 ? (
            <p className="text-gray-400 mt-4">No quiz attempts yet.</p>
          ) : (
            <div className="space-y-4 mt-6">
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
                  <Link
                    to={`/review/${submission.id}`}
                    className="text-indigo-400 hover:underline text-sm"
                  >
                    Review
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
