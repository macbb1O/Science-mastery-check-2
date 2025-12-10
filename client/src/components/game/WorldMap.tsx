import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore, WorldId } from "@/lib/stores/useGameStore";
import { useAudio } from "@/lib/stores/useAudio";
import { WORLD_INFO, getLevelsByWorld } from "@/lib/levelData";
import { Lock, ChevronLeft, Star, CheckCircle } from "lucide-react";

export function WorldMap() {
  const { setPhase, setCurrentWorld, setCurrentLevel, playerProgress } = useGameStore();
  const { playHit } = useAudio();

  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
    }));
  }, []);

  const handleWorldSelect = (worldId: WorldId) => {
    if (!playerProgress.unlockedWorlds.includes(worldId)) {
      return;
    }
    playHit();
    setCurrentWorld(worldId);
  };

  const handleLevelSelect = (levelId: string) => {
    playHit();
    setCurrentLevel(levelId);
    setPhase("playing");
  };

  const handleBack = () => {
    playHit();
    setPhase("menu");
  };

  const currentWorld = useGameStore((state) => state.currentWorld);

  if (currentWorld) {
    return (
      <LevelSelect
        worldId={currentWorld}
        onBack={() => setCurrentWorld(null)}
        onSelectLevel={handleLevelSelect}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-black overflow-hidden">
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col p-6">
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8 w-fit"
        >
          <ChevronLeft className="w-6 h-6" />
          Back to Menu
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-12"
        >
          Choose Your World
        </motion.h1>

        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
            {Object.values(WORLD_INFO).map((world, index) => {
              const isUnlocked = playerProgress.unlockedWorlds.includes(world.id);
              const levels = getLevelsByWorld(world.id);
              const completedLevels = levels.filter(
                (l) => playerProgress.levelProgress[l.id]?.completed
              ).length;
              const perfectLevels = levels.filter(
                (l) => playerProgress.levelProgress[l.id]?.perfectScore
              ).length;

              return (
                <motion.button
                  key={world.id}
                  onClick={() => handleWorldSelect(world.id)}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={isUnlocked ? { scale: 1.05, y: -10 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  disabled={!isUnlocked}
                  className={`relative p-6 rounded-2xl backdrop-blur transition-all ${
                    isUnlocked
                      ? "bg-white/10 hover:bg-white/20 cursor-pointer"
                      : "bg-black/30 cursor-not-allowed opacity-60"
                  }`}
                  style={{
                    boxShadow: isUnlocked
                      ? `0 0 30px ${world.color}40, inset 0 0 30px ${world.color}20`
                      : "none",
                  }}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-white/60 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">
                          Earn {world.requiredBadges} badges to unlock
                        </p>
                      </div>
                    </div>
                  )}

                  <motion.div
                    className="text-6xl mb-4"
                    animate={isUnlocked ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {world.icon}
                  </motion.div>

                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: world.color }}
                  >
                    {world.name}
                  </h2>

                  <p className="text-white/60 text-sm mb-4">{world.description}</p>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1 text-white/80">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {completedLevels}/{levels.length}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      {perfectLevels}
                    </div>
                  </div>

                  <div className="mt-4 h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedLevels / levels.length) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: world.color }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelSelect({
  worldId,
  onBack,
  onSelectLevel,
}: {
  worldId: WorldId;
  onBack: () => void;
  onSelectLevel: (levelId: string) => void;
}) {
  const { playerProgress } = useGameStore();
  const { playHit } = useAudio();
  const world = WORLD_INFO[worldId];
  const levels = getLevelsByWorld(worldId);

  return (
    <div
      className="fixed inset-0 overflow-auto"
      style={{
        background: `linear-gradient(135deg, ${world.color}20 0%, #0f0f1a 50%, ${world.color}10 100%)`,
      }}
    >
      <div className="min-h-full p-6">
        <motion.button
          onClick={() => {
            playHit();
            onBack();
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
          Back to Worlds
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-6xl mb-4 block">{world.icon}</span>
          <h1 className="text-4xl font-bold" style={{ color: world.color }}>
            {world.name}
          </h1>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {levels.map((level, index) => {
            const progress = playerProgress.levelProgress[level.id];
            const isCompleted = progress?.completed;
            const isPerfect = progress?.perfectScore;

            return (
              <motion.button
                key={level.id}
                onClick={() => onSelectLevel(level.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-green-500/20 border-2 border-green-500/50"
                    : "bg-white/10 border-2 border-white/20 hover:border-white/40"
                }`}
                style={{
                  boxShadow: isPerfect
                    ? `0 0 20px ${world.color}60`
                    : isCompleted
                    ? "0 0 15px rgba(34,197,94,0.3)"
                    : "none",
                }}
              >
                {isPerfect && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                )}

                {isCompleted && (
                  <CheckCircle className="absolute top-2 left-2 w-5 h-5 text-green-400" />
                )}

                <span className="text-2xl font-bold text-white mb-2">
                  {index + 1}
                </span>

                <span className="text-xs text-white/60 text-center line-clamp-2">
                  {level.name}
                </span>

                <div className="flex gap-1 mt-2">
                  {Array.from({ length: level.difficulty }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: world.color }}
                    />
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
