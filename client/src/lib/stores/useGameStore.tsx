import { ALL_LEVELS } from "./levelData";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "world_map" | "playing" | "level_complete" | "badge_book";
export type WorldId = "physics" | "chemistry" | "biology";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "completion" | "mastery" | "combo" | "subject" | "collector" | "special";
  earnedAt?: Date;
  isNew?: boolean;
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  perfectScore: boolean;
  bestScore: number;
  bestTime: number;
  attempts: number;
}

export interface PlayerProgress {
  xp: number;
  level: number;
  coins: number;
  totalCoins: number;
  currentStreak: number;
  maxStreak: number;
  correctAnswers: number;
  totalAnswers: number;
  badges: Badge[];
  levelProgress: Record<string, LevelProgress>;
  unlockedWorlds: WorldId[];
}

interface GameState {
  phase: GamePhase;
  currentWorld: WorldId | null;
  currentLevelId: string | null;
  playerProgress: PlayerProgress;
  
  screenShake: number;
  hitFlash: boolean;
  slowMotion: boolean;
  
  comboCount: number;
  showComboPopup: boolean;
  feedbackText: string | null;
  feedbackType: "perfect" | "great" | "good" | "wrong" | null;
  
  setPhase: (phase: GamePhase) => void;
  setCurrentWorld: (world: WorldId | null) => void;
  setCurrentLevel: (levelId: string | null) => void;
  
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  
  triggerScreenShake: (intensity: number) => void;
  triggerHitFlash: () => void;
  triggerSlowMotion: () => void;
  showFeedback: (text: string, type: "perfect" | "great" | "good" | "wrong") => void;
  clearFeedback: () => void;
  
  earnBadge: (badge: Omit<Badge, "earnedAt" | "isNew">) => void;
  markBadgeSeen: (badgeId: string) => void;
  
  completeLevelProgress: (levelId: string, score: number, time: number, perfect: boolean) => void;
  unlockWorld: (world: WorldId) => void;
  
  resetGame: () => void;
}

const initialLevelProgress: Record<string, LevelProgress> = {};

ALL_LEVELS.forEach((level) => {
  initialLevelProgress[level.id] = {
    levelId: level.id,
    completed: false,
    perfectScore: false,
    bestScore: 0,
    bestTime: 0,
    attempts: 0,
  };
});

const initialProgress: PlayerProgress = {
  xp: 0,
  level: 1,
  coins: 0,
  totalCoins: 0,
  currentStreak: 0,
  maxStreak: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  badges: [],
  levelProgress: initialLevelProgress,
  unlockedWorlds: ["physics"],
};

const XP_PER_LEVEL = 100;

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    currentWorld: null,
    currentLevelId: null,
    playerProgress: initialProgress,
    
    screenShake: 0,
    hitFlash: false,
    slowMotion: false,
    
    comboCount: 0,
    showComboPopup: false,
    feedbackText: null,
    feedbackType: null,
    
    setPhase: (phase) => set({ phase }),
    setCurrentWorld: (world) => set({ currentWorld: world }),
    setCurrentLevel: (levelId) => set({ currentLevelId: levelId }),
    
    addXP: (amount) => {
      set((state) => {
        const newXP = state.playerProgress.xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        return {
          playerProgress: {
            ...state.playerProgress,
            xp: newXP,
            level: newLevel,
          },
        };
      });
    },
    
    addCoins: (amount) => {
      set((state) => ({
        playerProgress: {
          ...state.playerProgress,
          coins: state.playerProgress.coins + amount,
          totalCoins: state.playerProgress.totalCoins + amount,
        },
      }));
    },
    
    incrementCombo: () => {
      set((state) => {
        const newCombo = state.comboCount + 1;
        const newMaxStreak = Math.max(state.playerProgress.maxStreak, newCombo);
        return {
          comboCount: newCombo,
          showComboPopup: true,
          playerProgress: {
            ...state.playerProgress,
            currentStreak: newCombo,
            maxStreak: newMaxStreak,
            correctAnswers: state.playerProgress.correctAnswers + 1,
            totalAnswers: state.playerProgress.totalAnswers + 1,
          },
        };
      });
      setTimeout(() => set({ showComboPopup: false }), 500);
    },
    
    resetCombo: () => {
      set((state) => ({
        comboCount: 0,
        playerProgress: {
          ...state.playerProgress,
          currentStreak: 0,
          totalAnswers: state.playerProgress.totalAnswers + 1,
        },
      }));
    },
    
    triggerScreenShake: (intensity) => {
      set({ screenShake: intensity });
      setTimeout(() => set({ screenShake: 0 }), 200);
    },
    
    triggerHitFlash: () => {
      set({ hitFlash: true });
      setTimeout(() => set({ hitFlash: false }), 100);
    },
    
    triggerSlowMotion: () => {
      set({ slowMotion: true });
      setTimeout(() => set({ slowMotion: false }), 200);
    },
    
    showFeedback: (text, type) => {
      set({ feedbackText: text, feedbackType: type });
    },
    
    clearFeedback: () => {
      set({ feedbackText: null, feedbackType: null });
    },
    
    earnBadge: (badge) => {
      const state = get();
      if (state.playerProgress.badges.some((b) => b.id === badge.id)) return;
      
      set({
        playerProgress: {
          ...state.playerProgress,
          badges: [
            ...state.playerProgress.badges,
            { ...badge, earnedAt: new Date(), isNew: true },
          ],
        },
      });
    },
    
    markBadgeSeen: (badgeId) => {
      set((state) => ({
        playerProgress: {
          ...state.playerProgress,
          badges: state.playerProgress.badges.map((b) =>
            b.id === badgeId ? { ...b, isNew: false } : b
          ),
        },
      }));
    },
    
    completeLevelProgress: (levelId, score, time, perfect) => {
      set((state) => {
        const existing = state.playerProgress.levelProgress[levelId];
        return {
          playerProgress: {
            ...state.playerProgress,
            levelProgress: {
              ...state.playerProgress.levelProgress,
              [levelId]: {
                levelId,
                completed: true,
                perfectScore: existing?.perfectScore || perfect,
                bestScore: Math.max(existing?.bestScore || 0, score),
                bestTime: existing?.bestTime ? Math.min(existing.bestTime, time) : time,
                attempts: (existing?.attempts || 0) + 1,
              },
            },
          },
        };
      });
    },
    
    unlockWorld: (world) => {
      set((state) => {
        if (state.playerProgress.unlockedWorlds.includes(world)) return {};
        return {
          playerProgress: {
            ...state.playerProgress,
            unlockedWorlds: [...state.playerProgress.unlockedWorlds, world],
          },
        };
      });
    },
    
    resetGame: () => {
      set({
        phase: "menu",
        currentWorld: null,
        currentLevelId: null,
        playerProgress: initialProgress,
        screenShake: 0,
        hitFlash: false,
        slowMotion: false,
        comboCount: 0,
        showComboPopup: false,
        feedbackText: null,
        feedbackType: null,
      });
    },
  }))
);
