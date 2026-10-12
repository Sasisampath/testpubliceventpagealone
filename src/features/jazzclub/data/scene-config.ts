/**
 * Layout + timing for the cinematic Jazzclub hero.
 *
 * Every image referenced here is an ARCHIVE photograph from a previous
 * JazzHQ/Jazzclub gathering. They carry no city meaning and must never be
 * labelled as Bengaluru, Chennai, Mumbai or Hyderabad. Event artwork lives in
 * `events.ts` and is used only by the event explorer.
 *
 * V3: every photo is a STANDARD card — identical width, height, aspect,
 * corner radius, radius from the axis and height on the ring. Source images
 * are cropped to fill the card (object-fit: cover), never stretched.
 */

export type PhotoPlaneConfig = {
  id: string;
  /** Base slug — the `-sm` variant is used on small screens. */
  slug: string;
  /** FINAL angle on the ring, radians. PI = dead ahead of the camera. */
  angle: number;
  /** FINAL height on the ring — the wall is two staggered rows. */
  y: number;
  /**
   * INTRO transform, authored per card (deterministic, never random).
   * The card starts floating ahead of the viewer — farther down the view
   * axis, pulled toward the centre, facing the camera with a slight tilt —
   * and travels toward the viewer while turning into its final ring slot.
   */
  intro: {
    /** Extra lateral offset at the start, world units. */
    x: number;
    /** Vertical offset at the start, world units. */
    y: number;
    /** How far ahead (down -Z) of its final slot the card starts. */
    depth: number;
    /** Extra tilt on top of "facing the camera", radians. */
    rotY: number;
    rotZ: number;
    /** Starting scale (final scale is 1). */
    scale: number;
    /** Start delay, seconds — a subtle, coordinated stagger. */
    delay: number;
  };
  /** Phase offset so the tiny idle drift never looks synchronised. */
  driftSeed: number;
};

export type SceneConfig = {
  planes: PhotoPlaneConfig[];
  /** Standard card size in world units. Identical for every photo. */
  card: { width: number; height: number; cornerRadius: number };
  /** Radius of the ring. Identical for every photo. */
  ringRadius: number;
  camera: {
    fov: number;
    /** z where the intro begins — slightly farther back. */
    startZ: number;
    /** Final resting z. The camera never moves again after this. */
    endZ: number;
  };
  timing: {
    /** Each card's approach duration (after its own delay). */
    cardDuration: number;
    /** Camera approach duration. */
    cameraDuration: number;
    /** Plaque begins settling. */
    plaqueStart: number;
    /** Everything is final; idle motion and interaction begin. */
    settleEnd: number;
    /** Skip: quick settle from wherever the intro is to the final state. */
    skipDuration: number;
  };
  /** Radians per second for the whole ring once settled. Deliberately tiny. */
  idleSpin: number;
};

/** width / height of every cinematic card. */
export const CARD_ASPECT = 4 / 5;

/**
 * Authored intro offsets, cycled around the ring. Each card starts a little
 * deeper / offset / turned and settles into its final slot — varied, never
 * random, and always toward a predefined final transform.
 */
const INTRO_PATTERN: Omit<PhotoPlaneConfig["intro"], "delay">[] = [
  { x: -0.6, y: 1.5, depth: 9, rotY: 0.12, rotZ: -0.04, scale: 0.92 },
  { x: 0.5, y: -1.7, depth: 7, rotY: -0.1, rotZ: 0.05, scale: 0.9 },
  { x: -0.3, y: 2.0, depth: 10.5, rotY: 0.14, rotZ: 0.03, scale: 0.94 },
  { x: 0.7, y: -0.9, depth: 8, rotY: -0.12, rotZ: -0.05, scale: 0.9 },
  { x: -0.8, y: -1.9, depth: 9.5, rotY: 0.1, rotZ: 0.04, scale: 0.92 },
  { x: 0.4, y: 1.1, depth: 8.5, rotY: -0.14, rotZ: -0.03, scale: 0.91 },
];

