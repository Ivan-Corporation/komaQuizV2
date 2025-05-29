import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../UI/Button";
import CyberLoader from "../components/CyberLoader";
import CategoryCard from "../components/CategoryCard";

const categories = [
  {
    name: "Mathematics",
    image: "https://cdn-icons-png.flaticon.com/512/3426/3426679.png",
  },
  {
    name: "Biology",
    image: "https://cdn-icons-png.flaticon.com/512/6037/6037732.png",
  },
  {
    name: "History",
    image: "https://cdn-icons-png.freepik.com/512/2234/2234770.png",
  },
  {
    name: "Computer Science",
    image:
      "https://cdn.iconscout.com/icon/premium/png-256-thumb/computer-science-8437118-6641646.png?f=webp&w=256",
  },
  {
    name: "Geography",
    image: "https://cdn-icons-png.freepik.com/512/9098/9098295.png",
  },
];

const difficultyMap: any = {
  Easy: { count: 3, time: 45 },
  Medium: { count: 5, time: 75 },
  Hard: { count: 8, time: 120 },
};

export default function AIGeneratePage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<any>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<
    "choose" | "loading" | "quiz" | "submitted"
  >("choose");

  const [timeLeft, setTimeLeft] = useState(difficultyMap[difficulty].time);
  const [totalTime, setTotalTime] = useState(difficultyMap[difficulty].time);

  useEffect(() => {
    setNumQuestions(difficultyMap[difficulty].count);
    setTimeLeft(difficultyMap[difficulty].time);
    setTotalTime(difficultyMap[difficulty].time);
  }, [difficulty]);

  useEffect(() => {
    if (viewState !== "quiz") return;
    const timer = setInterval(() => {
      setTimeLeft((prev: any) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [viewState]);

  const handleGenerate = async () => {
    setLoading(true);
    setViewState("loading");
    try {
      const res = await api.post("/generate-quiz", {
        topic,
        num_questions: numQuestions,
      });
      setQuestions(res.data);
      setAnswers(new Array(res.data.length).fill(-1));
      setViewState("quiz");
    } catch {
      alert("Failed to generate quiz");
      setViewState("choose");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const correct = questions.reduce(
      (acc, q: any, i) => acc + (q.correct_index === answers[i] ? 1 : 0),
      0
    );
    setScore(correct);
    setViewState("submitted");

    try {
      await api.post("/submissions/ai", {
        topic,
        questions,
        answers,
        score: correct,
        total_questions: questions.length,
      });
    } catch {
      alert("Failed to submit quiz");
    }
  };

  const renderTimer = () => {
    const percentage = (timeLeft / totalTime) * 100;
    return (
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="absolute inset-0 w-full h-full">
            <circle
              className="text-gray-700"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="48"
              cy="48"
            />
            <circle
              className="text-cyan-400"
              strokeWidth="6"
              strokeDasharray="226"
              strokeDashoffset={226 - (226 * percentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="48"
              cy="48"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-mono text-cyan-400">
            {timeLeft}s
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-white p-6 max-w-4xl mx-auto">
      {viewState === "choose" && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">
            Choose Category
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                name={cat.name}
                image={cat.image}
                selected={topic === cat.name}
                onSelect={() => setTopic(cat.name)}
              />
            ))}
          </div>

          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Select Difficulty</h2>
            <div className="inline-flex rounded-full bg-gray-800 p-1 shadow-md">
              {Object.keys(difficultyMap).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    difficulty === diff
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={!topic}
              className={`transition-all px-6 py-3 rounded-lg font-semibold ${
                !topic
                  ? "!bg-gray-700 text-gray-400 cursor-not-allowed"
                  : " hover:bg-cyan-600 text-white"
              }`}
            >
              Generate Quiz
            </Button>
          </div>
        </>
      )}

      {viewState === "loading" && <CyberLoader />}

      {viewState === "quiz" && (
        <>
          <h2 className="text-2xl mb-2 font-semibold text-center">
            {topic} Quiz
          </h2>
          {renderTimer()}
          <div className="space-y-4">
            {questions.map((q: any, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-[#1a1a1a]">
                <p className="font-semibold mb-2">{q.question}</p>
                {q.options.map((opt: string, i: number) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={answers[idx] === i}
                      onChange={() => {
                        const newAns = [...answers];
                        newAns[idx] = i;
                        setAnswers(newAns);
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button onClick={handleSubmit} disabled={answers.includes(-1)}>
              Submit
            </Button>
          </div>
        </>
      )}

      {viewState === "submitted" && (
        <div className="mt-6">
          <h2 className="text-2xl text-center mb-4">
            You scored {score} out of {questions.length}
          </h2>

          <div className="space-y-4">
            {questions.map((q: any, idx) => {
              const userAnswer = answers[idx];
              const correctIndex = q.correct_index;
              return (
                <div key={idx} className="p-4 border rounded-lg bg-[#1a1a1a]">
                  <p className="font-semibold mb-2">{q.question}</p>
                  {q.options.map((opt: string, i: number) => {
                    const isCorrect = i === correctIndex;
                    const isUserChoice = i === userAnswer;
                    return (
                      <div
                        key={i}
                        className={`p-1 rounded-md ${
                          isCorrect
                            ? "bg-green-700"
                            : isUserChoice
                            ? "bg-red-600"
                            : ""
                        }`}
                      >
                        {opt} {isCorrect && "✅"}
                        {isUserChoice && !isCorrect && "❌"}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <Button
              onClick={() => {
                setViewState("choose");
                setQuestions([]);
                setAnswers([]);
                setScore(0);
                setTimeLeft(difficultyMap[difficulty].time);
              }}
            >
              Back to Categories
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
