import Link from "next/link";
import { notFound } from "next/navigation";
import { topicsForGradeAll, STAGES } from "@/lib/curriculum";
import { ALL_GRADES, stageForGrade, type Grade } from "@/lib/types";
import { StageBody } from "@/components/StageBody";
import { ProfileBadge } from "@/components/ProfileBadge";
import { GradeTopicsGrid } from "@/components/GradeTopicsGrid";

export function generateStaticParams() {
  return ALL_GRADES.map((g) => ({ grade: String(g) }));
}

const STAGE_TITLE = {
  lagstadiet: "Lågstadiet",
  mellanstadiet: "Mellanstadiet",
  hogstadiet: "Högstadiet",
} as const;

export default async function GradePage({ params }: PageProps<"/[grade]">) {
  const { grade } = await params;
  const g = Number(grade) as Grade;
  if (!ALL_GRADES.includes(g)) notFound();
  const stage = stageForGrade(g);
  const topics = topicsForGradeAll(g);
  const isDark = stage === "hogstadiet";

  return (
    <main className="flex-1 min-h-screen">
      <StageBody stage={stage} />

      <header className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-violet-600 text-white shadow-lg">
            π
          </span>
          <span>Mattegympa</span>
        </Link>
        <ProfileBadge />
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <Link
          href="/"
          className={`text-sm font-semibold ${isDark ? "text-sky-300 hover:text-sky-200" : "text-rose-600 hover:text-rose-700"}`}
        >
          ← Tillbaka
        </Link>
        <div className="mt-3 flex items-baseline gap-4 flex-wrap">
          <h1
            className="text-4xl md:text-5xl font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Årskurs {g}
          </h1>
          <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {STAGE_TITLE[stage]} • {STAGES[stage].subtitle}
          </span>
        </div>
        <p className={`mt-3 max-w-2xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Här är ämnena du tränar på i åk {g}. Klara ett ämne med tre stjärnor och prova sen
          Mästar-läget för att tjäna en trofé.
        </p>
      </section>

      <GradeTopicsGrid grade={g} topics={topics} />

      <footer className={`mt-20 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        Klicka på ett ämne för att börja träna.
      </footer>
    </main>
  );
}
