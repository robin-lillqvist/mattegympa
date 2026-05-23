"use client";

import type { Stage, TopicId } from "./types";

const STORAGE_KEY = "mattegympa.progress.v1";

export type TopicProgress = {
  attempts: number;
  correct: number;
  bestStreak: number;
  lastPlayed: number | null;
  stars: 0 | 1 | 2 | 3;
};

export type ProgressState = {
  name: string;
  xp: number;
  streak: { count: number; lastDate: string | null };
  topics: Partial<Record<TopicId, TopicProgress>>;
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
  correct: number;
  total: number;
  bestStreak: number;
};

export const applySessionResult = (
  state: ProgressState,
  result: SessionResult,
): ProgressState => {
  const next: ProgressState = JSON.parse(JSON.stringify(state));
  const existing: TopicProgress = next.topics[result.topic] ?? {
    attempts: 0,
    correct: 0,
    bestStreak: 0,
    lastPlayed: null,
    stars: 0,
  };
  existing.attempts += result.total;
  existing.correct += result.correct;
  existing.bestStreak = Math.max(existing.bestStreak, result.bestStreak);
  existing.lastPlayed = Date.now();
  const ratio = result.correct / result.total;
  const stars: 0 | 1 | 2 | 3 = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;
  if (stars > existing.stars) existing.stars = stars;
  next.topics[result.topic] = existing;

  const xpGain = result.correct * 10 + (stars === 3 ? 25 : stars === 2 ? 10 : 0);
  next.xp += xpGain;

  const today = todayKey();
  if (next.streak.lastDate !== today) {
    if (next.streak.lastDate === yesterdayKey()) next.streak.count += 1;
    else next.streak.count = 1;
    next.streak.lastDate = today;
  }

  // Achievements
  const ach = new Set(next.achievements);
  if (result.correct === result.total) ach.add("perfekt-omgang");
  if (next.streak.count >= 3) ach.add("streak-3");
  if (next.streak.count >= 7) ach.add("streak-7");
  if (next.xp >= 500) ach.add("xp-500");
  if (next.xp >= 2000) ach.add("xp-2000");
  next.achievements = Array.from(ach);

  return next;
};

export const stageProgress = (state: ProgressState, stage: Stage, topicIds: TopicId[]) => {
  let attempts = 0;
  let correct = 0;
  let stars = 0;
  for (const t of topicIds) {
    const tp = state.topics[t];
    if (!tp) continue;
    attempts += tp.attempts;
    correct += tp.correct;
    stars += tp.stars;
  }
  return {
    stage,
    attempts,
    correct,
    stars,
    maxStars: topicIds.length * 3,
  };
};

export const ACHIEVEMENT_META: Record<string, { title: string; emoji: string; desc: string }> = {
  "perfekt-omgang": {
    title: "Perfekt omgång",
    emoji: "💯",
    desc: "Allt rätt i en omgång",
  },
  "streak-3": { title: "3 dagar i rad", emoji: "🔥", desc: "Tre dagar i sträck" },
  "streak-7": { title: "En vecka i rad", emoji: "🏆", desc: "Sju dagar i sträck" },
  "xp-500": { title: "500 XP", emoji: "⭐", desc: "Du har samlat 500 XP" },
  "xp-2000": { title: "2000 XP", emoji: "🚀", desc: "Du har samlat 2000 XP" },
};
