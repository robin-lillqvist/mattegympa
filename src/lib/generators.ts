import type { Exercise, Generator, Level, TopicId } from "./types";
import { makeChoices, pick, randInt, shuffle, uid } from "./rand";

const id = () => uid();

// Per-level helpers: pick a value from a level-specific bucket.
const byLevel = <T>(level: Level, buckets: [T, T, T, T]): T => buckets[level - 1];

// ============================================================
// LÅGSTADIET
// ============================================================

const talraknemastare: Generator = (rng, level) => {
  const max = byLevel(level, [20, 50, 100, 200]);
  const min = byLevel(level, [1, 1, 10, 10]);
  const kind = randInt(rng, 0, level >= 3 ? 2 : 1);

  if (kind === 0) {
    // Vilket tal är störst?
    const a = randInt(rng, min, max);
    let b = randInt(rng, min, max);
    while (b === a) b = randInt(rng, min, max);
    const correct = Math.max(a, b);
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Vilket tal är störst?`,
      choices: shuffle(rng, [a, b]).map(String),
      answer: String(correct),
    };
  }
  if (kind === 1) {
    const n = randInt(rng, Math.max(min, 2), max - 1);
    const before = rng() < 0.5;
    return {
      id: id(),
      kind: "input",
      prompt: before
        ? `Vilket tal kommer precis FÖRE ${n}?`
        : `Vilket tal kommer precis EFTER ${n}?`,
      answer: String(before ? n - 1 : n + 1),
    };
  }
  // Position questions (level 3+)
  const n = randInt(rng, level === 4 ? 100 : 11, max);
  const positions = ["entalen", "tiotalen", "hundratalen"];
  const digits = String(n).split("").reverse();
  const idx = randInt(rng, 0, Math.min(digits.length - 1, level === 4 ? 2 : 1));
  return {
    id: id(),
    kind: "input",
    prompt: `Vilken siffra står på ${positions[idx]} i talet ${n}?`,
    answer: digits[idx] ?? "0",
  };
};

const talkompisar: Generator = (rng, level) => {
  const target = byLevel(level, [10, 20, 100, 100]);
  const stepOf = byLevel(level, [1, 1, 10, 1]);
  let a: number;
  if (level === 3) {
    a = randInt(rng, 1, target / stepOf - 1) * stepOf;
  } else {
    a = randInt(rng, 1, target - 1);
  }
  const ans = target - a;
  if (rng() < 0.5) {
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Vilket tal saknas? ${a} + ? = ${target}`,
      choices: makeChoices(rng, ans, [-1, 1, -2, 2, stepOf, -stepOf]),
      answer: String(ans),
    };
  }
  return {
    id: id(),
    kind: "input",
    prompt: `Hur mycket fattas för att ${a} ska bli ${target}?`,
    answer: String(ans),
  };
};

const additionSub100: Generator = (rng, level) => {
  // L1: 1-10+1-10, L2: 1-20+1-20, L3: 1-50+1-50, L4: 1-99+1-99
  const max = byLevel(level, [10, 20, 50, 99]);
  const a = randInt(rng, 1, max);
  const b = randInt(rng, 1, max);
  const sum = a + b;
  if (rng() < 0.5) {
    return {
      id: id(),
      kind: "input",
      prompt: `${a} + ${b} = ?`,
      answer: String(sum),
    };
  }
  return {
    id: id(),
    kind: "multiple-choice",
    prompt: `${a} + ${b} = ?`,
    choices: makeChoices(rng, sum, [-1, 1, -10, 10, -2, 2]),
    answer: String(sum),
  };
};

const subtraktionSub100: Generator = (rng, level) => {
  const max = byLevel(level, [20, 50, 100, 200]);
  const minA = byLevel(level, [5, 10, 20, 50]);
  const a = randInt(rng, minA, max);
  const minB = byLevel(level, [2, 3, 5, 10]); // ensure non-trivial
  const b = randInt(rng, minB, a - 1);
  const diff = a - b;
  if (rng() < 0.5) {
    return {
      id: id(),
      kind: "input",
      prompt: `${a} − ${b} = ?`,
      answer: String(diff),
    };
  }
  return {
    id: id(),
    kind: "multiple-choice",
    prompt: `${a} − ${b} = ?`,
    choices: makeChoices(rng, diff, [-1, 1, -10, 10, -2, 2]),
    answer: String(diff),
  };
};

const talmonster: Generator = (rng, level) => {
  const stepOptions = byLevel<number[]>(level, [
    [2, 5, 10],
    [3, 4, 6],
    [7, 8, 9, 11],
    [12, 15, 25, -2, -5],
  ]);
  const step = pick(rng, stepOptions);
  const start = randInt(rng, 1, 20);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  return {
    id: id(),
    kind: "input",
    prompt: `Vad är nästa tal? ${seq.join(", ")}, ?`,
    answer: String(start + 4 * step),
    explanation: `Talen ${step > 0 ? "ökar" : "minskar"} med ${Math.abs(step)} varje gång.`,
  };
};

