import { Sparkles, Loader2, FlaskRound } from "lucide-react";
import "../styles/CyberLoader.css";

export default function CyberLoader() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute w-full h-full border-4 border-cyan-400 rounded-full animate-spin-slow blur-sm opacity-50"></div>
        <div className="absolute w-20 h-20 border-2 border-indigo-500 rounded-full animate-ping-fast"></div>
        <FlaskRound className="w-10 h-10 text-indigo-500 animate-pulse-slow z-10" />
      </div>
      <p className="cyber-text text-cyan-300 font-mono text-lg tracking-wide text-center">
        Synthesizing Quantum Intelligence...
      </p>
    </div>
  );
}
