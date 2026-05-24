import type { Grade, Level, Stage, StageInfo, Topic } from "./types";
import { GRADES_BY_STAGE, stageForGrade } from "./types";

export const STAGES: Record<Stage, StageInfo> = {
  lagstadiet: {
    id: "lagstadiet",
    title: "Lågstadiet",
    subtitle: "Årskurs 1–3",
    grades: "1–3",
    description:
      "Lek dig till tal, addition, klockan och former. Här bygger du grunden!",
    accent: "amber",
  },
  mellanstadiet: {
    id: "mellanstadiet",
    title: "Mellanstadiet",
    subtitle: "Årskurs 4–6",
    grades: "4–6",
    description:
      "Multiplikation, bråk, decimaltal och geometri. Dags att utmana hjärnan!",
    accent: "sky",
  },
  hogstadiet: {
    id: "hogstadiet",
    title: "Högstadiet",
    subtitle: "Årskurs 7–9",
    grades: "7–9",
    description:
      "Algebra, ekvationer, Pythagoras och funktioner. Förbered dig för gymnasiet.",
    accent: "violet",
  },
};

export const STAGE_ORDER: Stage[] = ["lagstadiet", "mellanstadiet", "hogstadiet"];

/**
 * Per Lgr22 + typisk svensk läromedelsprogression (se LEROPLAN.md).
 * `introducedAt` = den årskurs där ämnet typiskt börjar / utgör huvudfokus.
 * `grades` = alla årskurser där innehållet är aktivt.
 *
 * Fördelningen är 4 ämnen per årskurs per stadium (3×4 = 12 totalt per stadium).
 * Det ger ett symmetriskt 4-kort-per-rad rutnät grupperat per årskurs.
 */
