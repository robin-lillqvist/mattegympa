@AGENTS.md

# Mattegympa — projektkontext

Detta är projektets levande spec — läs det innan du gör ändringar. Det innehåller designbeslut, konventioner och fallgropar som vi explicit kommit fram till.

---

## Vad är Mattegympa

En modern, **helt svensk** mattetränings-plattform för svenska grundskolan (åk 1–9). Procedurellt genererade övningar, anpassade efter **Lgr22** (Skolverkets centrala innehåll). Statiskt utbyggd, körs i webbläsaren utan backend.

Målgrupp: barn 6–16 år. Skapad ursprungligen för upphovspersonens dotter, men byggd för att fungera bra för **alla** — inklusive barn med t.ex. autism (därav stark prioritet på visuell ro, förutsägbarhet och tydlig progression).

---

## Stack

- **Next.js 16** (App Router, Turbopack). Se `AGENTS.md` ovan — detta är inte Next.js från träningsdatan. Vid tveksamhet, läs `node_modules/next/dist/docs/`. Viktigt: `params` är en `Promise`, och `PageProps<"/path">` är en globalt deklarerad helper-typ (ingen import).
- **React 19**
- **TypeScript** (strikt)
- **Tailwind CSS v4** (`@import "tailwindcss"`, theme via `@theme inline`)
- **next/font**: Inter (sans) + Fraunces (display, serif)
- **Inget backend** — all data och progress i `localStorage`

---

## Filstruktur

```
src/
  app/
    layout.tsx                       # Root layout, font setup
    page.tsx                         # Landningssida med 3 stadiekort
    globals.css                      # Tailwind + stadie-teman via body[data-stage]
    [stage]/
      page.tsx                       # Stadie-hubb (12 ämnen i grid)
      [topic]/
        page.tsx                     # Nivåväljare (4 nivåer i 2×2-grid)
        [level]/
          page.tsx                   # Övningssession
  components/
    ExerciseSession.tsx              # Övnings-spelet (klient)
    StageTopicsGrid.tsx              # Ämnesgrid (klient — läser progress)
    ProfileBadge.tsx                 # XP/streak/namn (klient)
    ClockFace.tsx                    # Analog klock-SVG
    Confetti.tsx                     # Konfetti vid 100%
    StageBody.tsx                    # Sätter data-stage på <body> för temat
  lib/
    types.ts                         # Stage, Level, TopicId, Exercise, Generator
    curriculum.ts                    # STAGES + TOPICS-data
    generators.ts                    # En generator per ämne (level-medveten)
    progress.ts                      # localStorage XP/streaks/stjärnor
    rand.ts                          # randInt, pick, shuffle, makeChoices, uid
```

Allt på sidnivå prerenderas statiskt via `generateStaticParams`. Klientkomponenter (`"use client"`) sköter interaktion.

Build ska generera **187 statiska sidor** (3 stadier + 36 ämnen + 144 nivå-sidor + landing + not-found).

---

## Strukturella beslut

### Tre stadier × 12 ämnen × 4 nivåer

| Stadie | Folder-id | Årskurs | Tema |
|---|---|---|---|
| Lågstadiet | `lagstadiet` | 1–3 | Varma pasteller, serif-display, lekfulla emojis |
| Mellanstadiet | `mellanstadiet` | 4–6 | Sval blå/indigo, tydligt och balanserat |
| Högstadiet | `hogstadiet` | 7–9 | Mörkt tema, fuchsia/violett accenter |

Varje stadium har **exakt 12 ämnen** → 3×4 / 4×3 / 2×6-grid alltid symmetrisk. Detta är en hård designinvariant (se "Symmetri" nedan). Lägger du till ett ämne, ta bort ett annat eller bumpa alla stadier till nytt antal som ger ren rektangel (9, 12, 16 …).

Varje ämne har **exakt 4 nivåer** (1=Lätt, 2=Medel, 3=Svår, 4=Mästare) → 2×2-grid på nivåväljaren.