const MINUTE_WORDS: Record<number, string> = {
  5: "fem",
  10: "tio",
  15: "kvart",
  20: "tjugo",
  25: "tjugofem",
  30: "halv",
  35: "tjugofem",
  40: "tjugo",
  45: "kvart",
  50: "tio",
  55: "fem",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const describeTime = (h: number, m: number): string => {
  const next = h === 12 ? 1 : h + 1;
  if (m === 0) return `Klockan ${h}`;
  if (m === 30) return `Halv ${next}`;
  if (m === 15) return `Kvart över ${h}`;
  if (m === 45) return `Kvart i ${next}`;
  const word = MINUTE_WORDS[m];
  if (m < 30) return `${capitalize(word)} över ${h}`;
  return `${capitalize(word)} i ${next}`;
};

const klockan: Generator = (rng, level) => {
  const minuteBuckets = byLevel<number[]>(level, [
    [0, 0, 0, 0, 30], // L1: hela timmar, lite halvtimme
    [0, 15, 30, 45], // L2: hela, halvor, kvartar
    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], // L3: alla 5-min
    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], // L4: alla 5-min + word problems
  ]);
  // L4 mixes in word problems with 24h time
  if (level === 4 && rng() < 0.35) {
    const h = randInt(rng, 1, 23);
    const minutes = pick(rng, [0, 15, 30, 45]);
    const hh = String(h).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return {
      id: id(),
      kind: "input",
      prompt: `Klockan är ${hh}:${mm}. Hur många minuter är det till nästa hela timme?`,
      answer: String((60 - minutes) % 60 || 60),
    };
  }

  const h = randInt(rng, 1, 12);
  const minutes = pick(rng, minuteBuckets);
  const correct = describeTime(h, minutes);

  const candidates = new Set<string>([correct]);
  const tryAdd = (hh: number, mm: number) => {
    const nh = ((hh - 1 + 12) % 12) + 1;
    const nm = (mm + 60) % 60;
    const s = describeTime(nh, nm);
    if (s !== correct) candidates.add(s);
  };
  const swapHour = Math.max(1, Math.round(minutes / 5));
  const swapMin = (h % 12) * 5;
  tryAdd(swapHour, swapMin);
  tryAdd(h + 1, minutes);
  tryAdd(h - 1, minutes);
  tryAdd(h, minutes + 5);
  tryAdd(h, minutes - 5);
  tryAdd(h, (minutes + 30) % 60);

  const arr = Array.from(candidates).filter((s) => s !== correct);
  const distractors = shuffle(rng, arr).slice(0, 3);
  const choices = shuffle(rng, [correct, ...distractors]);

  return {
    id: id(),
    kind: "multiple-choice",
    prompt: `Vad är klockan?`,
    hint: "Tips: timvisaren är kortast, minutvisaren är längst.",
    visual: { kind: "clock", hours: h, minutes },
    choices,
    answer: correct,
    explanation: `Klockan är ${correct.toLowerCase()}.`,
  };
};

const former: Generator = (rng, level) => {
  const all: { sides: number; namn: string }[] = [
    { sides: 3, namn: "triangel" },
    { sides: 4, namn: "fyrhörning" },
    { sides: 5, namn: "femhörning" },
    { sides: 6, namn: "sexhörning" },
    { sides: 8, namn: "åttahörning" },
  ];
  const allowed = byLevel(level, [
    all.slice(0, 2),
    all.slice(0, 3),
    all.slice(0, 4),
    all,
  ]);
  if (rng() < 0.5) {
    const s = pick(rng, allowed);
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Hur många hörn har en ${s.namn}?`,
      choices: shuffle(rng, [s.sides, s.sides + 1, s.sides - 1, s.sides + 2]).map(String),
      answer: String(s.sides),
    };
  }
  const correct = pick(rng, allowed);
  const distractors = allowed.filter((s) => s.sides !== correct.sides);
  const opts = shuffle(rng, [
    correct.namn,
    ...shuffle(rng, distractors).slice(0, 3).map((d) => d.namn),
  ]);
  return {
    id: id(),
    kind: "multiple-choice",
    prompt: `Vilken form har ${correct.sides} hörn?`,
    choices: opts,
    answer: correct.namn,
  };
};

const matning: Generator = (rng, level) => {
  type Conversion = { from: string; to: string; factor: number; range: [number, number] };
  const easy: Conversion[] = [
    { from: "meter", to: "centimeter", factor: 100, range: [1, 5] },
    { from: "kilo", to: "gram", factor: 1000, range: [1, 5] },
  ];
  const mid: Conversion[] = [
    { from: "meter", to: "centimeter", factor: 100, range: [1, 9] },
    { from: "kilo", to: "gram", factor: 1000, range: [1, 9] },
    { from: "liter", to: "deciliter", factor: 10, range: [1, 9] },
  ];
  const hard: Conversion[] = [
    ...mid,
    { from: "meter", to: "millimeter", factor: 1000, range: [1, 9] },
    { from: "centimeter", to: "millimeter", factor: 10, range: [1, 20] },
  ];
  const master: Conversion[] = [
    ...hard,
    { from: "kilometer", to: "meter", factor: 1000, range: [1, 9] },
    { from: "liter", to: "centiliter", factor: 100, range: [1, 9] },
  ];
  const set = byLevel(level, [easy, mid, hard, master]);
  const c = pick(rng, set);
  const n = randInt(rng, c.range[0], c.range[1]);
  return {
    id: id(),
    kind: "input",
    prompt: `Hur många ${c.to} är ${n} ${c.from}?`,
    answer: String(n * c.factor),
  };
};

const halvorOchDelar: Generator = (rng, level) => {
  const denom = pick(
    rng,
    byLevel<number[]>(level, [[2], [2, 4], [2, 4, 3], [2, 4, 3, 5]]),
  );
  // Pick whole that divides evenly
  const range = byLevel<[number, number]>(level, [
    [2, 10],
    [4, 20],
    [6, 30],
    [10, 60],
  ]);
  let whole = randInt(rng, range[0], range[1]);
  while (whole % denom !== 0) whole = randInt(rng, range[0], range[1]);
  const ans = whole / denom;
  const label =
    denom === 2
      ? "en halv"
      : denom === 3
      ? "en tredjedel"
      : denom === 4
      ? "en fjärdedel"
      : "en femtedel";
  return {
    id: id(),
    kind: "input",
    prompt: `Hur mycket är ${label} av ${whole}?`,
    answer: String(ans),
    explanation: `${whole} / ${denom} = ${ans}`,
  };
};

// ============================================================
// MELLANSTADIET
// ============================================================

const multiplikationstabellen: Generator = (rng, level) => {
  const tables = byLevel<number[]>(level, [
    [2, 5, 10],
    [3, 4, 6],
    [7, 8, 9],
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  ]);
  const a = pick(rng, tables);
  const b = randInt(rng, 2, level === 4 ? 12 : 10);
  const ans = a * b;
  if (rng() < 0.5) {
    return {
      id: id(),
      kind: "input",
      prompt: `${a} · ${b} = ?`,
      answer: String(ans),
    };
  }
  return {
    id: id(),
    kind: "multiple-choice",
    prompt: `${a} · ${b} = ?`,
    choices: makeChoices(rng, ans, [a, -a, b, -b, 1, -1]),
    answer: String(ans),
  };
};

const division: Generator = (rng, level) => {
  const bMax = byLevel(level, [5, 10, 12, 12]);
  const qMax = byLevel(level, [5, 10, 12, 20]);
  const b = randInt(rng, 2, bMax);
  const q = randInt(rng, 2, qMax);
  const withRest = level >= 2 && rng() < (level === 2 ? 0.2 : 0.35);
  const rest = withRest ? randInt(rng, 1, b - 1) : 0;
  const a = b * q + rest;
  if (withRest) {
    return {
      id: id(),
      kind: "input",
      prompt: `${a} / ${b} — vad blir resten?`,
      answer: String(rest),
    };
  }
  return {
    id: id(),
    kind: "input",
    prompt: `${a} / ${b} = ?`,
    answer: String(q),
  };
};

const storaTal: Generator = (rng, level) => {
  const range = byLevel<[number, number]>(level, [
    [100, 999],
    [1000, 9999],
    [10000, 99999],
    [100000, 9999999],
  ]);
  const n = randInt(rng, range[0], range[1]);
  const positions = [
    "entalen",
    "tiotalen",
    "hundratalen",
    "tusentalen",
    "tiotusentalen",
    "hundratusentalen",
    "miljontalen",
  ];
  const digits = String(n).split("").reverse();
  const idx = randInt(rng, 0, digits.length - 1);
  return {
    id: id(),
    kind: "input",
    prompt: `Vilken siffra står på ${positions[idx]} i talet ${n}?`,
    answer: digits[idx] ?? "0",
  };
};

const decimaltal: Generator = (rng, level) => {
  const fmt = (n: number, d: number) => Number(n.toFixed(d)).toString().replace(".", ",");
  if (level <= 2) {
    const a = randInt(rng, 10, level === 1 ? 50 : 99) / 10;
    const b = randInt(rng, 10, level === 1 ? 50 : 99) / 10;
    const op = level === 1 ? "+" : pick(rng, ["+", "−"]);
    const ans = op === "+" ? a + b : Math.max(a, b) - Math.min(a, b);
    return {
      id: id(),
      kind: "input",
      prompt: `${fmt(a, 1)} ${op} ${fmt(b, 1)} = ?`,
      answer: fmt(ans, 1),
      hint: "Skriv decimalkomma som , eller .",
    };
  }
  if (level === 3) {
    const a = randInt(rng, 100, 999) / 100;
    const b = randInt(rng, 100, 999) / 100;
    const op = pick(rng, ["+", "−"]);
    const ans = op === "+" ? a + b : Math.max(a, b) - Math.min(a, b);
    return {
      id: id(),
      kind: "input",
      prompt: `${fmt(a, 2)} ${op} ${fmt(b, 2)} = ?`,
      answer: fmt(ans, 2),
      hint: "Skriv decimalkomma som , eller .",
    };
  }
  // L4: multiplicera med 10/100
  const a = randInt(rng, 10, 99) / 10;
  const mult = pick(rng, [10, 100, 1000]);
  return {
    id: id(),
    kind: "input",
    prompt: `${fmt(a, 1)} · ${mult} = ?`,
    answer: fmt(a * mult, 1),
    hint: "Skriv decimalkomma som , eller .",
  };
};

const brak: Generator = (rng, level) => {
  const denomChoices = byLevel<number[]>(level, [[2, 4], [4, 6, 8], [6, 8, 10], [8, 10, 12]]);
  const den = pick(rng, denomChoices);
  if (level <= 2) {
    const a = randInt(rng, 1, den - 1);
    const b = randInt(rng, 1, den - a);
    return {
      id: id(),
      kind: "input",
      prompt: `${a}/${den} + ${b}/${den} = ? (svara på formen täljare/nämnare)`,
      answer: `${a + b}/${den}`,
      hint: "Liknämniga bråk — addera täljarna.",
    };
  }
  if (level === 3) {
    // Jämför bråk
    const a = randInt(rng, 1, den - 1);
    let b = randInt(rng, 1, den - 1);
    while (b === a) b = randInt(rng, 1, den - 1);
    const correct = a > b ? `${a}/${den}` : `${b}/${den}`;
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Vilket bråk är störst?`,
      choices: shuffle(rng, [`${a}/${den}`, `${b}/${den}`]),
      answer: correct,
    };
  }
  // L4: förkortning - reducera ett bråk
  const factor = pick(rng, [2, 3, 4]);
  const reducedDen = pick(rng, [2, 3, 5, 7]);
  const reducedNum = randInt(rng, 1, reducedDen - 1);
  const numer = reducedNum * factor;
  const denom = reducedDen * factor;
  return {
    id: id(),
    kind: "input",
    prompt: `Förkorta så långt det går: ${numer}/${denom}. (svara på formen a/b)`,
    answer: `${reducedNum}/${reducedDen}`,
  };
};

