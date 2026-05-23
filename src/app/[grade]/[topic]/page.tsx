import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopic } from "@/lib/curriculum";
import { ALL_GRADES, stageForGrade, type Grade } from "@/lib/types";
import { TOPICS } from "@/lib/curriculum";
import { StageBody } from "@/components/StageBody";
import { ExerciseSession } from "@/components/ExerciseSession";

export function generateStaticParams() {
  // För varje topic, generera en route per årskurs där topic är aktivt.
  return TOPICS.flatMap((t) =>
    t.grades.map((g) => ({ grade: String(g), topic: t.id })),
  );
}

export default async function GradeTopicPage({
  params,
}: PageProps<"/[grade]/[topic]">) {
  const { grade, topic } = await params;
  const g = Number(grade) as Grade;
  if (!ALL_GRADES.includes(g)) notFound();
  const t = getTopic(topic);
  if (!t || !t.grades.includes(g)) notFound();
  const stage = stageForGrade(g);
  const isDark = stage === "hogstadiet";

  return (
    <main className="flex-1 min-h-screen">
      <StageBody stage={stage} />

      <header className="max-w-3xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link
          href={`/${g}`}
          className={`text-sm font-semibold ${isDark ? "text-sky-300" : "text-rose-600"}`}
        >
          ← Åk {g}
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
              Årskurs {g} • {t.skill}
            </p>
          </div>
        </div>
      </section>

      <ExerciseSession topicId={t.id} grade={g} />
    </main>
  );
}
