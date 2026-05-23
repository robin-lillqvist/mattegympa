import Link from "next/link";
import { STAGES, STAGE_ORDER } from "@/lib/curriculum";
import { ProfileBadge } from "@/components/ProfileBadge";

const STAGE_GRADIENT: Record<string, string> = {
  lagstadiet: "from-amber-300 via-orange-300 to-pink-300",
  mellanstadiet: "from-sky-300 via-indigo-300 to-cyan-300",
  hogstadiet: "from-violet-600 via-fuchsia-600 to-rose-600",
};

const STAGE_TEXT: Record<string, string> = {
  lagstadiet: "text-amber-950",
  mellanstadiet: "text-indigo-950",
  hogstadiet: "text-white",
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
          En modern och rolig mattetränings-app — anpassad efter Lgr22 och skolans tre stadier.
          Välj ditt stadium och kom igång på 10 sekunder.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid gap-6 md:grid-cols-3">
        {STAGE_ORDER.map((id) => {
          const s = STAGES[id];
          return (
            <Link
              key={id}
              href={`/${id}`}
              className={`group relative overflow-hidden rounded-3xl p-8 min-h-[260px] flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-2xl shadow-xl bg-gradient-to-br ${STAGE_GRADIENT[id]} ${STAGE_TEXT[id]}`}
            >
              <div className="relative z-10">
                <div className="text-sm font-semibold opacity-80">{s.subtitle}</div>
                <h2
                  className="mt-1 text-3xl font-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed opacity-90 max-w-[26ch]">
                  {s.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                  Årskurs {s.grades}
                </span>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/15 backdrop-blur group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>

              <DecorativeShapes stage={id} />
            </Link>
          );
        })}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid gap-6 md:grid-cols-3">
        <FeatureCard
          emoji="🎯"
          title="Anpassat efter Lgr22"
          text="Övningarna följer Skolverkets centrala innehåll för matematik i åk 1–9."
        />
        <FeatureCard
          emoji="🏆"
          title="Spara framsteg"
          text="Du samlar XP, stjärnor och streaks lokalt i webbläsaren. Ingen inloggning krävs."
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

function FeatureCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 font-bold text-lg">{title}</h3>
      <p className="mt-1 text-slate-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function DecorativeShapes({ stage }: { stage: string }) {
  if (stage === "lagstadiet") {
    return (
      <>
        <span className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
        <span className="absolute top-6 right-8 text-4xl">🌟</span>
        <span className="absolute bottom-8 left-6 text-3xl">🎈</span>
      </>
    );
  }
  if (stage === "mellanstadiet") {
    return (
      <>
        <span className="absolute -bottom-8 -right-8 w-40 h-40 rounded-2xl rotate-12 bg-white/30 blur-2xl" />
        <span className="absolute top-5 right-6 text-3xl">📐</span>
        <span className="absolute bottom-5 left-6 text-3xl">🧮</span>
      </>
    );
  }
  return (
    <>
      <span className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-fuchsia-400/30 blur-3xl" />
      <span className="absolute top-5 right-6 text-3xl opacity-90">∑</span>
      <span className="absolute bottom-6 left-6 text-3xl opacity-90">√x</span>
    </>
  );
}
