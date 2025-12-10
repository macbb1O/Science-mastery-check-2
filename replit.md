# Science Quest - Educational Arcade Game

## Overview
Science Quest is a highly polished, visually juicy educational game designed to help students master physics, chemistry, and biology topics through action-packed micro-levels. The game combines arcade-style gameplay with learning, featuring satisfying visual feedback, progression systems, and engaging mechanics.

## Recent Changes
- December 10, 2025: Initial MVP build with all core features
  - Created 3 themed worlds: Physics, Chemistry, Biology
  - Implemented 29 educational levels with questions
  - Built complete game juice system (screen shake, particles, popups)
  - Created badge and award book system
  - Implemented XP, coins, and combo tracking

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   └── game/
│       ├── MainMenu.tsx       # Title screen with play/badges buttons
│       ├── WorldMap.tsx       # World selection and level selection
│       ├── GameLevel.tsx      # 3D gameplay with questions
│       ├── GameHUD.tsx        # In-game UI (timer, XP, coins, feedback)
│       ├── GameEffects.tsx    # Particle systems, screen shake
│       ├── BadgeBook.tsx      # Badge collection and viewing
│       └── SoundManager.tsx   # Audio initialization
├── lib/
│   ├── stores/
│   │   ├── useGameStore.tsx   # Main game state (phases, progress, effects)
│   │   └── useAudio.tsx       # Sound effects management
│   ├── levelData.ts           # All level definitions and questions
│   └── utils.ts               # Utility functions
└── App.tsx                    # Main app with phase routing
```

### Game Phases
1. `menu` - Main menu with play and badges buttons
2. `world_map` - World selection and level grid
3. `playing` - Active gameplay with 3D scene
4. `level_complete` - Victory screen with rewards
5. `badge_book` - Badge collection viewer

### Worlds and Levels
- **Physics** (10 levels): Light, refraction, Snell's Law, albedo
- **Chemistry** (10 levels): Acids, bases, pH, reactions
- **Biology** (9 levels): Cells, organelles, cell theory

### Key Features
- **Game Juice**: Screen shake, hit flash, particle effects, slow motion
- **Feedback System**: "PERFECT!", "GREAT!", "CORRECT!", "WRONG!" popups
- **Progression**: XP bar with level ups, coin collection, combo tracking
- **Badges**: 15+ badges with rarity tiers (common, rare, epic, legendary)
- **World Unlocking**: Earn badges to unlock new worlds

### Tech Stack
- React + TypeScript
- Three.js / React Three Fiber for 3D graphics
- Framer Motion for UI animations
- Zustand for state management
- Tailwind CSS for styling
- Express.js backend

### Sound Files
Located in `client/public/sounds/`:
- `background.mp3` - Background music
- `hit.mp3` - Click/wrong answer sound
- `success.mp3` - Correct answer sound

## User Preferences
- Sound is muted by default (toggle in main menu)
- Progress is stored in memory (resets on refresh)
- Dark theme with colorful accents per world

## Development Notes
- All 3D components use React Three Fiber patterns
- Particle systems pre-calculate random values to avoid render issues
- Animation timings designed for "juicy" feel (0.2-0.5s transitions)
- Game designed for desktop with keyboard/mouse controls
