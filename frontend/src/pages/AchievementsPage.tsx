import { useUserInfo } from "../hooks/useUserInfo";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// You can extract this from your groupedCategories if desired
const TOPICS = [
  "History",
  "Geography",
  "Mathematics",
  "Physics",
  "Biology",
  "Chemistry",
  "Space Science",
  "Technology",
  "Engineering",
  "Data Science",
  "Computer Science",
  "Psychology",
  "Philosophy",
  "Politics",
  "Economics",
  "Languages",
  "Mythology",
  "Literature",
  "Art & Design",
  "Music",
  "Film & TV",
  "Pop Culture",
  "Fashion",
  "Video Games",
  "Game History",
  "Esports",
  "Board Games",
  "Minecraft",
  "Fortnite",
  "Nintendo",
  "Retro Games",
  "Sports",
  "Environment",
  "Logic & Riddles",
  "Trivia & General",
  "Fun Facts",
];

// Generate achievements dynamically
const ALL_ACHIEVEMENTS = [
  "Novice",
  ...TOPICS.flatMap((topic) => [
    `First Quiz: ${topic}`,
    `Perfect Score: ${topic}`,
    `Expert in ${topic}`,
    `Master of ${topic}`,
  ]),
];

const parseAchievement = (key: string) => {
  if (key.startsWith("First Quiz: ")) {
    const topic = key.split(": ")[1];
    return {
      icon: "🟢",
      label: `First Quiz in ${topic}`,
      description: `You completed your first ${topic} quiz!`,
      type: "Topic",
    };
  }

  if (key.startsWith("Perfect Score: ")) {
    const topic = key.split(": ")[1];
    return {
      icon: "💯",
      label: `Perfect Score in ${topic}`,
      description: `You answered every question correctly in a ${topic} quiz.`,
      type: "Topic",
    };
  }

  if (key === "Novice") {
    return {
      icon: "🧠",
      label: "Novice",
      description: "Earned 100+ total experience points.",
      type: "General",
    };
  }

  if (key.startsWith("Expert in ")) {
    const topic = key.replace("Expert in ", "");
    return {
      icon: "📘",
      label: `Expert in ${topic}`,
      description: `Earned 300+ XP in ${topic}.`,
      type: "Tier",
    };
  }

  if (key.startsWith("Master of ")) {
    const topic = key.replace("Master of ", "");
    return {
      icon: "🏅",
      label: `Master of ${topic}`,
      description: `Earned 500+ XP in ${topic}.`,
      type: "Tier",
    };
  }

  return {
    icon: "✨",
    label: key,
    description: "You unlocked a special achievement!",
    type: "General",
  };
};

export default function AchievementPage() {
  const user = useUserInfo();
  const unlocked = user?.achievements || [];

  const grouped = {
    General: [] as any[],
    Topic: [] as any[],
    Tier: [] as any[],
  };

  ALL_ACHIEVEMENTS.forEach((key) => {
    const ach = parseAchievement(key);
    grouped[ach.type as keyof typeof grouped].push({
      ...ach,
      id: key,
      unlocked: unlocked.includes(key),
    });
  });

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f] text-white">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-10 text-center"
        >
          🏆 All Achievements
        </motion.h1>

        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
              {section === "General"
                ? "🌟 General Achievements"
                : section === "Topic"
                ? "📚 Topic-Based Achievements"
                : "⚡ XP Tier Achievements"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((ach, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`relative p-5 rounded-xl border text-white shadow-md transition-transform duration-200 ${
                    ach.unlocked
                      ? "bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-800 border-indigo-400 hover:scale-[1.02]"
                      : "bg-[#1f1f1f]/40 backdrop-blur border-gray-700 opacity-60"
                  }`}
                >
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <p className="font-medium text-lg">{ach.label}</p>
                  <p className="text-sm text-gray-300">{ach.description}</p>
                  {!ach.unlocked && (
                    <p className="text-xs mt-2 text-red-400 font-semibold">
                      🔒 Locked
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 text-center">
          <Link to="/profile">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md transition">
              ← Back to Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