export const TOPICS: Topic[] = [
  // ---------- Lågstadiet ----------

  // åk 1 — talgrund + de fyra räknesätten (intro)
  {
    id: "talraknemastare",
    stage: "lagstadiet",
    title: "Talen 0–100",
    blurb: "Lär dig räkna, jämföra och placera tal på tallinjen.",
    emoji: "🔢",
    skill: "Naturliga tal och deras egenskaper",
    level: 1,
    introducedAt: 1,
    grades: [1, 2, 3],
  },
  {
    id: "talkompisar",
    stage: "lagstadiet",
    title: "Talkompisar",
    blurb: "Hitta talen som tillsammans blir 10, 20 eller 100.",
    emoji: "🤝",
    skill: "Talkamrater och uppdelning av tal",
    level: 1,
    introducedAt: 1,
    grades: [1, 2],
  },
  {
    id: "addition-sub-100",
    stage: "lagstadiet",
    title: "Addition",
    blurb: "Plussa ihop tal — från enkla 3+4 till skriftliga uppställningar.",
    emoji: "➕",
    skill: "Räknemetoder för addition",
    level: 2,
    introducedAt: 1,
    grades: [1, 2, 3],
  },
  {
    id: "subtraktion-sub-100",
    stage: "lagstadiet",
    title: "Subtraktion",
    blurb: "Ta bort och räkna mellanrum mellan tal.",
    emoji: "➖",
    skill: "Räknemetoder för subtraktion",
    level: 2,
    introducedAt: 1,
    grades: [1, 2, 3],
  },

  // åk 2 — bredd: tid, former, mönster, mätning
  {
    id: "klockan",
    stage: "lagstadiet",
    title: "Klockan",
    blurb: "Hela timmar, halvtimmar, kvartar och 5-minutersintervall.",
    emoji: "🕒",
    skill: "Tid och tidsuppfattning",
    level: 3,
    introducedAt: 2,
    grades: [1, 2, 3],
  },
  {
    id: "former",
    stage: "lagstadiet",
    title: "Geometriska former",
    blurb: "Cirklar, trianglar, kvadrater och rektanglar.",
    emoji: "🔷",
    skill: "Grundläggande 2D-geometri",
    level: 1,
    introducedAt: 2,
    grades: [1, 2],
  },
  {
    id: "talmonster",
    stage: "lagstadiet",
    title: "Talmönster",
    blurb: "Hitta nästa tal i serien.",
    emoji: "🧩",
    skill: "Mönster i talföljder",
    level: 2,
    introducedAt: 2,
    grades: [1, 2, 3],
  },
  {
    id: "matning",
    stage: "lagstadiet",
    title: "Mäta och väga",
    blurb: "Centimeter, meter, gram och kilo.",
    emoji: "📏",
    skill: "Mätning av längd, vikt och volym",
    level: 3,
    introducedAt: 2,
    grades: [2, 3],
  },

  // åk 3 — abstraktion: bråk, 3D, symmetri, diagram
  {
    id: "halvor-och-delar",
    stage: "lagstadiet",
    title: "Halvor och delar",
    blurb: "Dela upp i lika stora delar — enkla bråk.",
    emoji: "🍕",
    skill: "Del av helhet, enkla bråk",
    level: 4,
    introducedAt: 3,
    grades: [2, 3],
  },
  {
    id: "tredim-former",
    stage: "lagstadiet",
    title: "3D-former",
    blurb: "Klot, kon, cylinder och rätblock.",
    emoji: "🧊",
    skill: "Tredimensionella objekt",
    level: 2,
    introducedAt: 3,
    grades: [3],
  },
  {
    id: "symmetri",
    stage: "lagstadiet",
    title: "Symmetri",
    blurb: "Vilka former har en symmetrilinje?",
    emoji: "🦋",
    skill: "Symmetri i bilder och former",
    level: 3,
    introducedAt: 3,
    grades: [2, 3],
  },
  {
    id: "diagram",
    stage: "lagstadiet",
    title: "Tabeller och diagram",
    blurb: "Läs av enkla diagram och tabeller.",
    emoji: "📊",
    skill: "Enkla tabeller och diagram",
    level: 3,
    introducedAt: 3,
    grades: [3],
  },

  // ---------- Mellanstadiet ----------

  // åk 4 — skriftlig räkning, decimaltal-intro, stora tal
  {
    id: "stora-tal",
    stage: "mellanstadiet",
    title: "Stora tal",
    blurb: "Tusental, tiotusental och positionssystemet.",
    emoji: "💯",
    skill: "Positionssystemet",
    level: 2,
    introducedAt: 4,
    grades: [4, 5],
  },
  {
    id: "multiplikationstabellen",
    stage: "mellanstadiet",
    title: "Multiplikationstabellen",
    blurb: "Träna 1–10:ans tabell tills du knäcker den.",
    emoji: "✖️",
    skill: "Multiplikation, automatiserad",
    level: 1,
    introducedAt: 4,
    grades: [4],
  },
  {
    id: "division",
    stage: "mellanstadiet",
    title: "Division",
    blurb: "Dela tal jämnt och med rest.",
    emoji: "➗",
    skill: "Division och samband med multiplikation",
    level: 2,
    introducedAt: 4,
    grades: [4, 5],
  },
  {
    id: "decimaltal",
    stage: "mellanstadiet",
    title: "Decimaltal",
    blurb: "Räkna med tal som har decimaler.",
    emoji: "🔟",
    skill: "Decimaltal och deras egenskaper",
    level: 3,
    introducedAt: 4,
    grades: [4, 5, 6],
  },

  // åk 5 — bråk fullt, procent intro, negativa tal, vinklar
  {
    id: "brak",
    stage: "mellanstadiet",
    title: "Bråk",
    blurb: "Liknämniga bråk, olika nämnare och förkortning.",
    emoji: "🍰",
    skill: "Bråk, del av helhet och antal",
    level: 3,
    introducedAt: 5,
    grades: [4, 5, 6],
  },
  {
    id: "procent",
    stage: "mellanstadiet",
    title: "Procent",
    blurb: "Procent som del av hundra.",
    emoji: "％",
    skill: "Procent och samband med bråk",
    level: 4,
    introducedAt: 5,
    grades: [5, 6],
  },
  {
    id: "negativa-tal",
    stage: "mellanstadiet",
    title: "Negativa tal",
    blurb: "Tal under noll — termometer-tänk.",
    emoji: "🌡️",
    skill: "Rationella tal inklusive negativa tal",
    level: 3,
    introducedAt: 5,
    grades: [5, 6],
  },
  {
    id: "vinklar",
    stage: "mellanstadiet",
    title: "Vinklar",
    blurb: "Räta, spetsiga och trubbiga vinklar.",
    emoji: "📐",
    skill: "Vinkelmått",
    level: 3,
    introducedAt: 5,
    grades: [5, 6],
  },

  // åk 6 — koordinater, geometri sammansatta, statistik, enhetsbyten
  {
    id: "koordinatsystem",
    stage: "mellanstadiet",
    title: "Koordinatsystem",
    blurb: "Hitta punkter med x- och y-koordinater.",
    emoji: "📍",
    skill: "Koordinatsystem",
    level: 3,
    introducedAt: 6,
    grades: [4, 5, 6],
  },
  {
    id: "geometri-area",
    stage: "mellanstadiet",
    title: "Omkrets och area",
    blurb: "Beräkna för rektanglar, kvadrater och trianglar.",
    emoji: "📐",
    skill: "Geometri – omkrets och area",
    level: 4,
    introducedAt: 6,
    grades: [4, 5, 6],
  },
  {
    id: "tid-och-enheter",
    stage: "mellanstadiet",
    title: "Tid och enheter",
    blurb: "Omvandla mellan enheter och räkna tid.",
    emoji: "⏱️",
    skill: "Enhetsbyten",
    level: 3,
    introducedAt: 6,
    grades: [4, 5, 6],
  },
  {
    id: "statistik",
    stage: "mellanstadiet",
    title: "Medelvärde & diagram",
    blurb: "Tolka data, räkna medelvärde, median, typvärde.",
    emoji: "📊",
    skill: "Lägesmått och tolkning av data",
    level: 4,
    introducedAt: 6,
    grades: [5, 6],
  },

  // ---------- Högstadiet ----------

  // åk 7 — algebra grundläggande, ekvationer enkla, pythagoras intro
  {
    id: "algebra-uttryck",
    stage: "hogstadiet",
    title: "Algebraiska uttryck",
    blurb: "Förenkla, expandera och sätt in värden.",
    emoji: "𝑥",
    skill: "Algebraiska uttryck",
    level: 1,
    introducedAt: 7,
    grades: [7, 8],
  },
  {
    id: "ekvationer",
    stage: "hogstadiet",
    title: "Ekvationer",
    blurb: "Lös linjära ekvationer steg för steg.",
    emoji: "⚖️",
    skill: "Linjära ekvationer",
    level: 2,
    introducedAt: 7,
    grades: [7, 8, 9],
  },
  {
    id: "pythagoras",
    stage: "hogstadiet",
    title: "Pythagoras sats",
    blurb: "Beräkna sidor i rätvinkliga trianglar.",
    emoji: "📐",
    skill: "Pythagoras sats",
    level: 4,
    introducedAt: 7,
    grades: [7, 8],
  },
  {
    id: "procent-ranta",
    stage: "hogstadiet",
    title: "Procent och förändring",
    blurb: "Förändringsfaktor, höjningar, sänkningar och ränta.",
    emoji: "💰",
    skill: "Procent, ränta och förändringsfaktor",
    level: 3,
    introducedAt: 7,
    grades: [7, 8],
  },

  // åk 8 — funktioner, geometri 3D, cirkeln
  {
    id: "funktioner",
    stage: "hogstadiet",
    title: "Funktioner",
    blurb: "Räta linjens ekvation och värdetabeller.",
    emoji: "📈",
    skill: "Linjära funktioner",
    level: 4,
    introducedAt: 8,
    grades: [8, 9],
  },
  {
    id: "geometri-volym",
    stage: "hogstadiet",
    title: "Volym och area",
    blurb: "Räkna volym på rätblock, cylindrar mm.",
    emoji: "📦",
    skill: "Geometri – volym, area",
    level: 4,
    introducedAt: 8,
    grades: [8, 9],
  },
  {
    id: "cirkeln",
    stage: "hogstadiet",
    title: "Cirkeln",
    blurb: "Omkrets, area och pi.",
    emoji: "⭕",
    skill: "Cirkelns geometri",
    level: 3,
    introducedAt: 8,
    grades: [8, 9],
  },
  {
    id: "potenser",
    stage: "hogstadiet",
    title: "Potenser och rötter",
    blurb: "Kvadrater, kuber, kvadratrötter.",
    emoji: "²",
    skill: "Potenslagar och kvadratrötter",
    level: 3,
    introducedAt: 8,
    grades: [7, 8, 9],
  },

  // åk 9 — likformighet, grundpotensform, sannolikhet, 3D-skala
  {
    id: "likformighet",
    stage: "hogstadiet",
    title: "Likformighet",
    blurb: "Skala mellan likformiga figurer.",
    emoji: "🔺",
    skill: "Likformighet och kongruens",
    level: 4,
    introducedAt: 9,
    grades: [9],
  },
  {
    id: "vetenskaplig-notation",
    stage: "hogstadiet",
    title: "Tiopotenser",
    blurb: "Skriv stora och små tal med 10-potenser.",
    emoji: "🔬",
    skill: "Potenser och grundpotensform",
    level: 4,
    introducedAt: 9,
    grades: [9],
  },
  {
    id: "sannolikhet",
    stage: "hogstadiet",
    title: "Sannolikhet",
    blurb: "Tärningar, mynt och enkla utfall.",
    emoji: "🎲",
    skill: "Sannolikhet och kombinatorik",
    level: 3,
    introducedAt: 9,
    grades: [8, 9],
  },
  {
    id: "skala-och-proportion",
    stage: "hogstadiet",
    title: "Skala & proportion",
    blurb: "Kartor, ritningar och proportionella samband.",
    emoji: "🗺️",
    skill: "Skala och proportionalitet",
    level: 3,
    introducedAt: 9,
    grades: [5, 6, 9],
  },
];