### Stadium-teman via `body[data-stage="..."]`

Globala CSS-regler i `globals.css` byter `--background`, `--foreground`, `--surface` osv. på `body` när `data-stage` är satt. Klientkomponenten `<StageBody stage="…" />` sätter attributet vid mount och tar bort vid unmount.

**Konsekvens** (återkommande buggspår): vita element som ärver `color` blir vita på högstadiet (ljus `--foreground`). **Sätt alltid explicit textfärg på vita pillar/knappar/feedback-rutor.** Se `ProfileBadge.tsx` och feedback-rutorna i `ExerciseSession.tsx` för rätt mönster.

### Routes

- `/` — landning
- `/[stage]` — stadie-hubb
- `/[stage]/[topic]` — nivåväljare
- `/[stage]/[topic]/[level]` — övningssession

`level` är `"1"|"2"|"3"|"4"`. Konvertera och validera i sidan; gå till `notFound()` annars.

---

## Generator-kontrakt

```ts
type Generator = (rng: () => number, level: Level) => Exercise;
```

- `rng` är vanligtvis `Math.random` (skickas in för att kunna seeda i framtiden).
- Returnera ett komplett `Exercise` med `id` (`uid()`), `kind`, `prompt`, `answer`.
- `kind: "input"` → fritt textsvar. `kind: "multiple-choice"` → också `choices: string[]`.
- Frivilligt: `hint`, `explanation`, `accept: string[]` (extra accepterade svarsvarianter), `visual: { kind: "clock"; hours; minutes }`.

### Svar-matchning

`normalizeAnswer` (i `generators.ts`) gör: lowercase, ta bort whitespace, byt `,`→`.`, `:`→`.`. Användarsvaret jämförs mot `answer` *och* alla `accept`. Använd `accept` för t.ex. `(3, 4)` ↔ `(3,4)`, `3*10^2` ↔ `3·10^2`.

### Nivå-progression (HÅRD REGEL)

Nivåer ska vara **strikt icke-överlappande** och introducera nya koncept där det är möjligt. Att bara öka talintervallet räcker inte — det orsakade en tidig bugg där L2 kändes identisk med L1 (eftersom L2-intervallet *innehöll* L1-intervallet).

Mönster: varje nivås parameterintervall ska börja där föregående nivås slutar, *eller* en ny operation/struktur ska introduceras.

Exempel ur `addition-sub-100`:
- L1: ensiffrigt + ensiffrigt, sum ≤ 10 (inga tiotalsövergångar)
- L2: ensiffrigt + ensiffrigt **med** tiotalsövergång (sum 11–18)
- L3: tvåsiffrigt + tvåsiffrigt, ej över 100
- L4: tvåsiffrigt + tvåsiffrigt, kan korsa 100

Exempel ur `multiplikationstabellen`:
- L1: 2-, 5-, 10-tabellen
- L2: 3-, 4-, 6-tabellen
- L3: 7-, 8-, 9-tabellen
- L4: 11–15-tabellen (utöver standardtabellen)

Exempel ur `klockan`:
- L1: bara hela timmar
- L2: bara halvor och kvartar (**inga** hela timmar)
- L3: udda 5-min (**inga** halvor/kvartar/hela)
- L4: udda 5-min + 24h-räkneuppgifter

### Tidsformat (HÅRD REGEL)

- **Analoga klock-frågor**: svenska ord som svar — "Kvart över 3", "Halv 4", "Tjugofem i 4".
- **Digital tid**: bara där det är nödvändigt, alltid i **24h-format `HH:MM`** med nollpadding (`09:30`, `17:45`). **Aldrig** AM/PM, aldrig `T.MM`-formen som `3.15`.

`MINUTE_WORDS`-tabellen och `describeTime()`-helpern i `generators.ts` används för analoga klock-svar.

---

