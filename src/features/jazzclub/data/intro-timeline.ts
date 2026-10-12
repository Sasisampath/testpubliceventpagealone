/**
 * One clock for the hero intro, shared by the camera and every photo card.
 *
 * INTRO → SETTLING → IDLE. A skip never reverses or finishes the intro: each
 * track is frozen at its current progress and eased straight to 1 over
 * `skipDuration`, so the scene always lands on the exact final transform.
 */
export type IntroTimeline = {
  /** performance.now() when the intro started. */
  start: number;
  /** performance.now() when skipped, or null. */
  skipAt: number | null;
  /** Intro disabled entirely (reduced motion / returning visitor). */
  instant: boolean;
  /** Reduced motion: no intro, no idle motion at all. */
  still: boolean;
  /** performance.now() when the hero began exiting to /events/explore. */
  exitAt: number | null;
};

export function createTimeline(): IntroTimeline {
  return { start: 0, skipAt: null, instant: false, still: false, exitAt: null };
}

/** Gentle deceleration: steady travel early, soft settle at the end. */
export function easeOutSine(t: number) {
  return Math.sin((t * Math.PI) / 2);
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function clamp01(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Eased 0..1 progress of one track (delay + duration, in seconds). */
export function trackProgress(
  timeline: IntroTimeline,
  now: number,
  delay: number,
  duration: number,
  skipDuration: number,
) {
  if (timeline.instant) return 1;
  if (timeline.start === 0) return 0; // clock not started yet
  const at = (ms: number) =>
    easeOutSine(clamp01((ms - timeline.start) / 1000 / duration - delay / duration));
  if (timeline.skipAt === null) return at(now);
  const frozen = at(timeline.skipAt);
  const settle = easeOutCubic(clamp01((now - timeline.skipAt) / 1000 / skipDuration));
  return frozen + (1 - frozen) * settle;
}

/** Seconds since the scene became final, or a negative number before that. */
export function secondsSettled(
  timeline: IntroTimeline,
  now: number,
  settleEnd: number,
  skipDuration: number,
) {
  if (timeline.instant) return (now - timeline.start) / 1000;
  if (timeline.start === 0) return -1;
  const natural = (now - timeline.start) / 1000 - settleEnd;
  if (timeline.skipAt === null) return natural;
  const skipped = (now - timeline.skipAt) / 1000 - skipDuration;
  return Math.max(natural, skipped);
}
