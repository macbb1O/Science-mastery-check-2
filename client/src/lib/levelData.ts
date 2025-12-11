import { WorldId } from "./stores/useGameStore";

export type LevelType = "action" | "puzzle" | "quiz" | "beam" | "drag_drop" | "reaction";

export interface LevelQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Level {
  id: string;
  worldId: WorldId;
  name: string;
  description: string;
  type: LevelType;
  difficulty: 1 | 2 | 3;
  targetXP: number;
  targetCoins: number;
  questions?: LevelQuestion[];
  timeLimit?: number;
}

export const PHYSICS_LEVELS: Level[] = [
  {
    id: "physics_1",
    worldId: "physics",
    name: "What is Refraction?",
    description: "Learn how light bends when passing through different materials",
    type: "action",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "p1_q1",
        question: "What happens when light passes from one medium to another?",
        options: ["It stops", "It bends (refracts)", "It disappears", "Nothing"],
        correctIndex: 1,
      },
      {
        id: "p1_q2",
        question: "Refraction occurs because light travels at different...",
        options: ["Colors", "Speeds", "Directions", "Temperatures"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "physics_2",
    worldId: "physics",
    name: "What is Reflection?",
    description: "Discover how light bounces off surfaces",
    type: "action",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "p2_q1",
        question: "When light bounces off a surface, this is called...",
        options: ["Refraction", "Reflection", "Absorption", "Diffraction"],
        correctIndex: 1,
      },
      {
        id: "p2_q2",
        question: "The angle of incidence equals the angle of...",
        options: ["Refraction", "Diffraction", "Reflection", "Absorption"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "physics_3",
    worldId: "physics",
    name: "What is Albedo?",
    description: "Learn about surface reflectivity",
    type: "quiz",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "p3_q1",
        question: "Albedo measures how much light a surface...",
        options: ["Absorbs", "Reflects", "Creates", "Destroys"],
        correctIndex: 1,
      },
      {
        id: "p3_q2",
        question: "Which surface has higher albedo?",
        options: ["Dark asphalt", "Fresh snow", "Black clothing", "Dark soil"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "physics_4",
    worldId: "physics",
    name: "Earth's Albedo",
    description: "Why is Earth's albedo changing?",
    type: "quiz",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "p4_q1",
        question: "Earth's albedo is decreasing because of...",
        options: ["More snow", "Melting ice caps", "More clouds", "Volcanic ash"],
        correctIndex: 1,
      },
      {
        id: "p4_q2",
        question: "Lower albedo means Earth absorbs...",
        options: ["Less heat", "More heat", "No heat", "Same heat"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "physics_5",
    worldId: "physics",
    name: "Why Albedo Matters",
    description: "The importance of Earth's reflectivity",
    type: "quiz",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "p5_q1",
        question: "High albedo helps Earth by...",
        options: ["Trapping heat", "Reflecting sunlight", "Creating rain", "Stopping wind"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "physics_6",
    worldId: "physics",
    name: "Snell's Law Basics",
    description: "Master the formula n₁sinθ₁ = n₂sinθ₂",
    type: "beam",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "p6_q1",
        question: "In Snell's Law, 'n' represents the...",
        options: ["Angle", "Refractive index", "Speed", "Wavelength"],
        correctIndex: 1,
      },
      {
        id: "p6_q2",
        question: "If n₁ < n₂, the light ray bends...",
        options: ["Away from normal", "Toward the normal", "Not at all", "Backwards"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "physics_7",
    worldId: "physics",
    name: "Snell's Law #1",
    description: "Solve for the angle of refraction",
    type: "beam",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "p7_q1",
        question: "Light enters water (n=1.33) from air at 45°. The refracted angle is approximately...",
        options: ["32°", "45°", "60°", "28°"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "physics_8",
    worldId: "physics",
    name: "Refractive Index Formula",
    description: "Learn n = c/v",
    type: "quiz",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "p8_q1",
        question: "In n = c/v, 'c' represents...",
        options: ["Speed in medium", "Speed of light in vacuum", "Wavelength", "Frequency"],
        correctIndex: 1,
      },
      {
        id: "p8_q2",
        question: "A higher refractive index means light travels...",
        options: ["Faster", "Slower", "Same speed", "Backwards"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "physics_9",
    worldId: "physics",
    name: "Light in Water",
    description: "Calculate speed of light in water",
    type: "quiz",
    difficulty: 3,
    targetXP: 40,
    targetCoins: 25,
    questions: [
      {
        id: "p9_q1",
        question: "If c = 3×10⁸ m/s and n = 1.33, speed in water is...",
        options: ["2.26×10⁸ m/s", "4×10⁸ m/s", "1×10⁸ m/s", "3×10⁸ m/s"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "physics_10",
    worldId: "physics",
    name: "Light Puzzle Maze",
    description: "Guide the light beam through the maze!",
    type: "beam",
    difficulty: 3,
    targetXP: 50,
    targetCoins: 30,
    questions: [
      {
        id: "p10_q1",
        question: "To make light bend toward the normal, it must enter a medium with...",
        options: ["Lower n", "Higher n", "Same n", "Zero n"],
        correctIndex: 1,
      },
    ],
  },
];

export const CHEMISTRY_LEVELS: Level[] = [
  {
    id: "chem_1",
    worldId: "chemistry",
    name: "Acids vs Bases",
    description: "Identify acids and bases",
    type: "action",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "c1_q1",
        question: "Which of these is an acid?",
        options: ["NaOH", "HCl", "KOH", "Ca(OH)₂"],
        correctIndex: 1,
      },
      {
        id: "c1_q2",
        question: "Acids taste...",
        options: ["Bitter", "Sweet", "Sour", "Salty"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "chem_2",
    worldId: "chemistry",
    name: "Litmus Test",
    description: "Interpret litmus paper results",
    type: "action",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "c2_q1",
        question: "Red litmus turns blue in a...",
        options: ["Acid", "Base", "Neutral solution", "Water"],
        correctIndex: 1,
      },
      {
        id: "c2_q2",
        question: "Blue litmus turns red in a...",
        options: ["Base", "Acid", "Neutral solution", "Salt"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "chem_3",
    worldId: "chemistry",
    name: "Acid Dissociation",
    description: "What do acids release?",
    type: "quiz",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "c3_q1",
        question: "Acids dissociate to release...",
        options: ["OH⁻ ions", "H⁺ ions", "Na⁺ ions", "Cl⁻ ions"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "chem_4",
    worldId: "chemistry",
    name: "Base Dissociation",
    description: "What do bases release?",
    type: "quiz",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "c4_q1",
        question: "Bases dissociate to release...",
        options: ["H⁺ ions", "OH⁻ ions", "H₂O", "CO₂"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "chem_5",
    worldId: "chemistry",
    name: "pH Scale - Acids",
    description: "pH ranges for acids",
    type: "quiz",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "c5_q1",
        question: "Acids have a pH...",
        options: ["Above 7", "Below 7", "Exactly 7", "Above 14"],
        correctIndex: 1,
      },
      {
        id: "c5_q2",
        question: "A solution with pH = 3 is...",
        options: ["Neutral", "Basic", "Acidic", "Pure water"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "chem_6",
    worldId: "chemistry",
    name: "pH Scale - Bases",
    description: "pH ranges for bases",
    type: "quiz",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "c6_q1",
        question: "Bases have a pH...",
        options: ["Below 7", "Above 7", "Exactly 7", "Below 0"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "chem_7",
    worldId: "chemistry",
    name: "Sulfuric Acid",
    description: "H₂SO₄ dissociation",
    type: "reaction",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "c7_q1",
        question: "H₂SO₄ dissociates into...",
        options: ["H⁺ + SO₄²⁻", "2H⁺ + SO₄²⁻", "H₂ + SO₄", "H⁺ + S + O₄"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "chem_8",
    worldId: "chemistry",
    name: "Reaction Types",
    description: "Identify SD, DD, Synthesis, Decomposition",
    type: "reaction",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "c8_q1",
        question: "A + B → AB is a...",
        options: ["Decomposition", "Single displacement", "Synthesis", "Double displacement"],
        correctIndex: 2,
      },
      {
        id: "c8_q2",
        question: "AB → A + B is a...",
        options: ["Synthesis", "Decomposition", "Single displacement", "Double displacement"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "chem_9",
    worldId: "chemistry",
    name: "Predict Products #1",
    description: "Al + CuCl₂ → ?",
    type: "reaction",
    difficulty: 3,
    targetXP: 40,
    targetCoins: 25,
    questions: [
      {
        id: "c9_q1",
        question: "Al + CuCl₂ → ?",
        options: ["AlCl₃ + Cu", "AlCu + Cl₂", "No reaction", "Al₂O₃ + Cu"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "chem_10",
    worldId: "chemistry",
    name: "Neutralization",
    description: "Acid + Base reactions",
    type: "reaction",
    difficulty: 3,
    targetXP: 50,
    targetCoins: 30,
    questions: [
      {
        id: "c10_q1",
        question: "HCl + NaOH → ?",
        options: ["NaCl + H₂O", "NaCl + H₂", "Na + Cl + H₂O", "HNaCl + OH"],
        correctIndex: 0,
      },
    ],
  },
];

export const BIOLOGY_LEVELS: Level[] = [
  {
    id: "bio_1",
    worldId: "biology",
    name: "Prokaryotes vs Eukaryotes",
    description: "Compare cell types",
    type: "action",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "b1_q1",
        question: "Which cells have a nucleus?",
        options: ["Prokaryotes", "Eukaryotes", "Both", "Neither"],
        correctIndex: 1,
      },
      {
        id: "b1_q2",
        question: "Bacteria are...",
        options: ["Eukaryotes", "Prokaryotes", "Viruses", "Fungi"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "bio_2",
    worldId: "biology",
    name: "Identify Organelles",
    description: "Name the cell parts",
    type: "drag_drop",
    difficulty: 1,
    targetXP: 25,
    targetCoins: 10,
    questions: [
      {
        id: "b2_q1",
        question: "The 'powerhouse of the cell' is the...",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"],
        correctIndex: 1,
      },
      {
        id: "b2_q2",
        question: "Protein synthesis happens at the...",
        options: ["Mitochondria", "Nucleus", "Ribosome", "Vacuole"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "bio_3",
    worldId: "biology",
    name: "Organelle Functions",
    description: "Match organelles to their jobs",
    type: "drag_drop",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "b3_q1",
        question: "The Golgi apparatus is like a...",
        options: ["Power plant", "Post office", "Library", "Factory"],
        correctIndex: 1,
      },
      {
        id: "b3_q2",
        question: "Which stores water in plant cells?",
        options: ["Mitochondria", "Chloroplast", "Vacuole", "Nucleus"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "bio_4",
    worldId: "biology",
    name: "Plant Cell Special",
    description: "Organelles unique to plants",
    type: "quiz",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "b4_q1",
        question: "Which is found ONLY in plant cells?",
        options: ["Mitochondria", "Chloroplast", "Ribosome", "Nucleus"],
        correctIndex: 1,
      },
      {
        id: "b4_q2",
        question: "The cell wall is made of...",
        options: ["Protein", "Lipids", "Cellulose", "Starch"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "bio_5",
    worldId: "biology",
    name: "Mitochondria Deep Dive",
    description: "Energy production in cells",
    type: "quiz",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "b5_q1",
        question: "Mitochondria produce...",
        options: ["DNA", "ATP", "Proteins", "Sugars"],
        correctIndex: 1,
      },
      {
        id: "b5_q2",
        question: "The process is called...",
        options: ["Photosynthesis", "Cellular respiration", "Fermentation", "Digestion"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "bio_6",
    worldId: "biology",
    name: "Chloroplast Function",
    description: "How plants make food",
    type: "quiz",
    difficulty: 2,
    targetXP: 35,
    targetCoins: 20,
    questions: [
      {
        id: "b6_q1",
        question: "Chloroplasts contain...",
        options: ["Hemoglobin", "Chlorophyll", "Melanin", "Keratin"],
        correctIndex: 1,
      },
      {
        id: "b6_q2",
        question: "Photosynthesis converts light into...",
        options: ["Heat", "Chemical energy", "Sound", "Motion"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "bio_7",
    worldId: "biology",
    name: "Cell Theory",
    description: "The 3 postulates",
    type: "quiz",
    difficulty: 3,
    targetXP: 40,
    targetCoins: 25,
    questions: [
      {
        id: "b7_q1",
        question: "All living things are made of...",
        options: ["Atoms", "Cells", "DNA", "Water"],
        correctIndex: 1,
      },
      {
        id: "b7_q2",
        question: "New cells come from...",
        options: ["Nothing", "Existing cells", "Chemicals", "Sunlight"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "bio_8",
    worldId: "biology",
    name: "Cytoplasm Function",
    description: "The cell's gel-like filling",
    type: "quiz",
    difficulty: 2,
    targetXP: 30,
    targetCoins: 15,
    questions: [
      {
        id: "b8_q1",
        question: "Cytoplasm helps organelles...",
        options: ["Divide", "Stay in place", "Disappear", "Change color"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "bio_9",
    worldId: "biology",
    name: "Build-a-Cell Puzzle",
    description: "Construct a complete cell!",
    type: "drag_drop",
    difficulty: 3,
    targetXP: 50,
    targetCoins: 30,
    questions: [
      {
        id: "b9_q1",
        question: "The control center of the cell is the...",
        options: ["Ribosome", "Mitochondria", "Nucleus", "Vacuole"],
        correctIndex: 2,
      },
      {
        id: "b9_q2",
        question: "The cell membrane controls what...",
        options: ["The cell looks like", "Enters and exits", "Color", "Shape"],
        correctIndex: 1,
      },
    ],
  },
];

export const ALL_LEVELS: Level[] = [...PHYSICS_LEVELS, ...CHEMISTRY_LEVELS, ...BIOLOGY_LEVELS];

export const getLevelById = (id: string): Level | undefined => {
  return ALL_LEVELS.find((level) => level.id === id);
};

export const getLevelsByWorld = (worldId: WorldId): Level[] => {
  return ALL_LEVELS.filter((level) => level.worldId === worldId);
};

export const WORLD_INFO = {
  physics: {
    id: "physics" as WorldId,
    name: "Physics: Light & Refraction",
    description: "Master the properties of light",
    color: "#3b82f6",
    icon: "💡",
    requiredBadges: 0,
  },
  chemistry: {
    id: "chemistry" as WorldId,
    name: "Chemistry: Acids & Reactions",
    description: "Explore chemical reactions",
    color: "#22c55e",
    icon: "🧪",
    requiredBadges: 0,
  },
  biology: {
    id: "biology" as WorldId,
    name: "Biology: Cells & Organelles",
    description: "Discover the building blocks of life",
    color: "#a855f7",
    icon: "🧬",
    requiredBadges: 0,
  },
    linear_equation: {
    id: "linear_equation" as WorldId,
    name: "linear equation",
    description: "Discover the building blocks of life",
    color: "#F59E0B",
    icon: "📐",
    requiredBadges: 0,
  },
};
