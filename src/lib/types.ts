export type Stage = "lagstadiet" | "mellanstadiet" | "hogstadiet";

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
  | "addition-sub-100"
  | "subtraktion-sub-100"
  | "talmonster"
  | "klockan"
  | "former"
  | "matning"
  | "halvor-och-delar"
  // Mellanstadiet (4-6)
  | "multiplikationstabellen"
  | "division"
  | "stora-tal"
  | "decimaltal"
  | "brak"
  | "procent"
  | "negativa-tal"
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
  | "skala-och-proportion";

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
  /** Optional explanation shown after answering */
  explanation?: string;
};

export type Generator = (rng: () => number) => Exercise;
