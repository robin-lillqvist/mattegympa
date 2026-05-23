import { notFound } from "next/navigation";
import Link from "next/link";
import { STAGES, STAGE_ORDER, getTopic, topicsForStage } from "@/lib/curriculum";
import { LEVELS, type Level, type Stage } from "@/lib/types";
import { StageBody } from "@/components/StageBody";
import { ExerciseSession } from "@/components/ExerciseSession";

export function generateStaticParams() {
  return STAGE_ORDER.flatMap((stage) =>
    topicsForStage(stage).flatMap((t) =>
      LEVELS.map((lv) => ({ stage, topic: t.id, level: String(lv.id) })),
    ),
  );
}

export default async function TopicLevelPage({
  params,
}: PageProps<"/[stage]/[topic]/[level]">) {
  const { stage, topic, level } = await params;
  if (!STAGE_ORDER.includes(stage as Stage)) notFound();
  const t = getTopic(topic);
  if (!t || t.stage !== stage) notFound();
  const lvNum = Number(level);
  if (![1, 2, 3, 4].includes(lvNum)) notFound();
  const lv = LEVELS.find((l) => l.id === lvNum)!;
  const s = STAGES[stage as Stage];
  const isDark = stage === "hogstadiet";

  return (
    <main className="flex-1 min-h-screen">
      <StageBody stage={stage as Stage} />

      <header className="max-w-3xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href={`/${stage}/${topic}`} className={`text-sm font-semibold ${isDark ? "text-sky-300" : "text-rose-600"}`}>
          ← {t.title}
        </Link>
        <Link href="/" className="flex items-center gap-2 font-bold text-sm">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 via-rose-500 to-violet-600 text-white text-xs">
            π
          </span>
          Mattegympa
        </Link>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-4xl">{t.emoji}</span>
          <div>
            <h1
              className="text-3xl md:text-4xl font-black leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.title}
            </h1>
            <p className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {lv.emoji} {lv.title} • Nivå {lv.id} • {s.title}
            </p>
          </div>
        </div>
      </section>

      <ExerciseSession topicId={t.id} stage={stage as Stage} level={lvNum as Level} />
    </main>
  );
}
