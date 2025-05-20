import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

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
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">My Quiz History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No quiz attempts yet.</p>
      ) : (
        <div className="space-y-4">
          {user && (
            <div className="mb-8 p-4 bg-gray-100 rounded shadow">
              <h2 className="text-xl font-semibold mb-1">Profile</h2>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Account created:</span>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Quiz ID: {submission.quiz_id}</p>
                <p className="text-sm text-gray-600">
                  Score: {submission.correct_answers} /{" "}
                  {submission.total_questions}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted:{" "}
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
              <Link
                to={`/review/${submission.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Review
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
