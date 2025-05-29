import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

interface Quiz {
  id: number;
  title: string;
  description: string;
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quizzes");
        setQuizzes(response.data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Available Quizzes</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {quizzes.map((quiz) => (
          <Link to={`/quizzes/${quiz.id}`} key={quiz.id}>
            <div className="bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#2e2e2e] p-6 rounded-2xl transition-all duration-300 shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-gray-400 text-sm">{quiz.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
