import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DEFAULT_MODEL_API_URL =
  "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta/v1/chat/completions";
const DEFAULT_MODEL_NAME = "HuggingFaceH4/zephyr-7b-beta";

const DEFAULT_PROMPT_TEMPLATE = `Create {count} multiple choice quiz questions about '{topic}'.
Format:
Q: [question]
A. Option A
B. Option B
C. Option C
D. Option D
Answer: [A/B/C/D]

Start now:
`;

const difficultyMap: any = {
  Easy: { count: 3, time: 85 },
  Medium: { count: 5, time: 175 },
  Hard: { count: 8, time: 250 },
};

export default function SettingsPage() {
  const [modelApiUrl, setModelApiUrl] = useState(DEFAULT_MODEL_API_URL);
  const [modelName, setModelName] = useState(DEFAULT_MODEL_NAME);
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [difficulty, setDifficulty] = useState("Easy");
  const [hfToken, setHfToken] = useState("");

  useEffect(() => {
    const savedApiUrl = localStorage.getItem("quizModelApiUrl");
    const savedModelName = localStorage.getItem("quizModelName");
    const savedPrompt = localStorage.getItem("quizPromptTemplate");
    const savedDifficulty = localStorage.getItem("quizDifficulty");
    const savedToken = localStorage.getItem("hfToken");

    if (savedApiUrl) setModelApiUrl(savedApiUrl);
    if (savedModelName) setModelName(savedModelName);
    if (savedPrompt) setPromptTemplate(savedPrompt);
    if (savedDifficulty && difficultyMap[savedDifficulty])
      setDifficulty(savedDifficulty);
    if (savedToken) setHfToken(savedToken);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("quizModelApiUrl", modelApiUrl);
    localStorage.setItem("quizModelName", modelName);
    localStorage.setItem("quizPromptTemplate", promptTemplate);
    localStorage.setItem("quizDifficulty", difficulty);
    localStorage.setItem("hfToken", hfToken);
    toast.success("✅ Settings saved!");
  };

  const resetDefaults = () => {
    setModelApiUrl(DEFAULT_MODEL_API_URL);
    setModelName(DEFAULT_MODEL_NAME);
    setPromptTemplate(DEFAULT_PROMPT_TEMPLATE);
    setDifficulty("Easy");
    setHfToken("");
    toast("🔄 Settings reset to defaults");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-6 bg-[#111827] text-white rounded-2xl shadow-2xl space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-400">
        AI Quiz Generator Settings
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">🧠 Model Configuration</h2>

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-400">
            Model API URL
          </span>
          <input
            type="text"
            value={modelApiUrl}
            onChange={(e) => setModelApiUrl(e.target.value)}
            className="w-full mt-2 p-3 rounded-lg bg-[#1f2937] border border-gray-700 text-white"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-400">Model Name</span>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full mt-2 p-3 rounded-lg bg-[#1f2937] border border-gray-700 text-white"
            placeholder="e.g. deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-400">
            Your Hugging Face Token:
          </span>
          <input
            type="password"
            value={hfToken}
            onChange={(e) => setHfToken(e.target.value)}
            className="w-full mt-1 p-3 rounded bg-[#1b1b1b] border border-gray-700 text-white"
            placeholder="hf_..."
          />
        </label>

        <div className="text-xs text-gray-400 mt-1">
          <span className="italic">
            Your token will only be used locally to access your Hugging Face
            account. You can get it from{" "}
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              huggingface.co/settings/tokens
            </a>
            .
          </span>
        </div>

        <label className="block mb-5">
          <span className="text-sm font-medium text-gray-400">
            Prompt Template
          </span>
          <textarea
            rows={6}
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            className="w-full mt-2 p-3 rounded-lg bg-[#1f2937] border border-gray-700 text-white font-mono"
          />
        </label>
      </section>

      <section className="bg-[#1e293b] border border-cyan-700 p-6 rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">
          💡 Prompt Writing Tips
        </h3>
        <ul className="list-disc ml-5 space-y-1 text-sm text-gray-300">
          <li>
            Be specific with the subject (e.g., "space exploration in the
            1960s").
          </li>
          <li>
            Clarify output format, especially for structured data (e.g., "MCQ
            with A-D options").
          </li>
          <li>Indicate the number of items/questions expected.</li>
          <li>
            Use delimiters like `Start now:` to separate instructions from
            expected output.
          </li>
        </ul>
      </section>

      <section className="bg-[#1e1e1e] border border-indigo-700 p-6 rounded-lg text-sm space-y-4">
        <h3 className="text-lg font-semibold text-indigo-400">
          📦 Model API Example
        </h3>
        <p>
          Use any model from Hugging Face that supports chat/completion.
          Example:
        </p>
        <code className="block bg-black p-3 rounded-lg text-green-400 overflow-auto">
          {`https://router.huggingface.co/hf-inference/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B/v1/chat/completions`}
        </code>

        <p className="text-gray-400">Example Python code using requests:</p>
        <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto text-xs">
          {`import os, requests

API_URL = "https://router.huggingface.co/hf-inference/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B/v1/chat/completions"
headers = { "Authorization": f"Bearer YOUR_HF_TOKEN" }

payload = {
  "messages": [{"role": "user", "content": "What is the capital of France?"}],
  "model": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
}

response = requests.post(API_URL, headers=headers, json=payload)
print(response.json())`}
        </pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          🎯 Default Difficulty Level
        </h2>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1f2937] border border-gray-700 text-white"
        >
          {Object.keys(difficultyMap).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </section>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
        <button
          onClick={saveSettings}
          className="bg-indigo-500 hover:bg-indigo-400 transition px-6 py-2 rounded-lg text-white font-semibold"
        >
          💾 Save Settings
        </button>
        <button
          onClick={resetDefaults}
          className="bg-gray-700 hover:bg-gray-600 transition px-6 py-2 rounded-lg text-white font-semibold"
        >
          🔄 Reset to Defaults
        </button>
      </div>
    </div>
  );
}
