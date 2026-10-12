/**
 * Single source of truth for Jazzclub events.
 *
 * Add, edit or remove events here only — no UI component hardcodes event
 * content. City options, filters, sort order and CTA copy are all derived
 * from this list.
 *
 * `thumbnail` is the event's own artwork (Luma). Event thumbnails are used by
 * the event explorer ONLY. Archive photography for the cinematic hero lives
 * in `scene-config.ts` and is never tied to a city or event.
 */

export type EventStatus = "upcoming" | "past";

/**
 * - `open`        → registration is live      → "Register now →"
 * - `application` → attendance by application → "Apply Now →"
 * - `unopened`    → upcoming, not yet open    → "Coming Soon"
 * - `closed`      → past event                → "View Recap →" / "Past Event"
 */
export type RegistrationState = "open" | "application" | "unopened" | "closed";

export type EventCtaType =
  | "tickets"
  | "apply"
  | "coming-soon"
  | "recap"
  | "past";

export type JazzclubEvent = {
  id: string;
  city: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). Display formatting happens in the UI. */
  date: string;
  /** Event artwork. `null` renders the text-only card fallback. */
  thumbnail: string | null;
  /**
   * Optional stored status. When omitted, status is derived from `date`
   * against today's date.
   */
  status?: EventStatus;
  /** Editorial — JazzHQ decides. Never computed from date. */
  featured: boolean;
  /** Manual ordering within the Featured filter. Lower shows first. */
  featuredOrder?: number;
  registrationState: RegistrationState;
  /** Optional override. When omitted, derived from registrationState/url. */
  ctaType?: EventCtaType;
  /** Luma / application / recap URL used by the active card's CTA. */
  url: string | null;
  /** Accent used by the text-only card fallback. */
  accent: string;
  /** Development-only demo record. Never included in production builds. */
  demo?: boolean;
};

/** Real JazzHQ events. */
const REAL_EVENTS: JazzclubEvent[] = [
  {
    id: "bengaluru-unwind",
    city: "Bengaluru",
    title: "JazzClub Bengaluru",
    date: "2026-08-27",
    description:
      "The Bengaluru room, bringing operators and partners together over AI GTM.",
    thumbnail: "/assets/jazzclub/events/bengaluru.webp",
    featured: false,
    registrationState: "closed",
    url: null,
    accent: "#e8574c",
  },
  {
    id: "chennai-unwind",
    city: "Chennai",
    title: "JazzClub Chennai",
    date: "2026-09-17",
    description:
      "An evening of curated AI GTM conversations with the Chennai ecosystem.",
    thumbnail: "/assets/jazzclub/events/chennai.webp",
    featured: false,
    registrationState: "unopened",
    url: null,
    accent: "#e8574c",
  },
  {
    id: "mumbai-ai-ps",
    city: "Mumbai",
    title: "AI in Professional Services",
    date: "2026-10-08",
    description: "An evening for PS leaders to learn and network.",
    thumbnail: "/assets/jazzclub/events/mumbai.webp",
    featured: true,
    featuredOrder: 1,
    registrationState: "open",
    url: "https://luma.com/laa0heaf",
    accent: "#1f9d61",
  },
  {
    id: "hyderabad-unwind",
    city: "Hyderabad",
    title: "JazzClub Hyderabad",
    date: "2026-10-29",
    description:
      "The Hyderabad room for founders, operators and partners building AI-native GTM.",
    thumbnail: null,
    featured: false,
    registrationState: "open",
    url: "https://luma.com/eoyer6cd",
    accent: "#5048e5",
  },
];

/**
 * DEVELOPMENT-ONLY demo records proving the explorer scales to ~10 events,
 * repeated cities and every CTA state. NOT real JazzHQ events — stripped from
 * production builds and labelled "[Demo]".
 */
