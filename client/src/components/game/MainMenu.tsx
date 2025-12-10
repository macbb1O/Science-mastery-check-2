import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/stores/useGameStore";
import { useAudio } from "@/lib/stores/useAudio";
import { Volume2, VolumeX, Trophy, Play } from "lucide-react";

export function MainMenu() {
  const { setPhase, playerProgress } = useGameStore();
  const { isMuted, toggleMute, playHit } = useAudio();

  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  const handlePlay = () => {
    playHit();
    setPhase("world_map");
  };

  const handleBadges = () => {
    playHit();
    setPhase("badge_book");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black z-50">
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12 z-10"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCIENCE QUEST
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-white/80 mt-4"
        >
          Master Physics, Chemistry & Biology
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-4 z-10"
      >
        <motion.button
          onClick={handlePlay}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,197,94,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold rounded-xl shadow-lg flex items-center gap-3 hover:from-green-400 hover:to-emerald-500 transition-all"
        >
          <Play className="w-8 h-8" />
          PLAY
        </motion.button>

        <motion.button
          onClick={handleBadges}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(234,179,8,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold rounded-xl shadow-lg flex items-center gap-3 hover:from-yellow-400 hover:to-orange-400 transition-all"
        >
          <Trophy className="w-6 h-6" />
          BADGES ({playerProgress.badges.length})
        </motion.button>

        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-white/10 backdrop-blur text-white text-lg font-semibold rounded-xl flex items-center gap-2 justify-center hover:bg-white/20 transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          {isMuted ? "Sound Off" : "Sound On"}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 flex gap-8 text-white/60 z-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
            {playerProgress.coins}
          </div>
          <span>Coins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {playerProgress.level}
          </div>
          <span>Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {playerProgress.xp}
          </div>
          <span>XP</span>
        </div>
      </motion.div>
    </div>
  );
}
