import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Submission {
  id: number;
  answers: Record<number, number>;
  correct_answers: number;
  total_questions: number;
  submitted_at: string;
  quiz?: {
    title: string;
    questions: {
      id: number;
      text: string;
      answers: {
        id: number;
        text: string;
        is_correct: boolean;
      }[];
    }[];
  };
  ai_questions?: {
    question: string;
    options: string[];
    correct_index: number;
  }[];
}

export default function ReviewPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get(`/submissions/${id}`);
        setSubmission(res.data);
      } catch (err) {
        console.error('Failed to fetch submission:', err);
      }
    };
    fetchSubmission();
  }, [id]);

  if (!submission) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">
        {submission.quiz?.title ?? 'AI Generated Quiz'}
      </h1>
      <p className="text-gray-600 mb-2">
        Submitted: {new Date(submission.submitted_at).toLocaleString()}
      </p>
      <p className="mb-4">
        Score: {submission.correct_answers} / {submission.total_questions}
      </p>

      {/* AI QUIZ REVIEW */}
      {submission.ai_questions &&
        submission.ai_questions.map((q, idx) => {
          const selected = submission.answers[idx];
          return (
            <div key={idx} className="mb-6">
              <p className="font-medium mb-1">
                {idx + 1}. {q.question}
              </p>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct_index;
                const isSelected = i === selected;
                const bg = isCorrect
                  ? 'bg-green-100 border-green-500'
                  : isSelected
                  ? 'bg-red-100 border-red-500'
                  : 'bg-white';

                return (
                  <div key={i} className={`p-2 border rounded mt-1 ${bg}`}>
                    {opt}
                  </div>
                );
              })}
            </div>
          );
        })}

      {/* NORMAL QUIZ REVIEW */}
      {submission.quiz &&
        submission.quiz.questions.map((q) => {
          const selectedId = submission.answers[q.id];
          return (
            <div key={q.id} className="mb-6">
              <p className="font-medium mb-1">{q.text}</p>
              {q.answers.map((a) => {
                const isCorrect = a.is_correct;
                const isSelected = a.id === selectedId;

                const bg = isCorrect
                  ? 'bg-green-100 border-green-500'
                  : isSelected
                  ? 'bg-red-100 border-red-500'
                  : 'bg-white';

                return (
                  <div key={a.id} className={`p-2 border rounded mt-1 ${bg}`}>
                    {a.text}
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
