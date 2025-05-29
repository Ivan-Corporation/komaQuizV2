import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function AiAnalyticsDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/analytics").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p className="text-gray-400">Loading analytics...</p>;

  const chartDataAI = data.ai.recent
    .map((item: any) => ({
      date: new Date(item.submitted_at).toLocaleDateString(),
      score: item.score,
      submitted_at: new Date(item.submitted_at),
    }))
    .sort(
      (a: any, b: any) => a.submitted_at.getTime() - b.submitted_at.getTime()
    );

  const chartDataManual = data.manual.recent
    .map((item: any) => ({
      date: new Date(item.submitted_at).toLocaleDateString(),
      score: item.score,
      submitted_at: new Date(item.submitted_at),
    }))
    .sort(
      (a: any, b: any) => a.submitted_at.getTime() - b.submitted_at.getTime()
    );

  const SubmissionCard = ({ item }: { item: any }) => (
    <div className="bg-[#2a2a2a] border border-gray-700 p-4 rounded-lg flex justify-between items-center text-white">
      <div>
        <p className="text-sm font-medium text-indigo-400">
          Submission #{item.id}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(item.submitted_at).toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold">
          {item.correct_answers}/{item.total_questions}
        </p>
        <p className="text-sm text-green-400">Score: {item.score}</p>
      </div>
    </div>
  );

  return (
    <div className="mt-10 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Quiz Stats
          </h3>
          <p className="text-sm text-gray-400 mb-1">
            Total Quizzes:{" "}
            <span className="text-white">{data.ai.total_quizzes}</span>
          </p>
          <p className="text-sm text-gray-400">
            Average Score:{" "}
            <span className="text-white">{data.ai.average_score}%</span>
          </p>
        </div>

        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">
            Manual Quiz Stats
          </h3>
          <p className="text-sm text-gray-400 mb-1">
            Total Quizzes:{" "}
            <span className="text-white">{data.manual.total_quizzes}</span>
          </p>
          <p className="text-sm text-gray-400">
            Average Score:{" "}
            <span className="text-white">{data.manual.average_score}%</span>
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-700">
          <h4 className="text-md font-semibold text-white mb-3">
            AI Quiz Scores Over Time
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartDataAI}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  borderColor: "#444",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-700">
          <h4 className="text-md font-semibold text-white mb-3">
            Manual Quiz Scores Over Time
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartDataManual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  borderColor: "#444",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Recent AI Quiz Submissions
        </h4>
        <div className="space-y-3">
          {data.ai.recent.map((item: any) => (
            <SubmissionCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">
          Recent Manual Quiz Submissions
        </h4>
        <div className="space-y-3">
          {data.manual.recent.map((item: any) => (
            <SubmissionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