export const topicsForStage = (stage: Stage): Topic[] =>
  TOPICS.filter((t) => t.stage === stage);

export const topicsForGrade = (grade: Grade): Topic[] =>
  TOPICS.filter((t) => t.introducedAt === grade);

export const getTopic = (id: string): Topic | undefined =>
  TOPICS.find((t) => t.id === id);

/**
 * Mappar en (årskurs, mästar-läge) till den interna L1–L4-svårigheten
 * som befintliga generatorer använder. Pedagogiken bakom:
 *
 * - Inom ett stadium ger åk N = N:te nivån (åk 1 → L1, åk 5 → L2, åk 9 → L3).
 * - Mästar-läge bumpar upp en nivå (åk 1 master = L2-svårighet, åk 9 master = L4).
 * - L4 är "utöver årskursens grundinnehåll" — perfekt för Mästar-trofén.
 */
export const effectiveLevel = (grade: Grade, master: boolean): Level => {
  const stage = stageForGrade(grade);
  const stageGrades = GRADES_BY_STAGE[stage];
  const idx = stageGrades.indexOf(grade); // 0, 1, eller 2
  const base = (idx + 1) as 1 | 2 | 3;
  if (!master) return base;
  return Math.min(base + 1, 4) as Level;
};

/** Hämta ämnen som är aktiva i en viss årskurs. */
export const topicsForGradeAll = (grade: Grade): Topic[] =>
  TOPICS.filter((t) => t.grades.includes(grade));
