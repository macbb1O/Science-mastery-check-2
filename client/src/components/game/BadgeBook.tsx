import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, Badge } from "@/lib/stores/useGameStore";
import { useAudio } from "@/lib/stores/useAudio";
import { ChevronLeft, Lock, Sparkles, Filter, Trophy, Star, Zap, Target } from "lucide-react";

const ALL_BADGES: Omit<Badge, "earnedAt" | "isNew">[] = [
  {
    id: "first_level",
    name: "First Steps",
    description: "Complete your first level",
    icon: "🎯",
    rarity: "common",
    category: "completion",
  },
  {
    id: "physics_beginner",
    name: "Light Explorer",
    description: "Complete 5 Physics levels",
    icon: "💡",
    rarity: "common",
    category: "subject",
  },
  {
    id: "chemistry_beginner",
    name: "Reaction Starter",
    description: "Complete 5 Chemistry levels",
    icon: "🧪",
    rarity: "common",
    category: "subject",
  },
  {
    id: "biology_beginner",
    name: "Cell Discoverer",
    description: "Complete 5 Biology levels",
    icon: "🧬",
    rarity: "common",
    category: "subject",
  },
  {
    id: "perfect_5",
    name: "Perfect Streak",
    description: "Get 5 perfect scores in a row",
    icon: "⭐",
    rarity: "rare",
    category: "mastery",
  },
  {
    id: "combo_10",
    name: "Combo Master",
    description: "Reach a 10x combo",
    icon: "🔥",
    rarity: "rare",
    category: "combo",
  },
  {
    id: "combo_20",
    name: "Unstoppable",
    description: "Reach a 20x combo",
    icon: "💥",
    rarity: "epic",
    category: "combo",
  },
  {
    id: "coins_100",
    name: "Coin Collector",
    description: "Collect 100 coins total",
    icon: "🪙",
    rarity: "common",
    category: "collector",
  },
  {
    id: "coins_500",
    name: "Treasure Hunter",
    description: "Collect 500 coins total",
    icon: "💰",
    rarity: "rare",
    category: "collector",
  },
  {
    id: "physics_complete",
    name: "Physics Master",
    description: "Complete all Physics levels",
    icon: "🏆",
    rarity: "epic",
    category: "subject",
  },
  {
    id: "chemistry_complete",
    name: "Chemistry Master",
    description: "Complete all Chemistry levels",
    icon: "🏆",
    rarity: "epic",
    category: "subject",
  },
  {
    id: "biology_complete",
    name: "Biology Master",
    description: "Complete all Biology levels",
    icon: "🏆",
    rarity: "epic",
    category: "subject",
  },
  {
    id: "all_perfect",
    name: "Perfectionist",
    description: "Get perfect scores on all levels",
    icon: "👑",
    rarity: "legendary",
    category: "special",
  },
  {
    id: "speedrunner",
    name: "Speedrunner",
    description: "Complete any level in under 30 seconds",
    icon: "⚡",
    rarity: "rare",
    category: "special",
  },
  {
    id: "no_mistakes",
    name: "Flawless",
    description: "Complete 10 levels without any mistakes",
    icon: "💎",
    rarity: "legendary",
    category: "special",
  },
  {
  id: "linear_beginner",    
  name: "Linear Beginner",      
  description: "Complete 5 Linear Equations levels", 
  icon: "📐",                  
  rarity: "common",           
  category: "subject",
}
];

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};

const RARITY_GLOW = {
  common: "rgba(156,163,175,0.3)",
  rare: "rgba(59,130,246,0.5)",
  epic: "rgba(147,51,234,0.5)",
  legendary: "rgba(234,179,8,0.7)",
};

type FilterType = "all" | "earned" | "locked" | Badge["category"];