## Curriculum-mappning (Lgr22)

Källa: Skolverkets kursplan för matematik (GRGRMAT01), centrala innehåll per åk-intervall.

### Lågstadiet (åk 1–3) — 12 ämnen

| Topic id | Lgr22-koppling |
|---|---|
| `talraknemastare` | Naturliga tal, positionssystem |
| `talkompisar` | Räknemetoder/uppdelning, talkamrater |
| `addition-sub-100` | Fyra räknesätt — addition |
| `subtraktion-sub-100` | Fyra räknesätt — subtraktion |
| `talmonster` | Mönster i talföljder |
| `klockan` | Mätning av tid |
| `former` | Grundläggande 2D-objekt |
| `tredim-former` | Klot, kon, cylinder, rätblock |
| `matning` | Mätning av längd, massa, volym |
| `halvor-och-delar` | Bråk som del av helhet |
| `symmetri` | Symmetri-konstruktion |
| `diagram` | Enkla tabeller och diagram |

### Mellanstadiet (åk 4–6) — 12 ämnen

| Topic id | Lgr22-koppling |
|---|---|
| `multiplikationstabellen` | Räkneoperationer |
| `division` | Räkneoperationer |
| `stora-tal` | Positionssystem för stora tal |
| `decimaltal` | Decimaltal |
| `brak` | Bråk |
| `procent` | Procent och samband med bråk/decimal |
| `negativa-tal` | Rationella tal inkl. negativa |
| `koordinatsystem` | Koordinatsystem |
| `vinklar` | Vinkelmått |
| `geometri-area` | Omkrets, area |
| `tid-och-enheter` | Enhetsbyten |
| `statistik` | Lägesmått (medelvärde, median, typvärde) |

### Högstadiet (åk 7–9) — 12 ämnen

| Topic id | Lgr22-koppling |
|---|---|
| `algebra-uttryck` | Algebraiska uttryck |
| `ekvationer` | Linjära ekvationer |
| `potenser` | Potenser och rötter |
| `pythagoras` | Geometriska satser |
| `funktioner` | Linjära funktioner |
| `procent-ranta` | Procent, förändringsfaktor, ränta |
| `sannolikhet` | Sannolikhet |
| `geometri-volym` | Volym & area |
| `cirkeln` | Cirkelns geometri |
| `skala-och-proportion` | Skala, proportionalitet |
| `likformighet` | Likformighet och kongruens |
| `vetenskaplig-notation` | Grundpotensform / tiopotenser |

---

## Designbeslut

### Symmetri och visuell ro (HÅRD REGEL)

Användaren har explicit tagit upp att **asymmetri** (t.ex. en grid som slutar med 2 kort på en rad där andra rader har 3) är ångestframkallande för många barn — särskilt de med autism. Symmetri är en hård invariant.

Konkret: lägg aldrig in en topic-, nivå- eller stadie-grid som inte ger en exakt rektangel vid alla viewport-breakpoints i Tailwind. Om du inte kan göra det med befintliga antal — ändra antalen, *inte* layouten.

### Kontrast på högstadiet

På högstadiet är `--foreground` ljus (för mörkt tema). Allt vit (pillar, kort, knappar med `bg-white`) **måste ha explicit `text-slate-900`** eller liknande, annars blir det vit-på-vit. Likadant för feedback-rutor med transparent färgad bakgrund — använd ljus textfärg på högstadiet, mörk på övriga stadier (se `ExerciseSession.tsx`).

### Frågedesign

- Generatorer ska helst kunna producera **både** input- och flerval-frågor i samma ämne (`rng() < 0.5`-mönster) för variation.
- Flerval ska ha **4 alternativ** när möjligt (`makeChoices`).
- Distraktorer ska vara *plausibla felsvar* (av-1, av-10, visarbyte för klockan etc.) — inte slumpvärden.
- Dedup i `generateSession` är på `prompt + answer` *eller* `prompt + visual`. Om en generator har samma prompt för varje fråga (som klockan), måste den ha en `visual` eller olika `answer` per fråga — annars går dedup-loopen tom.