const procent: Generator = (rng, level) => {
  const baseSet = byLevel<number[]>(level, [
    [100, 200, 400],
    [50, 80, 100, 200, 400],
    [60, 75, 120, 250, 500],
    [40, 90, 160, 350, 800],
  ]);
  const pctSet = byLevel<number[]>(level, [
    [50, 100],
    [10, 25, 50, 75],
    [5, 15, 20, 30],
    [5, 12, 35, 45, 80],
  ]);
  const base = pick(rng, baseSet);
  const pct = pick(rng, pctSet);
  const ans = (base * pct) / 100;
  return {
    id: id(),
    kind: "input",
    prompt: `Hur mycket är ${pct}% av ${base}?`,
    answer: String(ans),
  };
};

const geometriArea: Generator = (rng, level) => {
  const range = byLevel<[number, number]>(level, [
    [2, 6],
    [3, 12],
    [4, 20],
    [5, 30],
  ]);
  if (level >= 3 && rng() < 0.3) {
    // Triangelarea
    const bas = randInt(rng, range[0], range[1]);
    const hoj = randInt(rng, range[0], range[1]) * 2; // jämn så svaret blir heltal
    return {
      id: id(),
      kind: "input",
      prompt: `En triangel har basen ${bas} cm och höjden ${hoj} cm. Vad är arean i kvadratcentimeter? (bas·höjd/2)`,
      answer: String((bas * hoj) / 2),
    };
  }
  const w = randInt(rng, range[0], range[1]);
  const h = randInt(rng, range[0], range[1]);
  if (rng() < 0.5) {
    return {
      id: id(),
      kind: "input",
      prompt: `En rektangel är ${w} cm bred och ${h} cm hög. Vad är arean i kvadratcentimeter?`,
      answer: String(w * h),
    };
  }
  return {
    id: id(),
    kind: "input",
    prompt: `En rektangel är ${w} cm bred och ${h} cm hög. Vad är omkretsen i cm?`,
    answer: String(2 * (w + h)),
  };
};

