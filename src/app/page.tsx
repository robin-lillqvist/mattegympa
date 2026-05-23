import Link from "next/link";
import { STAGES } from "@/lib/curriculum";
import { GRADES_BY_STAGE, stageForGrade, type Grade, type Stage } from "@/lib/types";
import { ProfileBadge } from "@/components/ProfileBadge";

const STAGE_CARD_GRADIENT: Record<Stage, string> = {
  lagstadiet: "from-amber-200 via-orange-200 to-rose-200 text-amber-950",
  mellanstadiet: "from-sky-200 via-indigo-200 to-cyan-200 text-indigo-950",
  hogstadiet: "from-violet-700 via-fuchsia-700 to-rose-700 text-white",
};

const STAGE_LABEL: Record<Stage, string> = {
  lagstadiet: "Lågstadiet",
  mellanstadiet: "Mellanstadiet",
  hogstadiet: "Högstadiet",
};

export default function Home() {
  return (
    <main className="flex-1">
      <header className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-violet-600 text-white shadow-lg">
            π
          </span>
          <span>Mattegympa</span>
        </Link>
        <ProfileBadge />
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 text-center">
        <p className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-600 bg-rose-100 rounded-full px-3 py-1">
          Träna matte • Hela grundskolan
        </p>
        <h1
          className="mt-5 text-5xl md:text-6xl font-black tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mattegympa
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-700">
          Välj din årskurs och träna det du behöver kunna för att klara den.
          Allt är anpassat efter Skolverkets kursplan (Lgr22).
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {(["lagstadiet", "mellanstadiet", "hogstadiet"] as Stage[]).map((stage) => (
          <div key={stage}>
            <div className="flex items-baseline justify-between mb-3 px-1">
              <h2
                className="text-xl md:text-2xl font-bold text-slate-700"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {STAGE_LABEL[stage]}
              </h2>
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                {STAGES[stage].subtitle}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-5">
              {GRADES_BY_STAGE[stage].map((g) => (
                <GradeCard key={g} grade={g} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid gap-6 md:grid-cols-3">
        <FeatureCard
          emoji="🎯"
          title="Anpassat efter Lgr22"
          text="Övningarna följer Skolverkets centrala innehåll för matematik per årskurs."
        />
        <FeatureCard
          emoji="🏆"
          title="Mästar-troféer"
          text="Klara ämnen i Mästar-läge och samla troféer för varje årskurs."
        />
        <FeatureCard
          emoji="🇸🇪"
          title="Helt på svenska"
          text="Allt material, alla frågor och alla förklaringar är på svenska."
        />
      </section>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-slate-600">
        Mattegympa • Träna matte på svenska
      </footer>
    </main>
  );
}

function GradeCard({ grade }: { grade: Grade }) {
  const stage = stageForGrade(grade);
  const gradient = STAGE_CARD_GRADIENT[stage];
  return (
    <Link
      href={`/${grade}`}
      className={`group relative overflow-hidden rounded-3xl p-5 md:p-7 min-h-[170px] flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-2xl shadow-md bg-gradient-to-br ${gradient}`}
    >
      <div className="text-xs font-semibold tracking-widest uppercase opacity-80">
        Årskurs
      </div>
      <div className="relative z-10">
        <div
          className="text-6xl md:text-7xl font-black leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {grade}
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-end">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/15 backdrop-blur group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </Link>
  );
}

function FeatureCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 font-bold text-lg">{title}</h3>
      <p className="mt-1 text-slate-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}