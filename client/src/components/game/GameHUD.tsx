import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/stores/useGameStore";
import { getLevelById } from "@/lib/levelData";
import { Coins, Zap, Target, Timer, ChevronLeft, Home } from "lucide-react";

export function GameHUD() {
  const {
    playerProgress,
    comboCount,
    showComboPopup,
    feedbackText,
    feedbackType,
    currentLevelId,
    setPhase,
    setCurrentLevel,
    clearFeedback,
  } = useGameStore();

  const [displayedXP, setDisplayedXP] = useState(playerProgress.xp);
  const [displayedCoins, setDisplayedCoins] = useState(playerProgress.coins);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const level = currentLevelId ? getLevelById(currentLevelId) : null;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const diff = playerProgress.xp - displayedXP;
    if (diff > 0) {
      const interval = setInterval(() => {
        setDisplayedXP((prev) => {
          if (prev >= playerProgress.xp) {
            clearInterval(interval);
            return playerProgress.xp;
          }
          return prev + Math.ceil(diff / 10);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [playerProgress.xp, displayedXP]);

  useEffect(() => {
    const diff = playerProgress.coins - displayedCoins;
    if (diff > 0) {
      const interval = setInterval(() => {
        setDisplayedCoins((prev) => {
          if (prev >= playerProgress.coins) {
            clearInterval(interval);
            return playerProgress.coins;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [playerProgress.coins, displayedCoins]);

  useEffect(() => {
    if (feedbackText) {
      const timeout = setTimeout(clearFeedback, 1500);
      return () => clearTimeout(timeout);
    }
  }, [feedbackText, clearFeedback]);

  const handleExit = () => {
    setCurrentLevel(null);
    setPhase("world_map");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const xpProgress = (playerProgress.xp % 100) / 100;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 p-4 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start pointer-events-auto">
            <motion.button
              onClick={handleExit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Exit
            </motion.button>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-4 px-4 py-2 bg-black/50 backdrop-blur rounded-full">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-white/60" />
                  <span className="text-white font-mono">{formatTime(timer)}</span>
                </div>

                <motion.div
                  className="flex items-center gap-2"
                  animate={
                    displayedCoins !== playerProgress.coins
                      ? { scale: [1, 1.2, 1] }
                      : {}
                  }
                >
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{displayedCoins}</span>
                </motion.div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur rounded-full">
                <Zap className="w-5 h-5 text-purple-400" />
                <div className="w-32 h-3 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress * 100}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
                <span className="text-white text-sm">Lv.{playerProgress.level}</span>
              </div>
            </div>
          </div>

          {/*level && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <h2 className="text-xl font-bold text-white drop-shadow-lg">
                {level.name}
              </h2>
            </motion.div>
          )*/}
        </div>
      </div>

      <AnimatePresence>
        {comboCount > 1 && showComboPopup && (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.3 }}
                className="text-6xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text"
              >
                {comboCount}x COMBO!
              </motion.div>
              <motion.div
                className="absolute inset-0 blur-xl opacity-50"
                style={{
                  background: `radial-gradient(circle, rgba(255,200,0,0.8) 0%, transparent 70%)`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackText && (
          <motion.div
            initial={{ scale: 0, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -50, opacity: 0 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 0.3, repeat: 2 }}
              className={`text-5xl md:text-7xl font-black ${
                feedbackType === "perfect"
                  ? "text-yellow-400"
                  : feedbackType === "great"
                  ? "text-green-400"
                  : feedbackType === "good"
                  ? "text-blue-400"
                  : "text-red-400"
              }`}
              style={{
                textShadow:
                  feedbackType === "perfect"
                    ? "0 0 30px rgba(250,204,21,0.8)"
                    : feedbackType === "great"
                    ? "0 0 30px rgba(34,197,94,0.8)"
                    : feedbackType === "good"
                    ? "0 0 30px rgba(59,130,246,0.8)"
                    : "0 0 30px rgba(239,68,68,0.8)",
              }}
            >
              {feedbackText}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function LevelCompleteOverlay() {
  const {
    playerProgress,
    currentLevelId,
    setPhase,
    setCurrentLevel,
    comboCount,
  } = useGameStore();

  const level = currentLevelId ? getLevelById(currentLevelId) : null;
  const progress = currentLevelId
    ? playerProgress.levelProgress[currentLevelId]
    : null;

  const handleContinue = () => {
    setCurrentLevel(null);
    setPhase("world_map");
  };

  const handleReplay = () => {
    setPhase("playing");
  };

  if (!level) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
        <p className="text-white/60 mb-6">{level.name}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/30 rounded-xl p-4">
            <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <motion.p
              className="text-2xl font-bold text-yellow-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              +{level.targetCoins}
            </motion.p>
            <p className="text-xs text-white/40">Coins</p>
          </div>

          <div className="bg-black/30 rounded-xl p-4">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <motion.p
              className="text-2xl font-bold text-purple-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              +{level.targetXP}
            </motion.p>
            <p className="text-xs text-white/40">XP</p>
          </div>

          <div className="bg-black/30 rounded-xl p-4">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <motion.p
              className="text-2xl font-bold text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {progress?.perfectScore ? "100%" : "Great!"}
            </motion.p>
            <p className="text-xs text-white/40">Score</p>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            onClick={handleReplay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
          >
            Replay
          </motion.button>
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