const tidOchEnheter: Generator = (rng, level) => {
  type Conversion = { from: string; to: string; factor: number; range: [number, number] };
  const easy: Conversion[] = [
    { from: "timmar", to: "minuter", factor: 60, range: [1, 4] },
    { from: "minuter", to: "sekunder", factor: 60, range: [1, 5] },
  ];
  const mid: Conversion[] = [
    ...easy,
    { from: "km", to: "meter", factor: 1000, range: [1, 9] },
    { from: "meter", to: "cm", factor: 100, range: [1, 9] },
  ];
  const hard: Conversion[] = [
    ...mid,
    { from: "liter", to: "dl", factor: 10, range: [1, 9] },
    { from: "dygn", to: "timmar", factor: 24, range: [1, 5] },
  ];
  const master: Conversion[] = [
    ...hard,
    { from: "veckor", to: "dagar", factor: 7, range: [2, 8] },
    { from: "år", to: "månader", factor: 12, range: [2, 6] },
  ];
  const set = byLevel(level, [easy, mid, hard, master]);
  const c = pick(rng, set);
  const n = randInt(rng, c.range[0], c.range[1]);
  return {
    id: id(),
    kind: "input",
    prompt: `Hur många ${c.to} är ${n} ${c.from}?`,
    answer: String(n * c.factor),
  };
};

const statistik: Generator = (rng, level) => {
  const n = byLevel(level, [3, 4, 5, 6]);
  if (level >= 3 && rng() < 0.4) {
    // Median
    const values: number[] = Array.from({ length: n }, () => randInt(rng, 2, 30));
    const sorted = [...values].sort((a, b) => a - b);
    let median: number;
    if (sorted.length % 2 === 1) {
      median = sorted[Math.floor(sorted.length / 2)];
    } else {
      const a = sorted[sorted.length / 2 - 1];
      const b = sorted[sorted.length / 2];
      median = (a + b) / 2;
      // Ensure integer to keep input simple
      if (median !== Math.floor(median)) values[0] += 1;
    }
    const finalSorted = [...values].sort((a, b) => a - b);
    const finalMedian =
      finalSorted.length % 2 === 1
        ? finalSorted[Math.floor(finalSorted.length / 2)]
        : (finalSorted[finalSorted.length / 2 - 1] + finalSorted[finalSorted.length / 2]) / 2;
    return {
      id: id(),
      kind: "input",
      prompt: `Vad är medianen av: ${values.join(", ")}?`,
      answer: String(finalMedian),
      explanation: `Sorterat: ${finalSorted.join(", ")}.`,
    };
  }
  const max = byLevel(level, [10, 20, 30, 50]);
  const values: number[] = Array.from({ length: n }, () => randInt(rng, 2, max));
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum % n !== 0) values[0] += n - (sum % n);
  const finalSum = values.reduce((a, b) => a + b, 0);
  const mean = finalSum / n;
  return {
    id: id(),
    kind: "input",
    prompt: `Vad är medelvärdet av: ${values.join(", ")}?`,
    answer: String(mean),
    explanation: `Summa = ${finalSum}, antal = ${n}, medel = ${mean}`,
  };
};

// ============================================================
// HÖGSTADIET
// ============================================================

const algebraUttryck: Generator = (rng, level) => {
  if (level === 1) {
    // Substitution
    const a = randInt(rng, 2, 5);
    const b = randInt(rng, 1, 9);
    const x = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Beräkna ${a}x + ${b} när x = ${x}.`,
      answer: String(a * x + b),
    };
  }
  if (level === 2) {
    // Samla termer
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Förenkla: ${a}x + ${b}x. (Skriv på formen Nx)`,
      answer: `${a + b}x`,
    };
  }
  if (level === 3) {
    // Expansion
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 1, 8);
    return {
      id: id(),
      kind: "input",
      prompt: `Utveckla: ${a}(x + ${b}). (Skriv på formen Nx + M)`,
      answer: `${a}x + ${a * b}`,
    };
  }
  // L4 — combined
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 2, 5);
  const c = randInt(rng, 1, 6);
  return {
    id: id(),
    kind: "input",
    prompt: `Förenkla: ${a}x + ${b}(x + ${c}). (Skriv på formen Nx + M)`,
    answer: `${a + b}x + ${b * c}`,
  };
};

const ekvationer: Generator = (rng, level) => {
  if (level === 1) {
    // x + a = b
    const x = randInt(rng, 1, 15);
    const a = randInt(rng, 1, 15);
    return {
      id: id(),
      kind: "input",
      prompt: `Lös ekvationen: x + ${a} = ${x + a}. Vad är x?`,
      answer: String(x),
    };
  }
  if (level === 2) {
    // ax + b = c
    const a = randInt(rng, 2, 6);
    const x = randInt(rng, 1, 10);
    const b = randInt(rng, 1, 15);
    return {
      id: id(),
      kind: "input",
      prompt: `Lös ekvationen: ${a}x + ${b} = ${a * x + b}. Vad är x?`,
      answer: String(x),
      explanation: `${a}x = ${a * x}, så x = ${x}.`,
    };
  }
  if (level === 3) {
    // ax + b = cx + d
    const a = randInt(rng, 2, 6);
    let c = randInt(rng, 2, 6);
    while (a === c) c = randInt(rng, 2, 6);
    const x = randInt(rng, 1, 8);
    const b = randInt(rng, 1, 12);
    const d = a * x + b - c * x;
    return {
      id: id(),
      kind: "input",
      prompt: `Lös ekvationen: ${a}x + ${b} = ${c}x + ${d}. Vad är x?`,
      answer: String(x),
    };
  }
  // L4: med parenteser
  const a = randInt(rng, 2, 4);
  const b = randInt(rng, 1, 6);
  const x = randInt(rng, 1, 8);
  const total = a * (x + b);
  return {
    id: id(),
    kind: "input",
    prompt: `Lös ekvationen: ${a}(x + ${b}) = ${total}. Vad är x?`,
    answer: String(x),
    explanation: `Dela båda led med ${a} → x + ${b} = ${total / a}, så x = ${x}.`,
  };
};

