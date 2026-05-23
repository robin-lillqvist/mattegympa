import { notFound } from "next/navigation";
import Link from "next/link";
import { STAGES, STAGE_ORDER, getTopic, topicsForStage } from "@/lib/curriculum";
import type { Stage } from "@/lib/types";
import { StageBody } from "@/components/StageBody";
import { ExerciseSession } from "@/components/ExerciseSession";

export function generateStaticParams() {
  return STAGE_ORDER.flatMap((stage) =>
    topicsForStage(stage).map((t) => ({ stage, topic: t.id })),
  );
}

export default async function TopicPage({ params }: PageProps<"/[stage]/[topic]">) {
  const { stage, topic } = await params;
  if (!STAGE_ORDER.includes(stage as Stage)) notFound();
  const t = getTopic(topic);
  if (!t || t.stage !== stage) notFound();
  const s = STAGES[stage as Stage];
  const isDark = stage === "hogstadiet";

  return (
    <main className="flex-1 min-h-screen">
      <StageBody stage={stage as Stage} />

      <header className="max-w-3xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href={`/${stage}`} className={`text-sm font-semibold ${isDark ? "text-sky-300" : "text-rose-600"}`}>
          ← {s.title}
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
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              {t.skill}
            </p>
          </div>
        </div>
      </section>

      <ExerciseSession topicId={t.id} stage={stage as Stage} />
    </main>
  );
}
