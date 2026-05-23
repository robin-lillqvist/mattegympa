# Mattegympa

En modern mattetränings-plattform för svenska grundskolan, byggd i Next.js 16.

## Innehåll

Plattformen täcker hela grundskolan, indelad i tre stadier (enligt Lgr22):

- **Lågstadiet (åk 1–3)** — talen 0–100, addition/subtraktion, talmönster, klockan, geometriska former, mätning, halvor och delar
- **Mellanstadiet (åk 4–6)** — multiplikationstabellen, division, stora tal, decimaltal, bråk, procent, negativa tal, omkrets/area, enheter, statistik
- **Högstadiet (åk 7–9)** — algebraiska uttryck, ekvationer, potenser/rötter, Pythagoras, funktioner, procent/ränta, sannolikhet, volym, skala

Totalt 27 ämnen med procedurellt genererade övningar — du får alltid nya frågor.

## Designprinciper per stadium

- **Lågstadiet** — varm pastell, lekfulla emojis, serif-display, stora knappar
- **Mellanstadiet** — kyligare blå/lila, balanserat och tydligt
- **Högstadiet** — mörkt tema med fuchsia/violett accentfärger, mer "vuxet"

## Funktioner

- 🎯 Övningar anpassade efter Lgr22:s centrala innehåll
- 🏆 XP, streaks, stjärnor och prestationer
- 💾 Allt sparas lokalt i webbläsaren (`localStorage`)
- 🇸🇪 Helt på svenska
- ⚡ Statiskt prerenderad — laddar direkt

## Komma igång

```bash
npm install
npm run dev      # utvecklingsläge
npm run build    # produktionsbygge
npm run start    # kör produktionsbygget
npm run lint
```

Öppna sedan [http://localhost:3000](http://localhost:3000).

## Teknik

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- next/font (Inter + Fraunces)

## Arkitektur

```
src/
  app/
    page.tsx                  # Landningssida med stadieval
    [stage]/page.tsx          # Stadie-hubb med ämneskort
    [stage]/[topic]/page.tsx  # Övningssession
  components/
    ExerciseSession.tsx       # Övnings-spelet
    StageTopicsGrid.tsx
    ProfileBadge.tsx
    Confetti.tsx
    StageBody.tsx
  lib/
    curriculum.ts             # Stadier och ämnen
    generators.ts             # Frågeskapare per ämne
    progress.ts               # localStorage + XP/streaks
    rand.ts
    types.ts
```

Alla sidor prerenderas statiskt vid `next build` (`generateStaticParams`).
