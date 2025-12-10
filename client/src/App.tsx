import { Suspense } from "react";
import "@fontsource/inter";

import { useGameStore } from "./lib/stores/useGameStore";
import { MainMenu } from "./components/game/MainMenu";
import { WorldMap } from "./components/game/WorldMap";
import { BadgeBook } from "./components/game/BadgeBook";
import { GameLevel, LevelCompleteScreen } from "./components/game/GameLevel";
import { SoundManager } from "./components/game/SoundManager";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-lg">Loading Science Quest...</p>
      </div>
    </div>
  );
}

function App() {
  const phase = useGameStore((state) => state.phase);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <Suspense fallback={<LoadingScreen />}>
        {phase === "menu" && <MainMenu />}
        {phase === "world_map" && <WorldMap />}
        {phase === "badge_book" && <BadgeBook />}
        {phase === "playing" && <GameLevel />}
        {phase === "level_complete" && (
          <>
            <GameLevel />
            <LevelCompleteScreen />
          </>
        )}
      </Suspense>
      <SoundManager />
    </div>
  );
}

export default App;
