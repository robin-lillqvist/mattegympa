"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Stage, Topic } from "@/lib/types";
import { loadProgress, type ProgressState } from "@/lib/progress";

const TILE_STYLES: Record<Stage, (idx: number) => string> = {
  lagstadiet: (idx) => {
    const palette = [
      "from-amber-200 to-orange-300 text-amber-950",
      "from-rose-200 to-pink-300 text-rose-950",
      "from-lime-200 to-emerald-300 text-emerald-950",
      "from-sky-200 to-cyan-300 text-sky-950",
      "from-fuchsia-200 to-pink-300 text-fuchsia-950",
      "from-yellow-200 to-amber-300 text-amber-950",
      "from-teal-200 to-cyan-300 text-teal-950",
      "from-violet-200 to-fuchsia-300 text-violet-950",
    ];
    return `bg-gradient-to-br ${palette[idx % palette.length]}`;
  },
  mellanstadiet: (idx) => {
    const palette = [
      "from-sky-100 to-indigo-200 text-indigo-950",
      "from-cyan-100 to-sky-200 text-sky-950",
      "from-indigo-100 to-violet-200 text-violet-950",
      "from-emerald-100 to-teal-200 text-emerald-950",
      "from-fuchsia-100 to-pink-200 text-fuchsia-950",
    ];
    return `bg-gradient-to-br ${palette[idx % palette.length]}`;
  },
  hogstadiet: () =>
    "bg-slate-900/60 backdrop-blur border border-slate-700/50 text-slate-100 hover:border-fuchsia-500/40",
};

export function StageTopicsGrid({ stage, topics }: { stage: Stage; topics: Topic[] }) {
  const [state, setState] = useState<ProgressState | null>(null);
  useEffect(() => {
    setState(loadProgress());
  }, []);

  const style = TILE_STYLES[stage];

  return (
    <section className="max-w-6xl mx-auto px-6 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {topics.map((t, idx) => {
        const tp = state?.topics[t.id];
        const stars = tp?.stars ?? 0;
        return (
          <Link
            key={t.id}
            href={`/${stage}/${t.id}`}
            className={`group relative overflow-hidden rounded-2xl p-6 min-h-[170px] flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl shadow-md ${style(idx)}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl">{t.emoji}</span>
              <Stars count={stars} stage={stage} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight" style={{ fontFamily: stage === "lagstadiet" ? "var(--font-display)" : undefined }}>
                {t.title}
              </h3>
              <p className="mt-1 text-sm opacity-80 leading-snug">{t.blurb}</p>
            </div>
            {tp && tp.attempts > 0 && (
              <div className="mt-3 text-xs opacity-70">
                {tp.correct}/{tp.attempts} rätt • {Math.round((tp.correct / tp.attempts) * 100)}%
              </div>
            )}
          </Link>
        );
      })}
    </section>
  );
}

function Stars({ count, stage }: { count: number; stage: Stage }) {
  const filled = stage === "hogstadiet" ? "text-amber-300" : "text-amber-500";
  const empty = stage === "hogstadiet" ? "text-slate-600" : "text-black/15";
  return (
    <div className="flex gap-0.5 text-lg">
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? filled : empty}>
          ★
        </span>
      ))}
    </div>
  );
}
