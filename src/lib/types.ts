export type Stage = "lagstadiet" | "mellanstadiet" | "hogstadiet";

export type Level = 1 | 2 | 3 | 4;

export const LEVELS: { id: Level; title: string; blurb: string; emoji: string }[] = [
  { id: 1, title: "Lätt", emoji: "🌱", blurb: "Börja här — lugnt och enkelt." },
  { id: 2, title: "Medel", emoji: "🌿", blurb: "Lite tuffare — träna mer." },
  { id: 3, title: "Svår", emoji: "🌳", blurb: "Nu blir det utmanande." },
  { id: 4, title: "Mästare", emoji: "🏆", blurb: "För den som vill behärska det." },
];

export type StageInfo = {
  id: Stage;
  title: string;
  subtitle: string;
  grades: string;
  description: string;
  accent: string; // tailwind color base name, e.g. "amber"
};

export type TopicId =
  // Lågstadiet (1-3)
  | "talraknemastare"
  | "talkompisar"
  | "addition-sub-100"
  | "subtraktion-sub-100"
  | "talmonster"
  | "klockan"
  | "former"
  | "tredim-former"
  | "matning"
  | "halvor-och-delar"
  | "symmetri"
  | "diagram"
  // Mellanstadiet (4-6)
  | "multiplikationstabellen"
  | "negativa-tal"
  | "koordinatsystem"
  | "vinklar"
  | "division"
  | "stora-tal"
  | "decimaltal"
  | "brak"
  | "procent"
  | "geometri-area"
  | "tid-och-enheter"
  | "statistik"
  // Högstadiet (7-9)
  | "algebra-uttryck"
  | "ekvationer"
  | "potenser"
  | "pythagoras"
  | "funktioner"
  | "procent-ranta"
  | "sannolikhet"
  | "geometri-volym"
  | "skala-och-proportion"
  | "vetenskaplig-notation"
  | "cirkeln"
  | "likformighet";

export type Topic = {
  id: TopicId;
  stage: Stage;
  title: string;
  blurb: string;
  emoji: string;
  /** From Lgr22 — what skill this trains */
  skill: string;
  /** Difficulty 1-5 within stage */
  level: number;
};

export type ExerciseKind = "input" | "multiple-choice";

export type Visual = { kind: "clock"; hours: number; minutes: number };

export type Exercise = {
  id: string;
  kind: ExerciseKind;
  prompt: string;
  /** Optional rendered preface like a visual or extra context */
  hint?: string;
  /** For multiple-choice */
  choices?: string[];
  /** Canonical correct answer as string (compared after trim/normalize) */
  answer: string;
  /** Extra accepted strings (compared after normalize) */
  accept?: string[];
  /** Optional explanation shown after answering */
  explanation?: string;
  /** Optional graphic to render above the prompt */
  visual?: Visual;
};

export type Generator = (rng: () => number, level: Level) => Exercise;