const potenser: Generator = (rng, level) => {
  if (level === 1) {
    const n = randInt(rng, 2, 7);
    return { id: id(), kind: "input", prompt: `Vad är ${n}²?`, answer: String(n * n) };
  }
  if (level === 2) {
    const n = randInt(rng, 2, 15);
    return { id: id(), kind: "input", prompt: `Vad är ${n}²?`, answer: String(n * n) };
  }
  if (level === 3) {
    const n = randInt(rng, 2, 6);
    return { id: id(), kind: "input", prompt: `Vad är ${n}³?`, answer: String(n * n * n) };
  }
  // L4: rötter
  const root = randInt(rng, 4, 15);
  return {
    id: id(),
    kind: "input",
    prompt: `Vad är √${root * root}?`,
    answer: String(root),
  };
};

const pythagoras: Generator = (rng, level) => {
  const triples: [number, number, number][] = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [8, 15, 17],
    [9, 12, 15],
    [7, 24, 25],
    [20, 21, 29],
    [9, 40, 41],
  ];
  const pool = byLevel(level, [
    triples.slice(0, 1),
    triples.slice(0, 3),
    triples.slice(0, 5),
    triples,
  ]);
  const [a, b, c] = pick(rng, pool);
  if (level <= 2 || rng() < 0.5) {
    return {
      id: id(),
      kind: "input",
      prompt: `I en rätvinklig triangel är kateterna ${a} och ${b}. Hur lång är hypotenusan?`,
      answer: String(c),
    };
  }
  return {
    id: id(),
    kind: "input",
    prompt: `En rätvinklig triangel har en katet ${a} och hypotenusa ${c}. Hur lång är den andra kateten?`,
    answer: String(b),
  };
};

const funktioner: Generator = (rng, level) => {
  if (level === 1) {
    // y = x + m
    const m = randInt(rng, 1, 10);
    const x = randInt(rng, 1, 10);
    return {
      id: id(),
      kind: "input",
      prompt: `För funktionen y = x + ${m}, vad blir y när x = ${x}?`,
      answer: String(x + m),
    };
  }
  if (level === 2) {
    // y = kx
    const k = randInt(rng, 2, 6);
    const x = randInt(rng, -3, 8);
    return {
      id: id(),
      kind: "input",
      prompt: `För funktionen y = ${k}x, vad blir y när x = ${x}?`,
      answer: String(k * x),
    };
  }
  if (level === 3) {
    const k = randInt(rng, 2, 6);
    const m = randInt(rng, -5, 10);
    const x = randInt(rng, -3, 8);
    const y = k * x + m;
    const mStr = m >= 0 ? `+ ${m}` : `− ${Math.abs(m)}`;
    return {
      id: id(),
      kind: "input",
      prompt: `För funktionen y = ${k}x ${mStr}, vad blir y när x = ${x}?`,
      answer: String(y),
    };
  }
  // L4: hitta k
  const k = randInt(rng, 2, 5);
  const m = randInt(rng, 0, 5);
  const x = randInt(rng, 2, 8);
  const y = k * x + m;
  return {
    id: id(),
    kind: "input",
    prompt: `En linje passerar (0, ${m}) och (${x}, ${y}). Vad är riktningskoefficienten k?`,
    answer: String(k),
  };
};

const procentRanta: Generator = (rng, level) => {
  if (level === 1) {
    const base = pick(rng, [100, 200, 400, 1000]);
    const pct = pick(rng, [10, 25, 50]);
    return {
      id: id(),
      kind: "input",
      prompt: `Hur mycket är ${pct}% av ${base} kr?`,
      answer: String((base * pct) / 100),
    };
  }
  if (level === 2) {
    const base = pick(rng, [200, 400, 500, 800, 1000]);
    const pct = pick(rng, [10, 20, 25]);
    return {
      id: id(),
      kind: "input",
      prompt: `En vara kostar ${base} kr. Den höjs med ${pct}%. Vad är det nya priset?`,
      answer: String(base + (base * pct) / 100),
    };
  }
  if (level === 3) {
    const capital = pick(rng, [1000, 2000, 5000, 10000]);
    const rate = pick(rng, [2, 3, 4, 5]);
    return {
      id: id(),
      kind: "input",
      prompt: `Du sätter in ${capital} kr på ett konto med ${rate}% ränta per år. Hur mycket ränta får du efter 1 år?`,
      answer: String((capital * rate) / 100),
    };
  }
  // L4: ränta på ränta (2 år), enkel
  const capital = pick(rng, [1000, 2000, 5000]);
  const rate = pick(rng, [5, 10]);
  const factor = 1 + rate / 100;
  const after = Math.round(capital * factor * factor);
  return {
    id: id(),
    kind: "input",
    prompt: `${capital} kr placeras till ${rate}% ränta per år. Hur mycket finns på kontot efter 2 år (ränta på ränta)?`,
    answer: String(after),
  };
};

const sannolikhet: Generator = (rng, level) => {
  if (level === 1) {
    if (rng() < 0.5) {
      return {
        id: id(),
        kind: "input",
        prompt: `Du kastar en vanlig tärning. Vad är sannolikheten att få en sexa? Svara som bråk a/b.`,
        answer: "1/6",
      };
    }
    return {
      id: id(),
      kind: "input",
      prompt: `Du kastar ett mynt. Vad är sannolikheten för krona? Svara som bråk a/b.`,
      answer: "1/2",
    };
  }
  if (level === 2) {
    const r = randInt(rng, 1, 5);
    const b = randInt(rng, 1, 5);
    return {
      id: id(),
      kind: "input",
      prompt: `I en påse finns ${r} röda och ${b} blå kulor. Du drar en kula. Sannolikheten att den är röd? Svara som bråk a/b.`,
      answer: `${r}/${r + b}`,
    };
  }
  if (level === 3) {
    // Tärning ≥ N
    const n = randInt(rng, 3, 5);
    const favorable = 6 - n + 1;
    return {
      id: id(),
      kind: "input",
      prompt: `Du kastar en tärning. Vad är sannolikheten att få minst ${n}? Svara som bråk a/b.`,
      answer: `${favorable}/6`,
    };
  }
  // L4: två oberoende händelser
  return {
    id: id(),
    kind: "input",
    prompt: `Du kastar två tärningar. Vad är sannolikheten att båda visar samma tal? Svara som bråk a/b.`,
    answer: "6/36",
    accept: ["1/6"],
  };
};

