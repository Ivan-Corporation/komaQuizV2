import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../UI/Button";
import CyberLoader from "../components/CyberLoader";
import CategoryCard from "../components/CategoryCard";
import { groupedCategories } from "../utils/groupedCategories";

const difficultyMap: any = {
  Easy: { count: 3, time: 85 },
  Medium: { count: 5, time: 175 },
  Hard: { count: 8, time: 250 },
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = Object.entries(groupedCategories).reduce(
    (acc: any, [group, cats]) => {
      const filtered = cats.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) acc[group] = filtered;
      return acc;
    },
    {}
  );

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
      setTimeLeft((prev: number) => {
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
    const correct = questions.reduce((acc, q: any, i) => {
      const userAns = answers[i];
      if (userAns === -1) return acc; // unanswered does not affect score
      return acc + (q.correct_index === userAns ? 1 : 0);
    }, 0);

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
      <div className="sticky top-0 z-50 bg-[#1a1a1a] py-3 flex justify-center shadow-lg border-b border-cyan-700">
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
          <div className="mb-6">
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

            <div className="text-center mb-8">
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

            <input
              type="text"
              placeholder="Search categories..."
              className="mb-6 w-full p-3 rounded bg-gray-800 text-white border border-cyan-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {Object.entries(filteredCategories).map(([group, cats]: any) => (
              <div key={group} className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">
                  {group}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cats.map((cat: any) => (
                    <div className="relative group">
                      <CategoryCard
                        key={cat.name}
                        name={cat.name}
                        image={cat.image}
                        selected={topic === cat.name}
                        onSelect={() => setTopic(cat.name)}
                        isTrending={cat.trending}
                        isNew={cat.new}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
          <div className="space-y-4 mt-4">
            {questions.map((q: any, idx) => (
              <div
                key={idx}
                className="p-5 border border-gray-700 rounded-xl bg-[#121212] shadow-inner"
              >
                <p className="font-orbitron text-lg text-cyan-300 mb-4 tracking-wide leading-relaxed">
                  {q.question}
                </p>
                <div className="space-y-3">
                  {q.options.map((opt: string, i: number) => {
                    const isSelected = answers[idx] === i;
                    return (
                      <label
                        key={i}
                        className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer 
                    ${
                      isSelected
                        ? "bg-cyan-700/20 border-cyan-400 text-white"
                        : "bg-[#1b1b1b] border-gray-600 hover:border-cyan-500 text-gray-300"
                    }`}
                      >
                        <input
                          type="radio"
                          className="accent-cyan-400 mr-3 scale-125"
                          checked={isSelected}
                          onChange={() => {
                            const newAns = [...answers];
                            newAns[idx] = i;
                            setAnswers(newAns);
                          }}
                        />
                        <span className="text-sm leading-snug">{opt}</span>
                      </label>
                    );
                  })}
                </div>
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
                        className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                          isCorrect
                            ? "bg-green-500/20 border border-green-400 text-green-300"
                            : isUserChoice
                            ? "bg-red-500/20 border border-red-400 text-red-300"
                            : "text-gray-400"
                        }`}
                      >
                        {opt}
                        {isCorrect && " ✅"}
                        {isUserChoice && !isCorrect && " ❌"}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Add this here */}
          <div className="text-center mt-8">
            <Button
              onClick={() => {
                setViewState("choose");
                setQuestions([]);
                setAnswers([]);
                setScore(0);
                setTopic("");
              }}
              className="bg-cyan-700 hover:bg-cyan-600"
            >
              Back to Categories
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