const DEMO_EVENTS: JazzclubEvent[] = [
  {
    id: "demo-chennai-founders",
    city: "Chennai",
    title: "[Demo] AI Founders Room",
    date: "2026-11-12",
    description: "Demo record — a small room for AI-native founders.",
    thumbnail: null,
    featured: false,
    registrationState: "application",
    url: "https://example.com/demo-apply",
    accent: "#131315",
    demo: true,
  },
  {
    id: "demo-chennai-operators",
    city: "Chennai",
    title: "[Demo] Operators Roundtable",
    date: "2026-06-18",
    description: "Demo record — a closed-door roundtable for operators.",
    thumbnail: null,
    featured: false,
    registrationState: "closed",
    url: "https://example.com/demo-recap",
    accent: "#5048e5",
    demo: true,
  },
  {
    id: "demo-delhi-operators",
    city: "Delhi NCR",
    title: "[Demo] Operators Meetup",
    date: "2026-11-28",
    description: "Demo record — real conversations with real operators.",
    thumbnail: null,
    featured: true,
    featuredOrder: 2,
    registrationState: "unopened",
    url: null,
    accent: "#2f4fd8",
    demo: true,
  },
  {
    id: "demo-pune-gtm",
    city: "Pune",
    title: "[Demo] Product GTM Lab",
    date: "2026-12-10",
    description: "Demo record — hands-on GTM lab for product teams.",
    thumbnail: null,
    featured: false,
    registrationState: "unopened",
    url: null,
    accent: "#d08a1c",
    demo: true,
  },
  {
    id: "demo-mumbai-build",
    city: "Mumbai",
    title: "[Demo] Build with AI",
    date: "2026-08-15",
    description: "Demo record — a practical workshop from idea to launch.",
    thumbnail: null,
    featured: false,
    registrationState: "closed",
    url: null,
    accent: "#7a3fc4",
    demo: true,
  },
  {
    id: "demo-hyderabad-partners",
    city: "Hyderabad",
    title: "[Demo] Partner Evening",
    date: "2026-07-21",
    description: "Demo record — partners and resellers building together.",
    thumbnail: null,
    featured: false,
    registrationState: "closed",
    url: "https://example.com/demo-recap",
    accent: "#c2365a",
    demo: true,
  },
];

export const jazzclubEvents: JazzclubEvent[] =
  process.env.NODE_ENV === "development"
    ? [...REAL_EVENTS, ...DEMO_EVENTS]
    : REAL_EVENTS;

/* ------------------------------------------------------------------------ */
/* Derived helpers — the UI reads event state only through these.            */
/* ------------------------------------------------------------------------ */

export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function eventTime(event: JazzclubEvent) {
  const [y, m, d] = event.date.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function eventStatus(
  event: JazzclubEvent,
  today = startOfToday(),
): EventStatus {
  if (event.status) return event.status;
  return eventTime(event) < today ? "past" : "upcoming";
}

export function eventCta(event: JazzclubEvent): EventCtaType {
  if (event.ctaType) return event.ctaType;
  if (eventStatus(event) === "past") return event.url ? "recap" : "past";
  if (event.registrationState === "application" && event.url) return "apply";
  if (event.registrationState === "open" && event.url) return "tickets";
  return "coming-soon";
}

export const CTA_LABEL: Record<EventCtaType, string> = {
  tickets: "Register now",
  apply: "Apply Now",
  "coming-soon": "Coming Soon",
  recap: "View Recap",
  past: "Past Event",
};

/** CTAs that navigate (and therefore show an arrow). */
export function ctaIsAction(cta: EventCtaType) {
  return cta === "tickets" || cta === "apply" || cta === "recap";
}

export function formatEventDate(event: JazzclubEvent) {
  return new Date(eventTime(event)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Cities that actually have events, alphabetical. */
export function eventCities(events: JazzclubEvent[]) {
  return Array.from(new Set(events.map((event) => event.city))).sort((a, b) =>
    a.localeCompare(b),
  );
}
