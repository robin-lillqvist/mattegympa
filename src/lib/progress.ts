"use client";

import type { Grade, TopicId } from "./types";

const STORAGE_KEY = "mattegympa.progress.v2";

export type TopicGradeProgress = {
  attempts: number;
  correct: number;
  bestStreak: number;
  lastPlayed: number | null;
  stars: 0 | 1 | 2 | 3;
  masterEarned: boolean;
};

export type ProgressState = {
  name: string;
  xp: number;
  streak: { count: number; lastDate: string | null };
  /** topics[topicId][grade] = progress for that (topic, grade) pair */
  topics: Partial<Record<TopicId, Partial<Record<Grade, TopicGradeProgress>>>>;
  achievements: string[];
};

const DEFAULT_STATE: ProgressState = {
  name: "",
  xp: 0,
  streak: { count: 0, lastDate: null },
  topics: {},
  achievements: [],
};

export const loadProgress = (): ProgressState => {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
};

export const saveProgress = (state: ProgressState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const yesterdayKey = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export type SessionResult = {
  topic: TopicId;
  grade: Grade;
  master: boolean;
  correct: number;
  total: number;
  bestStreak: number;
};

const DEFAULT_TG: TopicGradeProgress = {
  attempts: 0,
  correct: 0,
  bestStreak: 0,
  lastPlayed: null,
  stars: 0,
  masterEarned: false,
};

export const applySessionResult = (
  state: ProgressState,
  result: SessionResult,
): ProgressState => {
  const next: ProgressState = JSON.parse(JSON.stringify(state));
  const topicRow = next.topics[result.topic] ?? {};
  const existing: TopicGradeProgress = topicRow[result.grade] ?? { ...DEFAULT_TG };

  existing.attempts += result.total;
  existing.correct += result.correct;
  existing.bestStreak = Math.max(existing.bestStreak, result.bestStreak);
  existing.lastPlayed = Date.now();

  const ratio = result.correct / result.total;

  if (result.master) {
    // Master trophy: earned at 80%+ correct on master mode
    if (ratio >= 0.8) existing.masterEarned = true;
  } else {
    const stars: 0 | 1 | 2 | 3 =
      ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;
    if (stars > existing.stars) existing.stars = stars;
  }

  topicRow[result.grade] = existing;
  next.topics[result.topic] = topicRow;

  // XP — master ger mer
  const xpPerCorrect = result.master ? 15 : 10;
  const xpGain =
    result.correct * xpPerCorrect +
    (result.master && existing.masterEarned ? 50 : 0) +
    (!result.master && existing.stars === 3 ? 25 : 0);
  next.xp += xpGain;

  // Streak per dag
  const today = todayKey();
  if (next.streak.lastDate !== today) {
    if (next.streak.lastDate === yesterdayKey()) next.streak.count += 1;
    else next.streak.count = 1;
    next.streak.lastDate = today;
  }

  // Achievements
  const ach = new Set(next.achievements);
  if (result.correct === result.total) ach.add("perfekt-omgang");
  if (result.master && existing.masterEarned) ach.add("forsta-mastare");
  if (next.streak.count >= 3) ach.add("streak-3");
  if (next.streak.count >= 7) ach.add("streak-7");
  if (next.xp >= 500) ach.add("xp-500");
  if (next.xp >= 2000) ach.add("xp-2000");
  next.achievements = Array.from(ach);

  return next;
};

/** Aggregate progress för ett ämne över alla årskurser (för stadie-/landningssidor). */
export const aggregateTopicProgress = (
  state: ProgressState,
  topic: TopicId,
): {
  attempts: number;
  correct: number;
  stars: number;
  trophies: number;
} => {
  const row = state.topics[topic];
  if (!row) return { attempts: 0, correct: 0, stars: 0, trophies: 0 };
  let attempts = 0;
  let correct = 0;
  let stars = 0;
  let trophies = 0;
  for (const tg of Object.values(row)) {
    if (!tg) continue;
    attempts += tg.attempts;
    correct += tg.correct;
    stars = Math.max(stars, tg.stars);
    if (tg.masterEarned) trophies += 1;
  }
  return { attempts, correct, stars, trophies };
};

export const getTopicGradeProgress = (
  state: ProgressState,
  topic: TopicId,
  grade: Grade,
): TopicGradeProgress => state.topics[topic]?.[grade] ?? { ...DEFAULT_TG };

export const ACHIEVEMENT_META: Record<string, { title: string; emoji: string; desc: string }> = {
  "perfekt-omgang": { title: "Perfekt omgång", emoji: "💯", desc: "Allt rätt i en omgång" },
  "forsta-mastare": { title: "Första Mästar-trofén", emoji: "🏆", desc: "Klarade Mästar-läget" },
  "streak-3": { title: "3 dagar i rad", emoji: "🔥", desc: "Tre dagar i sträck" },
  "streak-7": { title: "En vecka i rad", emoji: "🌟", desc: "Sju dagar i sträck" },
  "xp-500": { title: "500 XP", emoji: "⭐", desc: "Du har samlat 500 XP" },
  "xp-2000": { title: "2000 XP", emoji: "🚀", desc: "Du har samlat 2000 XP" },
};
