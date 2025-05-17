import { useEffect, useState } from "react";
import api from "../api/axios";

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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-gray-600 mt-2">{quiz.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
