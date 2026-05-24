"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { stageForGrade, type Grade, type Stage, type Topic } from "@/lib/types";
import { loadProgress, getTopicGradeProgress, type ProgressState } from "@/lib/progress";

const TILE_STYLES: Record<Stage, (idx: number) => string> = {
  lagstadiet: (idx) => {
    const palette = [
      "from-amber-200 to-orange-300 text-amber-950",
      "from-rose-200 to-pink-300 text-rose-950",
      "from-lime-200 to-emerald-300 text-emerald-950",
      "from-sky-200 to-cyan-300 text-sky-950",
    ];
    return `bg-gradient-to-br ${palette[idx % palette.length]}`;
  },
  mellanstadiet: (idx) => {
    const palette = [
      "from-sky-100 to-indigo-200 text-indigo-950",
      "from-cyan-100 to-sky-200 text-sky-950",
      "from-indigo-100 to-violet-200 text-violet-950",
      "from-emerald-100 to-teal-200 text-emerald-950",
    ];
    return `bg-gradient-to-br ${palette[idx % palette.length]}`;
  },
  hogstadiet: () =>
    "bg-slate-900/60 backdrop-blur border border-slate-700/50 text-slate-100 hover:border-fuchsia-500/40",
};

export function GradeTopicsGrid({ grade, topics }: { grade: Grade; topics: Topic[] }) {
  const [state, setState] = useState<ProgressState | null>(null);
  useEffect(() => {
    setState(loadProgress());
  }, []);

  const stage = stageForGrade(grade);
  const style = TILE_STYLES[stage];

  if (topics.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6">
        <p className="text-slate-500">Inga ämnen är registrerade för denna årskurs ännu.</p>
      </section>
    );
  }

  // Layout: 12 topics in 3 sections per stage means each grade gets ~4-10. Use 3 cols for clean grids.
  return (
    <section className="max-w-6xl mx-auto px-6 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {topics.map((t, idx) => {
        const tg = state ? getTopicGradeProgress(state, t.id, grade) : null;
        const stars = tg?.stars ?? 0;
        const trophy = tg?.masterEarned ?? false;
        const intro = t.introducedAt === grade;
        return (
          <Link
            key={t.id}
            href={`/${grade}/${t.id}`}
            className={`group relative overflow-hidden rounded-2xl p-6 min-h-[180px] flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl shadow-md ${style(idx)}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl">{t.emoji}</span>
              <div className="flex flex-col items-end gap-1">
                <Stars count={stars} stage={stage} />
                {trophy && (
                  <span className="text-xl" title="Mästar-trofé">
                    🏆
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3
                className="font-bold text-lg leading-tight"
                style={{ fontFamily: stage === "lagstadiet" ? "var(--font-display)" : undefined }}
              >
                {t.title}
              </h3>
              <p className="mt-1 text-sm opacity-80 leading-snug">{t.blurb}</p>
            </div>
            <div className="mt-2 text-xs font-semibold opacity-70">
              {intro ? "Introduceras här" : `Repeteras (från åk ${t.introducedAt})`}
            </div>
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