export function BadgeBook() {
  const { setPhase, playerProgress, markBadgeSeen } = useGameStore();
  const { playHit, playSuccess } = useAudio();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadgeIds = useMemo(
    () => new Set(playerProgress.badges.map((b) => b.id)),
    [playerProgress.badges]
  );

  const filteredBadges = useMemo(() => {
    return ALL_BADGES.filter((badge) => {
      if (filter === "all") return true;
      if (filter === "earned") return earnedBadgeIds.has(badge.id);
      if (filter === "locked") return !earnedBadgeIds.has(badge.id);
      return badge.category === filter;
    });
  }, [filter, earnedBadgeIds]);

  const handleBack = () => {
    playHit();
    setPhase("menu");
  };

  const handleBadgeClick = (badge: Omit<Badge, "earnedAt" | "isNew">) => {
    const earnedBadge = playerProgress.badges.find((b) => b.id === badge.id);
    if (earnedBadge) {
      playSuccess();
      setSelectedBadge(earnedBadge);
      if (earnedBadge.isNew) {
        markBadgeSeen(earnedBadge.id);
      }
    } else {
      playHit();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-950 to-black overflow-auto">
      <div className="min-h-full p-6">
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
          Back to Menu
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Badge Book</h1>
          <p className="text-white/60">
            {playerProgress.badges.length} / {ALL_BADGES.length} badges earned
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-8 px-4"
        >
          <div className="flex items-center gap-4 bg-black/30 backdrop-blur rounded-full p-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
              <span className="text-yellow-400 font-bold">
                {playerProgress.coins}
              </span>
              <span className="text-yellow-400/60 text-sm">coins</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
              <span className="text-purple-400 font-bold">
                {playerProgress.xp}
              </span>
              <span className="text-purple-400/60 text-sm">XP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <span className="text-green-400 font-bold">
                Lv.{playerProgress.level}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(
            [
              "all",
              "earned",
              "locked",
              "completion",
              "mastery",
              "combo",
              "subject",
              "collector",
              "special",
            ] as FilterType[]
          ).map((f) => (
            <motion.button
              key={f}
              onClick={() => {
                playHit();
                setFilter(f);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {filteredBadges.map((badge, index) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            const earnedBadge = playerProgress.badges.find(
              (b) => b.id === badge.id
            );
            const isNew = earnedBadge?.isNew;

            return (
              <motion.button
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
                  isEarned
                    ? `bg-gradient-to-br ${RARITY_COLORS[badge.rarity]}`
                    : "bg-black/30"
                }`}
                style={{
                  boxShadow: isEarned
                    ? `0 0 30px ${RARITY_GLOW[badge.rarity]}`
                    : "none",
                }}
              >
                {isNew && (
                  <motion.div
                    className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    NEW!
                  </motion.div>
                )}

                {!isEarned && (
                  <Lock className="absolute top-2 right-2 w-4 h-4 text-white/30" />
                )}

                <motion.span
                  className={`text-4xl mb-2 ${!isEarned ? "grayscale opacity-30" : ""}`}
                  animate={
                    isEarned
                      ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {badge.icon}
                </motion.span>

                <span
                  className={`text-sm font-bold text-center ${
                    isEarned ? "text-white" : "text-white/30"
                  }`}
                >
                  {badge.name}
                </span>

                {isEarned && badge.rarity !== "common" && (
                  <Sparkles
                    className={`absolute bottom-2 right-2 w-4 h-4 ${
                      badge.rarity === "legendary"
                        ? "text-yellow-300"
                        : badge.rarity === "epic"
                        ? "text-purple-300"
                        : "text-blue-300"
                    }`}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-gradient-to-br ${RARITY_COLORS[selectedBadge.rarity]} rounded-3xl p-8 max-w-sm w-full text-center`}
              style={{
                boxShadow: `0 0 60px ${RARITY_GLOW[selectedBadge.rarity]}`,
              }}
            >
              <motion.div
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity },
                }}
                className="text-8xl mb-6"
              >
                {selectedBadge.icon}
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedBadge.name}
              </h2>

              <p className="text-white/80 mb-4">{selectedBadge.description}</p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedBadge.rarity === "legendary"
                      ? "bg-yellow-500/30 text-yellow-200"
                      : selectedBadge.rarity === "epic"
                      ? "bg-purple-500/30 text-purple-200"
                      : selectedBadge.rarity === "rare"
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-gray-500/30 text-gray-200"
                  }`}
                >
                  {selectedBadge.rarity.toUpperCase()}
                </span>
              </div>

              {selectedBadge.earnedAt && (
                <p className="text-white/50 text-sm">
                  Earned on{" "}
                  {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                </p>
              )}

              <motion.button
                onClick={() => setSelectedBadge(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
