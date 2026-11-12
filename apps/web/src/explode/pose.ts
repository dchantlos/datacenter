export interface ExplodePose {
  vertical: number;
  horizontal: number;
}

export function assertAmount(value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError("Explode amounts must be between 0 and 1.");
}

export const HALFWAY_DURATION_MS = 800;

/** The drag-pad widget's halfway spring, including its outward kick on repeated clicks. */
export function halfwayAmount(start: number, elapsedMs: number) {
  assertAmount(start);
  if (!Number.isFinite(elapsedMs)) throw new RangeError("Animation time must be finite.");
  if (elapsedMs <= 0) return start;
  if (elapsedMs >= HALFWAY_DURATION_MS) return 0.5;
  const time = elapsedMs / 1000;
  const displacement = start - 0.5;
  const spring = Math.exp(-8 * time) * (displacement * Math.cos(18 * time) + ((3 + 8 * displacement) / 18) * Math.sin(18 * time));
  return Math.max(0, Math.min(1, 0.5 + spring));
}