const geometriVolym: Generator = (rng, level) => {
  if (level === 1) {
    const s = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `En kub har sidan ${s} cm. Vad är volymen i kubikcentimeter?`,
      answer: String(s * s * s),
    };
  }
  if (level === 2) {
    const l = randInt(rng, 2, 10);
    const w = randInt(rng, 2, 10);
    const h = randInt(rng, 2, 10);
    return {
      id: id(),
      kind: "input",
      prompt: `Ett rätblock har sidorna ${l} cm, ${w} cm och ${h} cm. Vad är volymen i kubikcentimeter?`,
      answer: String(l * w * h),
    };
  }
  if (level === 3) {
    // Begränsningsarea kub
    const s = randInt(rng, 2, 10);
    return {
      id: id(),
      kind: "input",
      prompt: `En kub har sidan ${s} cm. Vad är dess begränsningsarea (alla 6 sidor) i kvadratcentimeter?`,
      answer: String(6 * s * s),
    };
  }
  // L4: cylinder volym (π = 3.14, runda till heltal)
  const r = randInt(rng, 2, 6);
  const h = randInt(rng, 3, 10);
  const v = Math.round(3.14 * r * r * h);
  return {
    id: id(),
    kind: "input",
    prompt: `En cylinder har radien ${r} cm och höjden ${h} cm. Vad är volymen (V = π·r²·h, använd π ≈ 3,14, svara avrundat till heltal)?`,
    answer: String(v),
  };
};

const skalaOchProportion: Generator = (rng, level) => {
  if (level === 1) {
    const scale = pick(rng, [100, 200, 500]);
    const cmOnMap = randInt(rng, 2, 8);
    const realM = (cmOnMap * scale) / 100;
    return {
      id: id(),
      kind: "input",
      prompt: `På en karta är skalan 1:${scale}. Ett avstånd är ${cmOnMap} cm på kartan. Hur många meter är det i verkligheten?`,
      answer: String(realM),
    };
  }
  if (level === 2) {
    const scale = pick(rng, [1000, 5000, 10000, 50000]);
    const cmOnMap = randInt(rng, 2, 12);
    const realM = (cmOnMap * scale) / 100;
    return {
      id: id(),
      kind: "input",
      prompt: `På en karta är skalan 1:${scale}. Ett avstånd är ${cmOnMap} cm på kartan. Hur många meter är det i verkligheten?`,
      answer: String(realM),
    };
  }
  if (level === 3) {
    const a = randInt(rng, 2, 8);
    const b = a * randInt(rng, 2, 5);
    const c = randInt(rng, 2, 6);
    const ratio = b / a;
    return {
      id: id(),
      kind: "input",
      prompt: `${a} äpplen kostar ${b} kr. Vad kostar ${c} äpplen?`,
      answer: String(c * ratio),
    };
  }
  // L4: omvänd proportion / större tal
  const a = randInt(rng, 3, 8);
  const b = a * randInt(rng, 5, 10);
  const total = pick(rng, [b * 2, b * 3, b * 4]);
  const apples = (total / b) * a;
  return {
    id: id(),
    kind: "input",
    prompt: `${a} kg potatis kostar ${b} kr. Hur många kg får du för ${total} kr?`,
    answer: String(apples),
  };
};

// ---------- Nya ämnen ----------

const tredimFormer: Generator = (rng, level) => {
  const all: { sides: number; namn: string; ekv?: number }[] = [
    { sides: 4, namn: "rätblock" },
    { sides: 6, namn: "kub" },
    { sides: 0, namn: "klot" },
    { sides: 1, namn: "kon" },
    { sides: 2, namn: "cylinder" },
    { sides: 4, namn: "pyramid" },
  ];
  const pool = byLevel(level, [
    all.slice(0, 3),
    all.slice(0, 4),
    all.slice(0, 5),
    all,
  ]);
  const correct = pick(rng, pool);
  // Q: namnge form från beskrivning
  const descriptions: Record<string, string> = {
    klot: "Vilken 3D-form är helt rund?",
    kub: "Vilken 3D-form har 6 lika stora kvadratiska sidor?",
    rätblock: "Vilken 3D-form är som en låda med 6 rektangulära sidor?",
    cylinder: "Vilken 3D-form har två cirkulära ändar och en jämn rund sida?",
    kon: "Vilken 3D-form har en cirkulär botten och en spets?",
    pyramid: "Vilken 3D-form har en kvadratisk botten och en spets på toppen?",
  };
  const distractors = pool.filter((p) => p.namn !== correct.namn);
  const opts = shuffle(rng, [
    correct.namn,
    ...shuffle(rng, distractors).slice(0, 3).map((d) => d.namn),
  ]);
  return {
    id: id(),
    kind: "multiple-choice",
    prompt: descriptions[correct.namn] ?? `Vilken form passar?`,
    choices: opts,
    answer: correct.namn,
  };
};

