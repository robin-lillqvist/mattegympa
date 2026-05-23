import type { Exercise, Generator, TopicId } from "./types";
import { makeChoices, pick, randInt, shuffle, uid } from "./rand";

const id = () => uid();

// ============================================================
// LÅGSTADIET
// ============================================================

const talraknemastare: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    // Vilket tal är större?
    const a = randInt(rng, 10, 99);
    let b = randInt(rng, 10, 99);
    while (b === a) b = randInt(rng, 10, 99);
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
    // Vilket tal kommer före / efter?
    const n = randInt(rng, 5, 98);
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
  // Tiotal och ental
  const n = randInt(rng, 11, 99);
  const askTiotal = rng() < 0.5;
  return {
    id: id(),
    kind: "input",
    prompt: askTiotal
      ? `Hur många tiotal har talet ${n}?`
      : `Hur många ental har talet ${n}?`,
    answer: String(askTiotal ? Math.floor(n / 10) : n % 10),
  };
};

const additionSub100: Generator = (rng) => {
  const a = randInt(rng, 5, 60);
  const b = randInt(rng, 5, Math.min(40, 99 - a));
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

const subtraktionSub100: Generator = (rng) => {
  const a = randInt(rng, 20, 99);
  const b = randInt(rng, 1, a - 1);
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

const talmonster: Generator = (rng) => {
  const start = randInt(rng, 1, 20);
  const step = pick(rng, [2, 3, 5, 10]);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  return {
    id: id(),
    kind: "input",
    prompt: `Vad är nästa tal? ${seq.join(", ")}, ?`,
    answer: String(start + 4 * step),
    explanation: `Talen ökar med ${step} varje gång.`,
  };
};

const klockan: Generator = (rng) => {
  const h = randInt(rng, 1, 12);
  const minutes = pick(rng, [0, 15, 30, 45]);
  const text =
    minutes === 0
      ? `Klockan är ${h}.00 (hel timme). Hur många minuter är det till nästa hela timme?`
      : minutes === 30
      ? `Klockan är halv ${h === 12 ? 1 : h + 1} (alltså ${h}.30). Hur många minuter återstår till hel timme?`
      : minutes === 15
      ? `Klockan är kvart över ${h} (${h}.15). Hur många minuter är det till nästa hela timme?`
      : `Klockan är kvart i ${h === 12 ? 1 : h + 1} (${h}.45). Hur många minuter är det till nästa hela timme?`;
  return {
    id: id(),
    kind: "input",
    prompt: text,
    answer: String(60 - minutes),
  };
};

const former: Generator = (rng) => {
  const shapes: { sides: number; namn: string }[] = [
    { sides: 3, namn: "triangel" },
    { sides: 4, namn: "fyrhörning" },
    { sides: 5, namn: "femhörning" },
    { sides: 6, namn: "sexhörning" },
    { sides: 8, namn: "åttahörning" },
  ];
  if (rng() < 0.5) {
    const s = pick(rng, shapes);
    return {
      id: id(),
      kind: "multiple-choice",
      prompt: `Hur många hörn har en ${s.namn}?`,
      choices: shuffle(rng, [s.sides, s.sides + 1, s.sides - 1, s.sides + 2]).map(String),
      answer: String(s.sides),
    };
  }
  const correct = pick(rng, shapes);
  const distractors = shapes.filter((s) => s.sides !== correct.sides);
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

const matning: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    const m = randInt(rng, 1, 9);
    return {
      id: id(),
      kind: "input",
      prompt: `Hur många centimeter är ${m} meter?`,
      answer: String(m * 100),
    };
  }
  if (kind === 1) {
    const kg = randInt(rng, 1, 9);
    return {
      id: id(),
      kind: "input",
      prompt: `Hur många gram är ${kg} kilo?`,
      answer: String(kg * 1000),
    };
  }
  const cm = pick(rng, [100, 200, 300, 500, 700]);
  return {
    id: id(),
    kind: "input",
    prompt: `Hur många meter är ${cm} cm?`,
    answer: String(cm / 100),
  };
};

const halvorOchDelar: Generator = (rng) => {
  const whole = pick(rng, [4, 6, 8, 10, 12, 20]);
  const denom = pick(rng, [2, 4]);
  if (whole % denom !== 0) return halvorOchDelar(rng);
  const ans = whole / denom;
  const label = denom === 2 ? "halva" : "fjärdedel";
  return {
    id: id(),
    kind: "input",
    prompt: `Hur mycket är en ${label} av ${whole}?`,
    answer: String(ans),
    explanation: `${whole} / ${denom} = ${ans}`,
  };
};

// ============================================================
// MELLANSTADIET
// ============================================================

const multiplikationstabellen: Generator = (rng) => {
  const a = randInt(rng, 2, 10);
  const b = randInt(rng, 2, 10);
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

const division: Generator = (rng) => {
  const b = randInt(rng, 2, 10);
  const q = randInt(rng, 2, 12);
  const withRest = rng() < 0.25;
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

const storaTal: Generator = (rng) => {
  const n = randInt(rng, 1000, 99999);
  const positions = ["entalen", "tiotalen", "hundratalen", "tusentalen", "tiotusentalen"];
  const digits = String(n).split("").reverse();
  const idx = Math.min(randInt(rng, 0, digits.length - 1), positions.length - 1);
  return {
    id: id(),
    kind: "input",
    prompt: `Vilken siffra står på ${positions[idx]} i talet ${n}?`,
    answer: digits[idx] ?? "0",
  };
};

const decimaltal: Generator = (rng) => {
  const a = randInt(rng, 10, 90) / 10;
  const b = randInt(rng, 10, 90) / 10;
  const op = pick(rng, ["+", "−"]);
  const ans = op === "+" ? a + b : a - b;
  return {
    id: id(),
    kind: "input",
    prompt: `${a.toFixed(1)} ${op} ${b.toFixed(1)} = ?`,
    answer: Number(ans.toFixed(1)).toString().replace(".", ","),
    hint: "Skriv decimalkomma som , eller .",
  };
};

const brak: Generator = (rng) => {
  const den = pick(rng, [4, 6, 8, 10]);
  const a = randInt(rng, 1, den - 1);
  const b = randInt(rng, 1, den - a);
  return {
    id: id(),
    kind: "input",
    prompt: `${a}/${den} + ${b}/${den} = ? (svara på formen täljare/nämnare)`,
    answer: `${a + b}/${den}`,
    hint: "Liknämniga bråk — addera täljarna.",
  };
};

const procent: Generator = (rng) => {
  const base = pick(rng, [50, 80, 100, 120, 200, 250, 400]);
  const pct = pick(rng, [10, 20, 25, 50, 75]);
  const ans = (base * pct) / 100;
  return {
    id: id(),
    kind: "input",
    prompt: `Hur mycket är ${pct}% av ${base}?`,
    answer: String(ans),
  };
};

const negativaTal: Generator = (rng) => {
  const a = randInt(rng, -10, 10);
  const b = randInt(rng, -10, 10);
  const ans = a + b;
  return {
    id: id(),
    kind: "input",
    prompt: `(${a}) + (${b}) = ?`,
    answer: String(ans),
  };
};

const geometriArea: Generator = (rng) => {
  const w = randInt(rng, 2, 12);
  const h = randInt(rng, 2, 12);
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

const tidOchEnheter: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    const h = randInt(rng, 1, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Hur många minuter är ${h} timmar?`,
      answer: String(h * 60),
    };
  }
  if (kind === 1) {
    const km = randInt(rng, 1, 9);
    return {
      id: id(),
      kind: "input",
      prompt: `Hur många meter är ${km} km?`,
      answer: String(km * 1000),
    };
  }
  const l = randInt(rng, 1, 9);
  return {
    id: id(),
    kind: "input",
    prompt: `Hur många deciliter är ${l} liter?`,
    answer: String(l * 10),
  };
};

const statistik: Generator = (rng) => {
  const n = randInt(rng, 3, 5);
  const values: number[] = Array.from({ length: n }, () => randInt(rng, 2, 20));
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

const algebraUttryck: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 2, 9);
    const x = randInt(rng, 2, 9);
    const ans = a * x + b;
    return {
      id: id(),
      kind: "input",
      prompt: `Beräkna ${a}x + ${b} när x = ${x}.`,
      answer: String(ans),
    };
  }
  if (kind === 1) {
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Förenkla: ${a}x + ${b}x. (Skriv på formen Nx)`,
      answer: `${a + b}x`,
    };
  }
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 1, 5);
  return {
    id: id(),
    kind: "input",
    prompt: `Utveckla: ${a}(x + ${b}). (Skriv på formen Nx + M)`,
    answer: `${a}x + ${a * b}`,
  };
};

const ekvationer: Generator = (rng) => {
  const a = randInt(rng, 2, 8);
  const x = randInt(rng, 1, 12);
  const b = randInt(rng, 1, 20);
  const c = a * x + b;
  return {
    id: id(),
    kind: "input",
    prompt: `Lös ekvationen: ${a}x + ${b} = ${c}. Vad är x?`,
    answer: String(x),
    explanation: `${a}x = ${c} − ${b} = ${a * x}, så x = ${x}.`,
  };
};

const potenser: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    const n = randInt(rng, 2, 12);
    return {
      id: id(),
      kind: "input",
      prompt: `Vad är ${n}²?`,
      answer: String(n * n),
    };
  }
  if (kind === 1) {
    const n = randInt(rng, 2, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Vad är ${n}³?`,
      answer: String(n * n * n),
    };
  }
  const root = randInt(rng, 2, 12);
  return {
    id: id(),
    kind: "input",
    prompt: `Vad är √${root * root}?`,
    answer: String(root),
  };
};

const pythagoras: Generator = (rng) => {
  // Pythagoras-tripplar
  const triples: [number, number, number][] = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [8, 15, 17],
    [9, 12, 15],
    [7, 24, 25],
  ];
  const [a, b, c] = pick(rng, triples);
  if (rng() < 0.5) {
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

const funktioner: Generator = (rng) => {
  const k = randInt(rng, 1, 5);
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
};

const procentRanta: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    const base = pick(rng, [200, 400, 500, 800, 1000, 1500, 2000]);
    const pct = pick(rng, [5, 10, 15, 20, 25]);
    return {
      id: id(),
      kind: "input",
      prompt: `En vara kostar ${base} kr. Den höjs med ${pct}%. Vad är det nya priset?`,
      answer: String(base + (base * pct) / 100),
    };
  }
  if (kind === 1) {
    const base = pick(rng, [200, 400, 800, 1000, 2000]);
    const pct = pick(rng, [10, 20, 25, 50]);
    return {
      id: id(),
      kind: "input",
      prompt: `En vara kostar ${base} kr. Den sänks med ${pct}%. Vad är det nya priset?`,
      answer: String(base - (base * pct) / 100),
    };
  }
  const capital = pick(rng, [1000, 2000, 5000, 10000]);
  const rate = pick(rng, [2, 3, 4, 5]);
  return {
    id: id(),
    kind: "input",
    prompt: `Du sätter in ${capital} kr på ett konto med ${rate}% ränta per år. Hur mycket ränta får du efter 1 år?`,
    answer: String((capital * rate) / 100),
  };
};

const sannolikhet: Generator = (rng) => {
  const kind = randInt(rng, 0, 2);
  if (kind === 0) {
    const target = randInt(rng, 1, 6);
    return {
      id: id(),
      kind: "input",
      prompt: `Du kastar en vanlig tärning. Vad är sannolikheten att få ${target}? Svara som bråk a/b.`,
      answer: "1/6",
    };
  }
  if (kind === 1) {
    return {
      id: id(),
      kind: "input",
      prompt: `Du kastar ett mynt. Vad är sannolikheten för krona? Svara som bråk a/b.`,
      answer: "1/2",
    };
  }
  const r = randInt(rng, 1, 5);
  const b = randInt(rng, 1, 5);
  return {
    id: id(),
    kind: "input",
    prompt: `I en påse finns ${r} röda och ${b} blå kulor. Du drar en kula. Vad är sannolikheten att den är röd? Svara som bråk a/b.`,
    answer: `${r}/${r + b}`,
  };
};

const geometriVolym: Generator = (rng) => {
  const kind = randInt(rng, 0, 1);
  if (kind === 0) {
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
  const s = randInt(rng, 2, 10);
  return {
    id: id(),
    kind: "input",
    prompt: `En kub har sidan ${s} cm. Vad är volymen i kubikcentimeter?`,
    answer: String(s * s * s),
  };
};

const skalaOchProportion: Generator = (rng) => {
  const kind = randInt(rng, 0, 1);
  if (kind === 0) {
    const scale = pick(rng, [100, 500, 1000, 5000, 10000]);
    const cmOnMap = randInt(rng, 2, 12);
    const realM = (cmOnMap * scale) / 100;
    return {
      id: id(),
      kind: "input",
      prompt: `På en karta är skalan 1:${scale}. Ett avstånd är ${cmOnMap} cm på kartan. Hur många meter är det i verkligheten?`,
      answer: String(realM),
    };
  }
  const a = randInt(rng, 2, 8);
  const b = a * randInt(rng, 2, 5);
  const c = randInt(rng, 2, 6);
  const ratio = b / a;
  const d = c * ratio;
  return {
    id: id(),
    kind: "input",
    prompt: `${a} äpplen kostar ${b} kr. Vad kostar ${c} äpplen (proportionellt)?`,
    answer: String(d),
  };
};

// ============================================================
// REGISTRY
// ============================================================

export const GENERATORS: Record<TopicId, Generator> = {
  // Lågstadiet
  talraknemastare,
  "addition-sub-100": additionSub100,
  "subtraktion-sub-100": subtraktionSub100,
  talmonster,
  klockan,
  former,
  matning,
  "halvor-och-delar": halvorOchDelar,
  // Mellanstadiet
  multiplikationstabellen,
  division,
  "stora-tal": storaTal,
  decimaltal,
  brak,
  procent,
  "negativa-tal": negativaTal,
  "geometri-area": geometriArea,
  "tid-och-enheter": tidOchEnheter,
  statistik,
  // Högstadiet
  "algebra-uttryck": algebraUttryck,
  ekvationer,
  potenser,
  pythagoras,
  funktioner,
  "procent-ranta": procentRanta,
  sannolikhet,
  "geometri-volym": geometriVolym,
  "skala-och-proportion": skalaOchProportion,
};

export const generateSession = (topicId: TopicId, count: number = 10): Exercise[] => {
  const gen = GENERATORS[topicId];
  if (!gen) throw new Error(`No generator for ${topicId}`);
  const out: Exercise[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 8) {
    guard++;
    const ex = gen(Math.random);
    const key = ex.prompt;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ex);
  }
  return out;
};

/** Normalize the user's input for forgiving comparison */
export const normalizeAnswer = (s: string): string =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(",", ".");
