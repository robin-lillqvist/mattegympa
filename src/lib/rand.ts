export const randInt = (rng: () => number, min: number, max: number): number =>
  Math.floor(rng() * (max - min + 1)) + min;

export const pick = <T>(rng: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)];

export const shuffle = <T>(rng: () => number, arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const uid = (): string =>
  Math.random().toString(36).slice(2, 10);

/** Build choices with the correct answer plus distractors, shuffled. */
export const makeChoices = (
  rng: () => number,
  correct: number,
  distractorOffsets: number[],
): string[] => {
  const seen = new Set<number>([correct]);
  const choices = [correct];
  for (const offset of distractorOffsets) {
    const v = correct + offset;
    if (!seen.has(v) && v >= 0) {
      seen.add(v);
      choices.push(v);
    }
  }
  let guard = 0;
  while (choices.length < 4 && guard < 50) {
    guard++;
    const v = correct + randInt(rng, -10, 10);
    if (!seen.has(v) && v >= 0) {
      seen.add(v);
      choices.push(v);
    }
  }
  return shuffle(rng, choices).map(String);
};
