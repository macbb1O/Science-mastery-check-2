import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/lib/stores/useGameStore";
import { useAudio } from "@/lib/stores/useAudio";
import { getLevelById, Level, LevelQuestion } from "@/lib/levelData";
import { ScreenShakeController, HitFlashOverlay, ParticleSystem } from "./GameEffects";
import { GameHUD, LevelCompleteOverlay } from "./GameHUD";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  action = "action",
}

const keyMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
  { name: Controls.action, keys: ["Space", "Enter"] },
];

export function GameLevel() {
  const { currentLevelId, phase } = useGameStore();
  const level = currentLevelId ? getLevelById(currentLevelId) : null;

  if (!level || phase !== "playing") return null;

  return (
    <KeyboardControls map={keyMap}>
      <div className="fixed inset-0">
        <Canvas shadows camera={{ position: [0, 8, 12], fov: 50 }} gl={{ antialias: true }}>
          <color attach="background" args={["#0a0a1a"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8b5cf6" />

          <ScreenShakeController>
            <GameScene level={level} />
          </ScreenShakeController>

          <HitFlashOverlay />
        </Canvas>
        <GameHUD />
      </div>
    </KeyboardControls>
  );
}

function GameScene({ level }: { level: Level }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [particleColor, setParticleColor] = useState("#22c55e");
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const startTime = useRef(Date.now());

  const {
    triggerScreenShake,
    triggerHitFlash,
    triggerSlowMotion,
    showFeedback,
    incrementCombo,
    resetCombo,
    addXP,
    addCoins,
    completeLevelProgress,
    earnBadge,
    setPhase,
    playerProgress,
    unlockWorld,
  } = useGameStore();

  const { playHit, playSuccess } = useAudio();
  const questions = level.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion || isLevelComplete) return;

      const isCorrect = selectedIndex === currentQuestion.correctIndex;

      if (isCorrect) {
        playSuccess();
        triggerScreenShake(2);
        triggerHitFlash();
        triggerSlowMotion();
        incrementCombo();

        const combo = useGameStore.getState().comboCount;
        if (combo >= 5) showFeedback("PERFECT!", "perfect");
        else if (combo >= 3) showFeedback("GREAT!", "great");
        else showFeedback("CORRECT!", "good");

        setParticleColor("#22c55e");
        setParticlePosition([0, 2, 0]);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 500);

        if (currentQuestionIndex < questions.length - 1) {
          setTimeout(() => setCurrentQuestionIndex((i) => i + 1), 800);
        } else {
          setTimeout(() => handleLevelComplete(), 800);
        }
      } else {
        playHit();
        triggerScreenShake(1);
        resetCombo();
        setMistakes((m) => m + 1);
        showFeedback("WRONG!", "wrong");

        setParticleColor("#ef4444");
        setParticlePosition([0, 2, 0]);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 500);
      }
    },
    [currentQuestion, currentQuestionIndex, questions.length, isLevelComplete]
  );

  const handleLevelComplete = () => {
    setIsLevelComplete(true);

    const endTime = Date.now();
    const timeTaken = (endTime - startTime.current) / 1000;
    const combo = useGameStore.getState().comboCount;
    const perfect = combo >= questions.length;

    addXP(level.targetXP);
    addCoins(level.targetCoins);
    completeLevelProgress(level.id, combo * 10, timeTaken, perfect);

    const progress = useGameStore.getState().playerProgress;

    // First Steps
    if (!progress.badges.some((b) => b.id === "first_level")) {
      earnBadge({ id: "first_level", name: "First Steps", description: "Complete your first level", icon: "🎯", rarity: "common", category: "completion" });
    }

    // Subject beginner badges
    const subjectCount = { physics: 0, chemistry: 0, biology: 0 };
    Object.values(progress.levelProgress).forEach((p) => {
      if (p.worldId && p.completed) subjectCount[p.worldId] = (subjectCount[p.worldId] || 0) + 1;
    });
    if (subjectCount.physics >= 5 && !progress.badges.some((b) => b.id === "physics_beginner")) {
      earnBadge({ id: "physics_beginner", name: "Light Explorer", description: "Complete 5 Physics levels", icon: "💡", rarity: "common", category: "subject" });
    }
    if (subjectCount.chemistry >= 5 && !progress.badges.some((b) => b.id === "chemistry_beginner")) {
      earnBadge({ id: "chemistry_beginner", name: "Reaction Starter", description: "Complete 5 Chemistry levels", icon: "🧪", rarity: "common", category: "subject" });
    }
    if (subjectCount.biology >= 5 && !progress.badges.some((b) => b.id === "biology_beginner")) {
      earnBadge({ id: "biology_beginner", name: "Cell Discoverer", description: "Complete 5 Biology levels", icon: "🧬", rarity: "common", category: "subject" });
    }

    // Combo badges
    if (combo >= 5 && !progress.badges.some((b) => b.id === "perfect_5")) {
      earnBadge({ id: "perfect_5", name: "Perfect Streak", description: "Get 5 perfect scores in a row", icon: "⭐", rarity: "rare", category: "mastery" });
    }
    if (combo >= 10 && !progress.badges.some((b) => b.id === "combo_10")) {
      earnBadge({ id: "combo_10", name: "Combo Master", description: "Reach a 10x combo", icon: "🔥", rarity: "rare", category: "combo" });
    }
    if (combo >= 20 && !progress.badges.some((b) => b.id === "combo_20")) {
      earnBadge({ id: "combo_20", name: "Unstoppable", description: "Reach a 20x combo", icon: "💥", rarity: "epic", category: "combo" });
    }

    // Coins badges
    if (progress.totalCoins >= 100 && !progress.badges.some((b) => b.id === "coins_100")) {
      earnBadge({ id: "coins_100", name: "Coin Collector", description: "Collect 100 coins total", icon: "🪙", rarity: "common", category: "collector" });
    }
    if (progress.totalCoins >= 500 && !progress.badges.some((b) => b.id === "coins_500")) {
      earnBadge({ id: "coins_500", name: "Treasure Hunter", description: "Collect 500 coins total", icon: "💰", rarity: "rare", category: "collector" });
    }

    // Subject master badges
    const totalPhysicsLevels = getLevelById("physics_1")?.worldLevels?.length || 5;
    const totalChemLevels = getLevelById("chemistry_1")?.worldLevels?.length || 5;
    const totalBioLevels = getLevelById("biology_1")?.worldLevels?.length || 5;

    if (subjectCount.physics >= totalPhysicsLevels && !progress.badges.some((b) => b.id === "physics_complete")) {
      earnBadge({ id: "physics_complete", name: "Physics Master", description: "Complete all Physics levels", icon: "🏆", rarity: "epic", category: "subject" });
    }
    if (subjectCount.chemistry >= totalChemLevels && !progress.badges.some((b) => b.id === "chemistry_complete")) {
      earnBadge({ id: "chemistry_complete", name: "Chemistry Master", description: "Complete all Chemistry levels", icon: "🏆", rarity: "epic", category: "subject" });
    }
    if (subjectCount.biology >= totalBioLevels && !progress.badges.some((b) => b.id === "biology_complete")) {
      earnBadge({ id: "biology_complete", name: "Biology Master", description: "Complete all Biology levels", icon: "🏆", rarity: "epic", category: "subject" });
    }

    // Special badges
    const allLevels = Object.values(progress.levelProgress);
    if (allLevels.every((l) => l.perfect) && !progress.badges.some((b) => b.id === "all_perfect")) {
      earnBadge({ id: "all_perfect", name: "Perfectionist", description: "Get perfect scores on all levels", icon: "👑", rarity: "legendary", category: "special" });
    }
    if (timeTaken < 30 && !progress.badges.some((b) => b.id === "speedrunner")) {
      earnBadge({ id: "speedrunner", name: "Speedrunner", description: "Complete any level in under 30 seconds", icon: "⚡", rarity: "rare", category: "special" });
    }
    if (mistakes === 0) {
      const flawlessCount = allLevels.filter((l) => l.mistakes === 0).length;
      if (flawlessCount >= 10 && !progress.badges.some((b) => b.id === "no_mistakes")) {
        earnBadge({ id: "no_mistakes", name: "Flawless", description: "Complete 10 levels without any mistakes", icon: "💎", rarity: "legendary", category: "special" });
      }
    }

    // Unlock worlds
    if (progress.badges.length >= 3 && !progress.unlockedWorlds.includes("chemistry")) unlockWorld("chemistry");
    if (progress.badges.length >= 6 && !progress.unlockedWorlds.includes("biology")) unlockWorld("biology");

    setTimeout(() => setPhase("level_complete"), 1000);
  };

  return (
    <>
      <Ground />
      <Environment worldId={level.worldId} />

      {currentQuestion && !isLevelComplete && (
        <QuestionDisplay
          question={currentQuestion}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}

      <ParticleSystem count={40} color={particleColor} position={particlePosition} active={showParticles} />

      <Player />
    </>
  );
}

// --- Ground, Environment, Player, QuestionDisplay, AnswerOrb remain the same as your original code ---

export function LevelCompleteScreen() {
  const phase = useGameStore((state) => state.phase);
  if (phase !== "level_complete") return null;
  return <LevelCompleteOverlay />;
}
