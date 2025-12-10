import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls, Text, OrbitControls } from "@react-three/drei";
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
        <Canvas
          shadows
          camera={{ position: [0, 8, 12], fov: 50 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#0a0a1a"]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
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
        if (combo >= 5) {
          showFeedback("PERFECT!", "perfect");
        } else if (combo >= 3) {
          showFeedback("GREAT!", "great");
        } else {
          showFeedback("CORRECT!", "good");
        }

        setParticleColor("#22c55e");
        setParticlePosition([0, 2, 0]);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 500);

        if (currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex((i) => i + 1);
          }, 800);
        } else {
          setTimeout(() => {
            handleLevelComplete();
          }, 800);
        }
      } else {
        playHit();
        triggerScreenShake(1);
        resetCombo();
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
    
    addXP(level.targetXP);
    addCoins(level.targetCoins);
    
    const combo = useGameStore.getState().comboCount;
    const perfect = combo >= questions.length;
    completeLevelProgress(level.id, combo * 10, 60, perfect);

    if (playerProgress.badges.length === 0) {
      earnBadge({
        id: "first_level",
        name: "First Steps",
        description: "Complete your first level",
        icon: "🎯",
        rarity: "common",
        category: "completion",
      });
    }

    const progress = useGameStore.getState().playerProgress;
    if (progress.totalCoins >= 100 && !progress.badges.some(b => b.id === "coins_100")) {
      earnBadge({
        id: "coins_100",
        name: "Coin Collector",
        description: "Collect 100 coins total",
        icon: "🪙",
        rarity: "common",
        category: "collector",
      });
    }

    if (combo >= 10 && !progress.badges.some(b => b.id === "combo_10")) {
      earnBadge({
        id: "combo_10",
        name: "Combo Master",
        description: "Reach a 10x combo",
        icon: "🔥",
        rarity: "rare",
        category: "combo",
      });
    }

    if (progress.badges.length >= 3 && !progress.unlockedWorlds.includes("chemistry")) {
      unlockWorld("chemistry");
    }
    if (progress.badges.length >= 6 && !progress.unlockedWorlds.includes("biology")) {
      unlockWorld("biology");
    }

    setTimeout(() => {
      setPhase("level_complete");
    }, 1000);
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

      <ParticleSystem
        count={40}
        color={particleColor}
        position={particlePosition}
        active={showParticles}
      />

      <Player />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

function Environment({ worldId }: { worldId: string }) {
  const colors = {
    physics: "#3b82f6",
    chemistry: "#22c55e",
    biology: "#a855f7",
  };

  const color = colors[worldId as keyof typeof colors] || "#ffffff";

  const decorations = useMemo(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 15 + Math.random() * 5;
      items.push({
        position: [
          Math.cos(angle) * radius,
          Math.random() * 3 + 1,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.5,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {decorations.map((dec, i) => (
        <mesh key={i} position={dec.position}>
          <sphereGeometry args={[dec.scale, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.4, 0]}>
        <ringGeometry args={[8, 10, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const keys = getKeys();
    const speed = 8;
    const friction = 0.9;

    if (keys.forward) velocity.current.z -= speed * delta;
    if (keys.back) velocity.current.z += speed * delta;
    if (keys.left) velocity.current.x -= speed * delta;
    if (keys.right) velocity.current.x += speed * delta;

    velocity.current.multiplyScalar(friction);

    meshRef.current.position.add(velocity.current);

    meshRef.current.position.x = THREE.MathUtils.clamp(meshRef.current.position.x, -6, 6);
    meshRef.current.position.z = THREE.MathUtils.clamp(meshRef.current.position.z, -6, 6);

    meshRef.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0.5, 5]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

interface QuestionDisplayProps {
  question: LevelQuestion;
  onAnswer: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

function QuestionDisplay({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const lastActionState = useRef(false);

  useFrame(() => {
    const keys = getKeys();
    if (keys.action && !lastActionState.current && hoveredIndex !== null) {
      onAnswer(hoveredIndex);
    }
    lastActionState.current = keys.action;
  });

  const optionPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = question.options.length;
    const spacing = 3;
    const startX = -((count - 1) * spacing) / 2;

    for (let i = 0; i < count; i++) {
      positions.push([startX + i * spacing, 1, -3]);
    }
    return positions;
  }, [question.options.length]);

  return (
    <group>
      <Text
        position={[0, 5, -5]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
      >
        {`Question ${questionNumber}/${totalQuestions}`}
      </Text>

      <Text
        position={[0, 4, -5]}
        fontSize={0.4}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
      >
        {question.question}
      </Text>

      {question.options.map((option, index) => (
        <AnswerOrb
          key={index}
          position={optionPositions[index]}
          text={option}
          index={index}
          isHovered={hoveredIndex === index}
          onHover={() => setHoveredIndex(index)}
          onUnhover={() => setHoveredIndex(null)}
          onClick={() => onAnswer(index)}
        />
      ))}
    </group>
  );
}

interface AnswerOrbProps {
  position: [number, number, number];
  text: string;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}

function AnswerOrb({
  position,
  text,
  index,
  isHovered,
  onHover,
  onUnhover,
  onClick,
}: AnswerOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const time = useRef(Math.random() * 100);

  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const color = colors[index % colors.length];

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    meshRef.current.position.y = position[1] + Math.sin(time.current * 2 + index) * 0.2;
    meshRef.current.rotation.y += delta * 0.5;

    const targetScale = isHovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={onHover}
        onPointerLeave={onUnhover}
        onClick={onClick}
        castShadow
      >
        <boxGeometry args={[2, 1.5, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
        />
      </mesh>

      <Text
        position={[0, 0, 0.2]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {text}
      </Text>

      <Text
        position={[-0.8, 0.5, 0.2]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {String.fromCharCode(65 + index)}
      </Text>
    </group>
  );
}

export function LevelCompleteScreen() {
  const phase = useGameStore((state) => state.phase);

  if (phase !== "level_complete") return null;

  return <LevelCompleteOverlay />;
}
