# Mattegympa — bygglogg

## Plan

- [x] Bootstrap Next.js 16 + TS + Tailwind + App Router
- [x] Definiera Lgr22-läroplan för åk 1–9 (TOPICS-data)
- [x] Bygga frågegeneratorer per ämne
- [x] Stadie-specifik UI (lågstadiet/mellanstadiet/högstadiet)
- [x] Progress-tracking (localStorage), XP, streaks, stjärnor, achievements
- [x] Production build + lint
- [x] README

## Review

**Vad byggdes:**

- Landningssida med tre stadiekort
- 3 stadiehubbar med ämnesgrid och stjärnor som indikerar progress
- 27 ämnen, vardera med procedurellt genererade övningar (10 frågor per session)
- Två frågetyper: skriv-svar och flerval
- Profil i headern: namn, XP, streak
- Konfetti vid 100% rätt-omgång
- Mörkt tema för högstadiet, ljust + pastell för lågstadiet, balanserat för mellanstadiet
- Allt på svenska

**Verifiering:**

- `npm run build` → 34 statiska sidor (3 stadier × ämnen + landing)
- `npm run lint` → inga fel
- `npm run start` + curl → 200 på `/`, `/lagstadiet`, `/hogstadiet/ekvationer`

**Kända begränsningar:**

- Övningarna är ren räknematematik — inga geometriska figurer renderas än
- Ingen lärar-/föräldradashboard
- Inget multispelarläge
- Progress sparas bara i den aktuella webbläsaren
