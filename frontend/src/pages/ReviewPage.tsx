import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface Submission {
  id: number;
  answers: Record<number, number>;
  correct_answers: number;
  total_questions: number;
  submitted_at: string;
  quiz: Quiz;
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
      <h1 className="text-xl font-bold mb-4">{submission.quiz.title}</h1>
      <p className="text-gray-600 mb-2">
        Submitted: {new Date(submission.submitted_at).toLocaleString()}
      </p>
      <p className="mb-4">
        Score: {submission.correct_answers} / {submission.total_questions}
      </p>

      {submission.quiz.questions.map((question) => (
        <div key={question.id} className="mb-6">
          <p className="font-medium mb-1">{question.text}</p>
          {question.answers.map((answer) => {
            const selectedId = submission.answers[question.id];
            const isCorrect = answer.is_correct;
            const isSelected = answer.id === selectedId;

            const bg = isCorrect
              ? 'bg-green-100 border-green-500'
              : isSelected
              ? 'bg-red-100 border-red-500'
              : 'bg-white';

            return (
              <div key={answer.id} className={`p-2 border rounded mt-1 ${bg}`}>
                {answer.text}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