### Klockfrågor

- Använder den analoga `<ClockFace />`-SVG-komponenten.
- Svaren är **alltid i ord** ("Kvart över 3"), aldrig digitala. Detta efter explicit feedback från användaren.
- Distraktor-strategi: handle-swap (visarbyte), ±1 timme, ±5 minuter, +30 min — typiska barn-misstag.

---

## Progress / gamification

`progress.ts` sköter:
- XP (10 per rätt + bonus för 3-stjärnigt resultat)
- Stjärnor per ämne (1/2/3 baserat på 50/70/90% rätt; sparas högsta uppnådda)
- Streak-räkning per dag (lokalt datum)
- Achievements

All progress ligger i `localStorage` under nyckeln `mattegympa.progress.v1`. Bumpa nyckeln om datastrukturen ändras inkompatibelt.

OBS: progress aggregeras per **topic**, inte per `(topic, level)`. Detta är medvetet — alla stjärnor på "Addition" visas oavsett vilken nivå du spelade.

---

## Hur du lägger till ett nytt ämne

1. Lägg till id i `TopicId`-unionen (`src/lib/types.ts`).
2. Lägg till topic-objekt i `TOPICS` i rätt stadie-sektion (`src/lib/curriculum.ts`).
3. **Ta bort** ett befintligt ämne i samma stadie så att 12-talet bevaras (eller flytta alla stadier till en ny symmetrisk siffra).
4. Skriv en generator i `src/lib/generators.ts` (4 strikta nivåer!) och registrera i `GENERATORS`-objektet.
5. `npm run build` — `generateStaticParams` ger 4 nya nivå-sidor automatiskt.
6. `npm run lint`.

---

## Konventioner

- All UI-text är **svenska**. Inga engelska strängar i UI:t.
- Math-symboler: `·` (gånger), `−` (minustecken — *inte* hyphen `-`), `√`, `²`, `³`, `π`.
- Topic-ids är kebab-case (`addition-sub-100`, `geometri-area`).
- Generatorerna är `const`-deklarerade pilfunktioner med typannotation `Generator`, inte `function`-deklarationer.
- Inga emojis i kod om användaren inte uttryckligen bett om det.

---

## Verifieringskommandon

```bash
npm run dev      # utveckling
npm run build    # ska generera 187 statiska sidor
npm run lint     # ska vara helt rent
npm run start    # serverar build-output
```

Smoke-test: kör `npm run start` och `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/$STAGE/$TOPIC/$LEVEL` ska ge `200`.

---

## Kända begränsningar / icke-mål

- Ingen lärar- eller föräldradashboard
- Ingen multispelare/realtid
- Progress synkas inte mellan enheter (localStorage-bundet)
- Vissa generatorer (cirkel, vetenskaplig notation) accepterar specifika svarsformat — bredda `accept`-arrayen om barn ofta får fel pga formatering snarare än matematik

---

## Användarpreferenser (från tidigare sessioner)

- **Symmetri**: hård invariant. Användaren blir explicit "super spun up" av asymmetri.
- **Tidsformat**: 24h `HH:MM` eller svenska ord — aldrig `T.MM`, aldrig AM/PM.
- **Difficulty levels**: ska vara *märkbart* olika. Strikt icke-överlappande intervall + konceptuell progression. "L2 ska aldrig kunna producera en L1-fråga".
- **Svenska**: allt UI och allt material.
- **Lgr22-troget**: ämnesutbud ska direkt mappa mot Skolverkets centrala innehåll. Vid förändringar — kolla mot kursplanen för GRGRMAT01.
- **Autonomi**: användaren litar på dig att fatta rimliga beslut själv när det är uppenbart vad som är bäst, istället för att fråga om varje detalj.
