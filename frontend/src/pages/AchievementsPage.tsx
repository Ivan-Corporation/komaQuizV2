import { useUserInfo } from "../hooks/useUserInfo";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  mintAchievement,
  mintRewardTokens,
} from "../blockchain/rewardContract";
import toast from "react-hot-toast";

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

const ALL_ACHIEVEMENTS = [
  "Novice",
  ...TOPICS.flatMap((topic) => [
    `First Quiz: ${topic}`,
    `Perfect Score: ${topic}`,
    `Expert in ${topic}`,
    `Master of ${topic}`,
  ]),
];

// ONLY allow minting for these 3 for now
const testMintableAchievements = new Set([
  "Novice",
  "First Quiz: History",
  "Perfect Score: Mathematics",
]);

// CID mapping for those 3 test achievements
const metadataMap: Record<string, string> = {
  Novice: "ipfs://bafkreiabqoitpcwrkjtb3grm4vnjgh2nylxboetzahmxyhuqligah3saxq",
  "First Quiz: History":
    "ipfs://bafkreibvzqaax4hqcs5ann5fltxfzh7s3akp4su67dwyf2aq4fjp4ksn5u",
  "Perfect Score: Mathematics":
    "ipfs://bafkreifmek4vw4uptl4znqaa5mus3l6dbgocsdis3d54hjezleq5l46mli",
};

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

  const tokenRewards: Record<string, number> = {
    Novice: 10,
    "First Quiz: History": 5,
    "Perfect Score: Mathematics": 20,
  };

  const handleMintReward = async (ach: any) => {
    if (!user?.wallet_address) {
      toast.error("Please connect your wallet first.");
      return;
    }

    const uri = metadataMap[ach.id];
    const tokenAmount = tokenRewards[ach.id];

    if (!uri) {
      toast.error("❌ This achievement is not available for NFT minting.");
      return;
    }
    if (!tokenAmount) {
      toast.error("❌ This achievement doesn't have a token reward.");
      return;
    }

    try {
      toast.loading("⏳ Minting achievement NFT...");
      const txHashNFT = await mintAchievement(user.wallet_address, ach.id, uri);
      toast.dismiss();
      toast.success(`✅ NFT minted! TX: ${txHashNFT.slice(0, 8)}...`);

      toast.loading("🎁 Sending KOMQ tokens...");
      const txHashTokens = await mintRewardTokens(
        user.wallet_address,
        tokenAmount
      );
      toast.dismiss();
      toast.success(
        `💰 Rewarded ${tokenAmount} KOMQ! TX: ${txHashTokens.slice(0, 8)}...`
      );
    } catch (err) {
      console.error("Minting failed:", err);
      toast.dismiss();
      toast.error("❌ Minting failed. Please try again.");
    }
  };

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

                  {!ach.unlocked ? (
                    <p className="text-xs mt-2 text-red-400 font-semibold flex items-center gap-1">
                      🔒 Locked
                    </p>
                  ) : testMintableAchievements.has(ach.id) ? (
                    <button
                      className="w-full text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 cursor-pointer text-white px-3 py-1 rounded shadow transition"
                      onClick={() => handleMintReward(ach)}
                    >
                      🎉 Mint NFT & Claim KOMQ
                    </button>
                  ) : (
                    <p className="text-xs mt-2 text-gray-400 font-semibold">
                      ⏳ Minting coming soon
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
