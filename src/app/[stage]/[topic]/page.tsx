import { notFound } from "next/navigation";
import Link from "next/link";
import { STAGES, STAGE_ORDER, getTopic, topicsForStage } from "@/lib/curriculum";
import { LEVELS, type Stage } from "@/lib/types";
import { StageBody } from "@/components/StageBody";

export function generateStaticParams() {
  return STAGE_ORDER.flatMap((stage) =>
    topicsForStage(stage).map((t) => ({ stage, topic: t.id })),
  );
}

const LEVEL_GRADIENTS: Record<number, string> = {
  1: "from-emerald-200 to-teal-300 text-emerald-950",
  2: "from-sky-200 to-indigo-300 text-indigo-950",
  3: "from-amber-200 to-orange-300 text-amber-950",
  4: "from-fuchsia-300 to-rose-400 text-fuchsia-950",
};

const LEVEL_GRADIENTS_DARK: Record<number, string> = {
  1: "from-emerald-700/60 to-teal-800/60 text-emerald-100",
  2: "from-sky-700/60 to-indigo-800/60 text-sky-100",
  3: "from-amber-700/60 to-orange-800/60 text-amber-100",
  4: "from-fuchsia-700/60 to-rose-800/60 text-fuchsia-100",
};

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
          <span className="text-5xl">{t.emoji}</span>
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
        <p className={`mt-4 max-w-2xl ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {t.blurb}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-8 pb-16">
        <h2 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Välj svårighetsnivå
        </h2>
        <div className="grid gap-4 grid-cols-2">
          {LEVELS.map((lv) => {
            const grad = isDark ? LEVEL_GRADIENTS_DARK[lv.id] : LEVEL_GRADIENTS[lv.id];
            return (
              <Link
                key={lv.id}
                href={`/${stage}/${t.id}/${lv.id}`}
                className={`group relative overflow-hidden rounded-2xl p-6 min-h-[150px] flex flex-col justify-between shadow-md transition-transform hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${grad}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{lv.emoji}</span>
                  <span className="text-xs font-bold opacity-70 uppercase tracking-widest">
                    Nivå {lv.id}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                    {lv.title}
                  </h3>
                  <p className="text-sm opacity-90 mt-1">{lv.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