const symmetri: Generator = (rng, level) => {
  // Föremål med känt antal symmetrilinjer
  const items = byLevel<{ namn: string; lines: number }[]>(level, [
    [
      { namn: "kvadrat", lines: 4 },
      { namn: "cirkel", lines: 999 },
      { namn: "liksidig triangel", lines: 3 },
      { namn: "rektangel", lines: 2 },
    ],
    [
      { namn: "kvadrat", lines: 4 },
      { namn: "rektangel", lines: 2 },
      { namn: "liksidig triangel", lines: 3 },
      { namn: "fjäril", lines: 1 },
      { namn: "hjärta", lines: 1 },
    ],
    [
      { namn: "kvadrat", lines: 4 },
      { namn: "rektangel", lines: 2 },
      { namn: "liksidig triangel", lines: 3 },
      { namn: "regelbunden femhörning", lines: 5 },
      { namn: "regelbunden sexhörning", lines: 6 },
    ],
    [
      { namn: "rätvinklig oliksidig triangel", lines: 0 },
      { namn: "parallellogram (ej rektangel)", lines: 0 },
      { namn: "regelbunden åttahörning", lines: 8 },
      { namn: "romb", lines: 2 },
      { namn: "liksidig triangel", lines: 3 },
    ],
  ]);
  const item = pick(rng, items);
  if (item.lines === 999) {
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Hur många symmetrilinjer har en ${item.namn}?`,
      choices: shuffle(rng, ["1", "2", "4", "Oändligt många"]),
      answer: "Oändligt många",
    };
  }
  const wrongs = [item.lines + 1, item.lines - 1, item.lines + 2, item.lines + 3].filter(
    (n) => n >= 0 && n !== item.lines,
  );
  const opts = shuffle(rng, [item.lines, ...shuffle(rng, wrongs).slice(0, 3)]).map(String);
  return {
    id: id(),
    kind: "multiple-choice",
    prompt: `Hur många symmetrilinjer har en ${item.namn}?`,
    choices: opts,
    answer: String(item.lines),
  };
};

const diagram: Generator = (rng, level) => {
  // Mini stapeldiagram: ge 3-5 staplar och fråga om en
  const n = byLevel(level, [3, 4, 4, 5]);
  const max = byLevel(level, [10, 15, 25, 50]);
  const labels = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
  const data = Array.from({ length: n }, (_, i) => ({
    label: labels[i],
    v: randInt(rng, 1, max),
  }));
  const sorted = [...data].sort((a, b) => b.v - a.v);
  const q = randInt(rng, 0, 2);
  if (q === 0) {
    const target = pick(rng, data);
    return {
      id: id(),
      kind: "input",
      prompt: `I diagrammet: ${data.map((d) => `${d.label}=${d.v}`).join(", ")}. Hur många på ${target.label}?`,
      answer: String(target.v),
    };
  }
  if (q === 1) {
    return {
      id: id(),
      kind: "input",
      prompt: `I diagrammet: ${data.map((d) => `${d.label}=${d.v}`).join(", ")}. På vilken dag var det flest?`,
      answer: sorted[0].label,
    };
  }
  const total = data.reduce((s, d) => s + d.v, 0);
  return {
    id: id(),
    kind: "input",
    prompt: `I diagrammet: ${data.map((d) => `${d.label}=${d.v}`).join(", ")}. Hur många totalt?`,
    answer: String(total),
  };
};

const negativaTal: Generator = (rng, level) => {
  if (level === 1) {
    // Temperatur — vilket är kallast
    const a = randInt(rng, -10, 5);
    let b = randInt(rng, -10, 5);
    while (b === a) b = randInt(rng, -10, 5);
    const colder = a < b ? a : b;
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Vilken temperatur är kallast?`,
      choices: shuffle(rng, [a, b]).map((n) => `${n}°C`),
      answer: `${colder}°C`,
    };
  }
  if (level === 2) {
    const a = randInt(rng, -10, 10);
    const b = randInt(rng, -10, 10);
    return {
      id: id(),
      kind: "input",
      prompt: `${a} + ${b} = ?`,
      answer: String(a + b),
    };
  }
  if (level === 3) {
    const a = randInt(rng, -15, 15);
    const b = randInt(rng, -15, 15);
    return {
      id: id(),
      kind: "input",
      prompt: `${a} − (${b}) = ?`,
      answer: String(a - b),
    };
  }
  // L4: multiplikation och vardagsproblem
  if (rng() < 0.5) {
    const a = randInt(rng, -8, -1);
    const b = randInt(rng, -8, 8);
    return {
      id: id(),
      kind: "input",
      prompt: `${a} · ${b} = ?`,
      answer: String(a * b),
    };
  }
  const morning = randInt(rng, -15, -5);
  const change = randInt(rng, 5, 20);
  return {
    id: id(),
    kind: "input",
    prompt: `På morgonen var det ${morning}°C. Det blev ${change}° varmare. Vad är temperaturen nu?`,
    answer: String(morning + change),
  };
};

const koordinatsystem: Generator = (rng, level) => {
  const range = byLevel<[number, number]>(level, [
    [0, 5],
    [0, 10],
    [-5, 5],
    [-10, 10],
  ]);
  const x = randInt(rng, range[0], range[1]);
  const y = randInt(rng, range[0], range[1]);
  if (rng() < 0.5) {
    return {
      id: id(),
      kind: "input",
      prompt: `En punkt har x-koordinaten ${x} och y-koordinaten ${y}. Skriv punkten på formen (x, y).`,
      answer: `(${x}, ${y})`,
      accept: [`(${x},${y})`, `${x},${y}`, `${x}, ${y}`],
    };
  }
  return {
    id: id(),
    kind: "input",
    prompt: `Punkten (${x}, ${y}) — vad är y-koordinaten?`,
    answer: String(y),
  };
};

const vinklar: Generator = (rng, level) => {
  if (level === 1) {
    const types: { angle: number; namn: string }[] = [
      { angle: randInt(rng, 10, 89), namn: "spetsig" },
      { angle: 90, namn: "rät" },
      { angle: randInt(rng, 91, 179), namn: "trubbig" },
      { angle: 180, namn: "rak" },
    ];
    const choice = pick(rng, types);
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `En vinkel är ${choice.angle}°. Vilken sorts vinkel är det?`,
      choices: shuffle(rng, ["spetsig", "rät", "trubbig", "rak"]),
      answer: choice.namn,
    };
  }
  if (level === 2) {
    // Vinkelsumma i triangel
    const a = randInt(rng, 30, 80);
    const b = randInt(rng, 30, 80);
    return {
      id: id(),
      kind: "input",
      prompt: `Två vinklar i en triangel är ${a}° och ${b}°. Vad är den tredje vinkeln? (Summan = 180°)`,
      answer: String(180 - a - b),
    };
  }
  if (level === 3) {
    // Komplement / supplement
    const v = randInt(rng, 20, 70);
    return {
      id: id(),
      kind: "input",
      prompt: `Två vinklar bildar tillsammans 180° (sidovinklar). Den ena är ${v}°. Hur stor är den andra?`,
      answer: String(180 - v),
    };
  }
  // L4 — vinkelsumma i fyrhörning
  const a = randInt(rng, 60, 120);
  const b = randInt(rng, 60, 120);
  const c = randInt(rng, 60, 120);
  return {
    id: id(),
    kind: "input",
    prompt: `Tre vinklar i en fyrhörning är ${a}°, ${b}° och ${c}°. Vad är den fjärde? (Summan = 360°)`,
    answer: String(360 - a - b - c),
  };
};

