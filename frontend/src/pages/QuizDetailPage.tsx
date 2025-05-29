import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Button from '../UI/Button';

interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface SubmissionResult {
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  correctAnswers: { [questionId: number]: number };
}

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error('Failed to fetch quiz', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (started && startTime !== null) {
      timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, startTime]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const answers = Object.entries(selectedAnswers).map(([question_id, answer_id]) => ({
      question_id: Number(question_id),
      answer_id,
    }));

    try {
      const res = await api.post(`/quizzes/${quiz.id}/submit`, { answers });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!quiz) return <div className="p-4 text-red-500">Quiz not found.</div>;

  if (submitted && result) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-[#1a1a1a] text-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-lg">Score: {result.correct_answers} / {result.total_questions}</p>
        <p className="text-lg font-semibold text-green-400 mt-2">Percentage: {result.score_percent}%</p>
        <p className="text-lg mb-6">Time taken: {timeElapsed} seconds</p>

        <div className="text-left mt-6 space-y-4">
          {quiz.questions.map((question) => (
            <div key={question.id}>
              <p className="font-medium">{question.text}</p>
              {question.answers.map((answer) => {
                const isSelected = selectedAnswers[question.id] === answer.id;
                const isCorrect = result.correctAnswers?.[question.id] === answer.id;

                const classNames = [
                  'p-2 rounded border mt-1',
                  isCorrect ? 'bg-green-100 border-green-500 text-green-800' : '',
                  isSelected && !isCorrect ? 'bg-red-100 border-red-500 text-red-800' : '',
                ].join(' ');

                return (
                  <div key={answer.id} className={classNames}>
                    {answer.text}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <Button className="mt-6 w-auto" onClick={() => window.location.reload()}>
          Retry Quiz
        </Button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-[#1a1a1a] text-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-400 mb-6">{quiz.description}</p>
        <Button onClick={() => {
          setStarted(true);
          setStartTime(Date.now());
        }}>
          Start Quiz
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-[#1a1a1a] text-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </h2>
        <span className="text-sm text-gray-400">Time: {timeElapsed}s</span>
      </div>

      <p className="text-xl mb-4">{currentQuestion.text}</p>

      <div className="space-y-2">
        {currentQuestion.answers.map((answer) => (
          <div
            key={answer.id}
            onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
            className={`p-3 border rounded cursor-pointer transition ${
              selectedAnswers[currentQuestion.id] === answer.id
                ? 'bg-indigo-100 border-indigo-600 text-indigo-900'
                : 'hover:bg-gray-800 border-gray-600'
            }`}
          >
            {answer.text}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 space-x-4">
        <Button
          className="bg-gray-600 hover:bg-gray-500 w-auto"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button
            className="bg-green-600 hover:bg-green-700 w-auto"
            onClick={handleSubmit}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            className="w-auto"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
