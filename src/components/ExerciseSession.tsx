"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Exercise, Level, Stage, TopicId } from "@/lib/types";
import { generateSession, normalizeAnswer } from "@/lib/generators";
import {
  applySessionResult,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "@/lib/progress";
import { Confetti } from "./Confetti";
import { ClockFace } from "./ClockFace";

const SESSION_LENGTH = 10;

type Status = "idle" | "correct" | "wrong";

export function ExerciseSession({
  topicId,
  stage,
  level,
}: {
  topicId: TopicId;
  stage: Stage;
  level: Level;
}) {
  const [seed, setSeed] = useState(0);
  const exercises = useMemo<Exercise[]>(
    () => generateSession(topicId, level, SESSION_LENGTH),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topicId, level, seed],
  );
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [progressState, setProgressState] = useState<ProgressState | null>(null);
  const savedRef = useRef(false);

  const isDark = stage === "hogstadiet";
  const current = exercises[idx];

  const keyboardMode = (() => {
    if (!current || current.kind !== "input") return "text" as const;
    const a = current.answer;
    if (/^-?\d+$/.test(a)) return "numeric" as const;
    if (/^-?[\d.,]+$/.test(a)) return "decimal" as const;
    return "text" as const;
  })();

  useEffect(() => {
    setProgressState(loadProgress());
  }, []);

  useEffect(() => {
    if (done && !savedRef.current && progressState) {
      savedRef.current = true;
      const next = applySessionResult(progressState, {
        topic: topicId,
        correct: correctCount,
        total: exercises.length,
        bestStreak,
      });
      saveProgress(next);
      setProgressState(next);
      if (correctCount === exercises.length) {
        setConfettiTrigger((c) => c + 1);
      }
    }
  }, [done, progressState, correctCount, bestStreak, exercises.length, topicId]);

  const submit = (chosen?: string) => {
    if (status !== "idle" || !current) return;
    const userVal = (chosen ?? value).trim();
    if (!userVal) return;
    const userNorm = normalizeAnswer(userVal);
    const candidates = [current.answer, ...(current.accept ?? [])];
    const ok = candidates.some((c) => normalizeAnswer(c) === userNorm);
    if (ok) {
      setStatus("correct");
      setCorrectCount((c) => c + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStatus("wrong");
      setStreak(0);
    }
  };

  const advance = () => {
    setStatus("idle");
    setValue("");
    setRevealed(false);
    if (idx + 1 >= exercises.length) {
      setDone(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setValue("");
    setStatus("idle");
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setRevealed(false);
    setDone(false);
    savedRef.current = false;
  };

  if (done) {
    const ratio = correctCount / exercises.length;
    const stars: 0 | 1 | 2 | 3 = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <Confetti trigger={confettiTrigger} />
        <div className={`card p-8 text-center ${isDark ? "!bg-slate-900/70 !border-slate-700" : ""}`}>
          <div className="text-6xl mb-4 pop">{stars === 3 ? "🏆" : stars === 2 ? "🌟" : stars === 1 ? "👍" : "💪"}</div>
          <h2
            className="text-3xl font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {stars === 3 ? "Fantastiskt!" : stars === 2 ? "Bra jobbat!" : stars === 1 ? "Bra start!" : "Försök igen!"}
          </h2>
          <p className={`mt-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Du fick {correctCount} av {exercises.length} rätt.
          </p>
          <div className="mt-4 flex items-center justify-center gap-1 text-3xl">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < stars ? "text-amber-500" : isDark ? "text-slate-700" : "text-slate-300"}>
                ★
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={restart}
              className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              Kör en till omgång
            </button>
            <Link
              href={`/${stage}`}
              className={`px-6 py-3 rounded-full font-bold border ${isDark ? "border-slate-600 text-slate-200 hover:bg-slate-800" : "border-zinc-300 hover:bg-zinc-100"}`}
            >
              Tillbaka till {stage === "lagstadiet" ? "lågstadiet" : stage === "mellanstadiet" ? "mellanstadiet" : "högstadiet"}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!current) return null;

  const pct = (idx / exercises.length) * 100;

  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className={isDark ? "text-slate-400" : "text-slate-600"}>
          Fråga {idx + 1} / {exercises.length}
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            🔥 <strong>{streak}</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            ✅ <strong>{correctCount}</strong>
          </span>
        </span>
      </div>
      <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-zinc-200"}`}>
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div
        className={`mt-6 card p-8 ${isDark ? "!bg-slate-900/70 !border-slate-700" : ""} ${status === "wrong" ? "shake" : ""}`}
      >
        {current.visual?.kind === "clock" && (
          <div className="flex justify-center mb-6">
            <ClockFace
              hours={current.visual.hours}
              minutes={current.visual.minutes}
              size={220}
              dark={isDark}
            />
          </div>
        )}
        <p
          className="text-2xl md:text-3xl font-bold leading-snug"
          style={{ fontFamily: stage === "lagstadiet" ? "var(--font-display)" : undefined }}
        >
          {current.prompt}
        </p>
        {current.hint && (
          <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {current.hint}
          </p>
        )}

        <div className="mt-6">
          {current.kind === "multiple-choice" && current.choices ? (
            <div className="grid grid-cols-2 gap-3">
              {current.choices.map((c) => {
                const isCorrect = normalizeAnswer(c) === normalizeAnswer(current.answer);
                const picked = value === c;
                const showState = status !== "idle";
                const cls = showState
                  ? isCorrect
                    ? "bg-emerald-500 border-emerald-600 text-white"
                    : picked
                    ? "bg-rose-500 border-rose-600 text-white"
                    : isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-white border-zinc-200 text-slate-700"
                  : isDark
                  ? "bg-slate-800 border-slate-700 text-slate-100 hover:border-fuchsia-500"
                  : "bg-white border-zinc-200 hover:border-rose-400 hover:bg-rose-50";
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setValue(c);
                      submit(c);
                    }}
                    disabled={status !== "idle"}
                    className={`px-4 py-4 rounded-xl border-2 font-bold text-lg transition-colors ${cls}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-center gap-3"
            >
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={status !== "idle"}
                inputMode={keyboardMode}
                enterKeyHint="send"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Ditt svar"
                className={`flex-1 px-5 py-4 text-xl font-bold rounded-xl border-2 focus:outline-none focus:border-rose-500 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                    : "bg-white border-zinc-200"
                } ${status === "correct" ? "border-emerald-500" : ""} ${status === "wrong" ? "border-rose-500" : ""}`}
              />
              <button
                type="submit"
                disabled={status !== "idle" || !value.trim()}
                className="px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              >
                Svara
              </button>
            </form>
          )}
        </div>

        {status === "correct" && (
          <div
            className={`mt-5 p-4 rounded-xl border ${
              isDark
                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800"
            }`}
          >
            <strong>Rätt!</strong>{" "}
            {current.explanation && <span className="opacity-90">{current.explanation}</span>}
          </div>
        )}
        {status === "wrong" && (
          <div
            className={`mt-5 p-4 rounded-xl border ${
              isDark
                ? "bg-rose-500/15 border-rose-400/40 text-rose-200"
                : "bg-rose-500/10 border-rose-500/30 text-rose-800"
            }`}
          >
            <strong>Nästan!</strong> Rätt svar:{" "}
            <span className="font-mono font-bold">{current.answer}</span>
            {current.explanation && <div className="opacity-90 mt-1">{current.explanation}</div>}
          </div>
        )}

        {status !== "idle" && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={advance}
              autoFocus
              className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-lg"
            >
              {idx + 1 >= exercises.length ? "Avsluta" : "Nästa →"}
            </button>
          </div>
        )}

        {status === "idle" && current.kind === "input" && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            className={`mt-4 text-sm underline ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Visa svar
          </button>
        )}
        {revealed && status === "idle" && (
          <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Svar: <strong className="font-mono">{current.answer}</strong>
          </p>
        )}
      </div>
    </section>
  );
}