const cirkeln: Generator = (rng, level) => {
  // Använd π ≈ 3,14
  if (level === 1) {
    const r = randInt(rng, 2, 8);
    const o = Math.round(2 * 3.14 * r * 10) / 10;
    return {
      id: id(),
      kind: "input",
      prompt: `En cirkel har radien ${r} cm. Vad är omkretsen (O = 2π·r, π≈3,14)?`,
      answer: String(o).replace(".", ","),
      hint: "Avrunda till en decimal.",
    };
  }
  if (level === 2) {
    const r = randInt(rng, 2, 10);
    const a = Math.round(3.14 * r * r * 10) / 10;
    return {
      id: id(),
      kind: "input",
      prompt: `En cirkel har radien ${r} cm. Vad är arean (A = π·r², π≈3,14)?`,
      answer: String(a).replace(".", ","),
      hint: "Avrunda till en decimal.",
    };
  }
  if (level === 3) {
    const d = randInt(rng, 4, 20);
    const o = Math.round(3.14 * d * 10) / 10;
    return {
      id: id(),
      kind: "input",
      prompt: `En cirkel har diametern ${d} cm. Vad är omkretsen (O = π·d, π≈3,14)?`,
      answer: String(o).replace(".", ","),
    };
  }
  // L4: ge omkrets, hitta radien
  const r = randInt(rng, 2, 10);
  const o = Math.round(2 * 3.14 * r * 10) / 10;
  return {
    id: id(),
    kind: "input",
    prompt: `En cirkel har omkretsen ${String(o).replace(".", ",")} cm. Vad är radien (π≈3,14)?`,
    answer: String(r),
  };
};

const vetenskapligNotation: Generator = (rng, level) => {
  if (level === 1) {
    // 10^n värde
    const n = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Vad är 10^${n}?`,
      answer: String(10 ** n),
    };
  }
  if (level === 2) {
    // Skriv tal på grundpotensform: a · 10^n
    const a = randInt(rng, 2, 9);
    const n = randInt(rng, 2, 6);
    const value = a * 10 ** n;
    return {
      id: id(),
      kind: "input",
      prompt: `Skriv ${value} på grundpotensform a · 10^n. Svara på formen a*10^n med 1 ≤ a < 10.`,
      answer: `${a}*10^${n}`,
      accept: [`${a}·10^${n}`, `${a} · 10^${n}`, `${a}*10^${n}`, `${a}x10^${n}`],
    };
  }
  if (level === 3) {
    // Multiplikation av tiopotenser
    const m = randInt(rng, 2, 6);
    const n = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Vad är 10^${m} · 10^${n}? Svara som 10^k.`,
      answer: `10^${m + n}`,
    };
  }
  // L4: små tal med negativ exponent
  const a = randInt(rng, 2, 9);
  const n = randInt(rng, 2, 5);
  const decimal = a / 10 ** n;
  const decStr = decimal.toFixed(n).replace(".", ",");
  return {
    id: id(),
    kind: "input",
    prompt: `Skriv ${decStr} på grundpotensform a · 10^n (n kan vara negativ).`,
    answer: `${a}*10^-${n}`,
    accept: [`${a}·10^-${n}`, `${a} · 10^-${n}`, `${a}*10^(-${n})`],
  };
};

const likformighet: Generator = (rng, level) => {
  if (level === 1) {
    // Skala 2x
    const a = randInt(rng, 2, 8);
    const k = randInt(rng, 2, 4);
    return {
      id: id(),
      kind: "input",
      prompt: `En triangel förstoras med skalfaktor ${k}. En sida var ${a} cm. Hur lång är den nya sidan?`,
      answer: String(a * k),
    };
  }
  if (level === 2) {
    // Hitta saknad sida i likformig figur
    const k = randInt(rng, 2, 4);
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 3, 7);
    return {
      id: id(),
      kind: "input",
      prompt: `Två trianglar är likformiga. Stora triangelns sidor är ${a * k} och ${b * k} cm. Lilla triangelns motsvarande sida är ${a} cm. Vad är lilla triangelns andra sida?`,
      answer: String(b),
    };
  }
  if (level === 3) {
    // Area skalas med k^2
    const k = randInt(rng, 2, 4);
    const a1 = randInt(rng, 4, 15);
    return {
      id: id(),
      kind: "input",
      prompt: `Två likformiga figurer har skalfaktor ${k}. Den lilla har arean ${a1} cm². Vad är den storas area?`,
      answer: String(a1 * k * k),
    };
  }
  // L4: volym, k^3
  const k = randInt(rng, 2, 3);
  const v1 = randInt(rng, 4, 20);
  return {
    id: id(),
    kind: "input",
    prompt: `Två likformiga kroppar har skalfaktor ${k}. Den lilla har volymen ${v1} cm³. Vad är den storas volym?`,
    answer: String(v1 * k * k * k),
  };
};

// ============================================================
// REGISTRY
// ============================================================

export const GENERATORS: Record<TopicId, Generator> = {
  // Lågstadiet (12)
  talraknemastare,
  talkompisar,
  "addition-sub-100": additionSub100,
  "subtraktion-sub-100": subtraktionSub100,
  talmonster,
  klockan,
  former,
  "tredim-former": tredimFormer,
  matning,
  "halvor-och-delar": halvorOchDelar,
  symmetri,
  diagram,
  // Mellanstadiet (12)
  multiplikationstabellen,
  division,
  "stora-tal": storaTal,
  decimaltal,
  brak,
  procent,
  "negativa-tal": negativaTal,
  koordinatsystem,
  vinklar,
  "geometri-area": geometriArea,
  "tid-och-enheter": tidOchEnheter,
  statistik,
  // Högstadiet (12)
  "algebra-uttryck": algebraUttryck,
  ekvationer,
  potenser,
  pythagoras,
  funktioner,
  "procent-ranta": procentRanta,
  sannolikhet,
  "geometri-volym": geometriVolym,
  cirkeln,
  "skala-och-proportion": skalaOchProportion,
  likformighet,
  "vetenskaplig-notation": vetenskapligNotation,
};

export const generateSession = (
  topicId: TopicId,
  level: Level,
  count: number = 10,
): Exercise[] => {
  const gen = GENERATORS[topicId];
  if (!gen) throw new Error(`No generator for ${topicId}`);
  const out: Exercise[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 10) {
    guard++;
    const ex = gen(Math.random, level);
    const key = ex.visual
      ? `${ex.prompt}|${JSON.stringify(ex.visual)}`
      : `${ex.prompt}|${ex.answer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ex);
  }
  return out;
};

export const normalizeAnswer = (s: string): string =>
  s.trim().toLowerCase().replace(/\s+/g, "").replace(",", ".").replace(":", ".");