/** Stagger between neighbouring cards, seconds (centre card first). */
const STAGGER = 0.05;

/**
 * Builds the archive wall: two staggered rows around the viewer, so more
 * photographs are in view at once without shrinking any of them. Every
 * photograph is used once — nothing repeats.
 */
function ring(
  slugs: string[],
  prefix: string,
  travel: number,
  rowOffset: number,
) {
  const topCount = Math.ceil(slugs.length / 2);
  const rows = [slugs.slice(0, topCount), slugs.slice(topCount)];

  return rows.flatMap((rowSlugs, row) =>
    rowSlugs.map<PhotoPlaneConfig>((slug, i) => {
      const step = (Math.PI * 2) / rowSlugs.length;
      // The lower row sits half a slot round, so the rows interlock.
      const angle = Math.PI + i * step + (row === 1 ? step / 2 : 0);
      const index = row * topCount + i;
      const pattern = INTRO_PATTERN[index % INTRO_PATTERN.length];
      // Cards nearest the viewer's centre move first, then outward both ways,
      // so the wall assembles as one movement rather than a queue.
      const rank = Math.min(i, rowSlugs.length - i);
      return {
        id: `${prefix}${index + 1}`,
        slug,
        angle,
        y: row === 0 ? rowOffset : -rowOffset,
        intro: {
          ...pattern,
          x: pattern.x * travel,
          y: pattern.y * travel,
          depth: pattern.depth * travel,
          delay: rank * STAGGER + row * 0.04,
        },
        driftSeed: index * 1.37,
      };
    }),
  );
}

/**
 * Approved JazzClub event photographs ("JazzClub events page hero section
 * photos"), converted to jc-01…jc-22. DSC02556 and the frame showing old
 * "Unwind" branding are deliberately not in this set.
 */
const DESKTOP_SLUGS = Array.from(
  { length: 22 },
  (_, i) => `jc-${String(i + 1).padStart(2, "0")}`,
);

const MOBILE_SLUGS = [
  "jc-01", "jc-02", "jc-04", "jc-06", "jc-07", "jc-09",
  "jc-11", "jc-13", "jc-16", "jc-17", "jc-21", "jc-22",
];

const DESKTOP_CARD_HEIGHT = 3.3;
const MOBILE_CARD_HEIGHT = 2.9;

export const DESKTOP_SCENE: SceneConfig = {
  planes: ring(DESKTOP_SLUGS, "d", 1, 1.95),
  card: {
    width: DESKTOP_CARD_HEIGHT * CARD_ASPECT,
    height: DESKTOP_CARD_HEIGHT,
    cornerRadius: 0.12,
  },
  ringRadius: 6.5,
  camera: { fov: 54, startZ: 4.6, endZ: 2.5 },
  timing: {
    cardDuration: 2.1,
    cameraDuration: 2.3,
    plaqueStart: 1.2,
    settleEnd: 2.45,
    skipDuration: 0.22,
  },
  idleSpin: 0.07,
};

export const MOBILE_SCENE: SceneConfig = {
  planes: ring(MOBILE_SLUGS, "m", 0.7, 1.75),
  card: {
    width: MOBILE_CARD_HEIGHT * CARD_ASPECT,
    height: MOBILE_CARD_HEIGHT,
    cornerRadius: 0.1,
  },
  ringRadius: 5.0,
  camera: { fov: 62, startZ: 3.8, endZ: 2.6 },
  timing: {
    cardDuration: 1.95,
    cameraDuration: 2.1,
    plaqueStart: 1.1,
    settleEnd: 2.25,
    skipDuration: 0.2,
  },
  idleSpin: 0.055,
};

/** Path to the optimized archive photo for a given breakpoint. */
export function photoSrc(slug: string, isMobile: boolean) {
  return `/assets/jazzclub/cinematic/${slug}${isMobile ? "-sm" : ""}.webp`;
}
