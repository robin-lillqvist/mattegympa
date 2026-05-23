import Link from "next/link";
import { notFound } from "next/navigation";
import { STAGES, STAGE_ORDER, topicsForStage } from "@/lib/curriculum";
import type { Stage } from "@/lib/types";
import { StageBody } from "@/components/StageBody";
import { StageTopicsGrid } from "@/components/StageTopicsGrid";
import { ProfileBadge } from "@/components/ProfileBadge";

export function generateStaticParams() {
  return STAGE_ORDER.map((stage) => ({ stage }));
}

export default async function StagePage({ params }: PageProps<"/[stage]">) {
  const { stage } = await params;
  if (!STAGE_ORDER.includes(stage as Stage)) notFound();
  const s = STAGES[stage as Stage];
  const topics = topicsForStage(stage as Stage);
  const isDark = stage === "hogstadiet";

  return (
    <main className="flex-1 min-h-screen">
      <StageBody stage={stage as Stage} />

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
            {s.title}
          </h1>
          <span className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Årskurs {s.grades}
          </span>
        </div>
        <p className={`mt-3 max-w-2xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {s.description}
        </p>
      </section>

      <StageTopicsGrid stage={stage as Stage} topics={topics} />

      <footer className={`mt-20 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        Tips: Klicka på ett område för att börja träna.
      </footer>
    </main>
  );
}
