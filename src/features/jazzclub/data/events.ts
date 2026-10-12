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
 *
 * Any event whose date has passed shows "Past Event" (or "View Recap →" when
 * `recapUrl` is set) — the registration link is never shown for past events.
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
  /** Luma registration URL used by the active card's CTA while upcoming. */
  url: string | null;
  /** Optional recap link shown once the event is past. */
  recapUrl?: string | null;
  /** Accent used by the text-only card fallback. */
  accent: string;
  /** Development-only demo record. Never included in production builds. */
  demo?: boolean;
};

/**
 * Real JazzHQ events — edit this list when details change.
 *
 * - `date`      ISO date; Upcoming / Past is derived from it automatically.
 * - `thumbnail` file in /public/assets/jazzclub/events/.
 * - `url`       the event's Luma registration page (embed URL from Luma),
 *               or `null` until it exists → the card shows "Coming Soon".
 * - `featured`  editorial; `featuredOrder` sorts the Featured filter.
 */
const REAL_EVENTS: JazzclubEvent[] = [
  {
    id: "dubai-ai-in-hr-2026-10-29",
    city: "Dubai",
    title: "The AI in HR Roundtable: Dubai Edition",
    date: "2026-10-29",
    description: "Executive Roundtable & Networking Dinner. Invite-only.",
    thumbnail: "/assets/jazzclub/events/dubai-oct-29.jpg",
    featured: false,
    registrationState: "open",
    url: "https://luma.com/embed/event/evt-RXDDiCjTSr1zzpx/simple",
    accent: "#5048e5",
  },
  {
    id: "chennai-ai-in-ps-2026-10-31",
    city: "Chennai",
    title: "AI in Professional Services",
    date: "2026-10-31",
    description:
      "Executive Roundtable & Networking Brunch for Professional Services Leaders. Invite-only.",
    thumbnail: "/assets/jazzclub/events/chennai-oct-31.jpg",
    featured: false,
    registrationState: "open",
    url: "https://luma.com/embed/event/evt-oTFO3WltEYL988P/simple",
    accent: "#1f9d61",
  },
  {
    id: "dubai-ai-in-hr-2026-11-17",
    city: "Dubai",
    title: "The AI in HR Roundtable: Dubai Edition",
    date: "2026-11-17",
    description: "Executive Roundtable & Networking Dinner. Invite-only.",
    thumbnail: "/assets/jazzclub/events/dubai-nov-17.jpg",
    featured: false,
    registrationState: "open",
    url: "https://luma.com/embed/event/evt-mWV4aFf108WRFyu/simple",
    accent: "#131315",
  },
  {
    id: "mumbai-ai-in-ps-2026-11-19",
    city: "Mumbai",
    title: "AI in Professional Services",
    date: "2026-11-19",
    description:
      "Executive Roundtable & Networking Brunch for Professional Services Leaders. Invite-only.",
    thumbnail: "/assets/jazzclub/events/mumbai-nov-19.jpg",
    featured: true,
    featuredOrder: 1,
    registrationState: "open",
    url: "https://luma.com/embed/event/evt-9RIumFEYlb5OP7t/simple",
    accent: "#5048e5",
  },
  {
    id: "qatar-ai-in-hr-2026-12-08",
    city: "Qatar",
    title: "The AI in HR Roundtable: Qatar Edition",
    date: "2026-12-08",
    description: "Executive Roundtable & Networking Dinner. Invite-only.",
    thumbnail: "/assets/jazzclub/events/qatar-dec-8.jpg",
    featured: false,
    registrationState: "open",
    url: "https://luma.com/embed/event/evt-lwWJyKIpFQcI0T0/simple",
    accent: "#1f9d61",
  },
  {
    // No Luma link supplied yet — add it to `url` and set
    // registrationState to "open" when it exists.
    id: "bengaluru-ai-in-ps-2026-12-10",
    city: "Bengaluru",
    title: "AI in Professional Services",
    date: "2026-12-10",
    description:
      "Executive Roundtable & Networking Brunch for Professional Services Leaders. Invite-only.",
    thumbnail: "/assets/jazzclub/events/bengaluru-dec-10.jpg",
    featured: false,
    registrationState: "unopened",
    url: null,
    accent: "#e8574c",
  },
];

/**
 * DEVELOPMENT-ONLY demo records proving the explorer scales to ~10 events,
 * repeated cities and every CTA state. NOT real JazzHQ events — labelled
 * "[Demo]" and only ever shown in development with SHOW_DEMO_EVENTS on.
 */
const SHOW_DEMO_EVENTS = false;

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
  SHOW_DEMO_EVENTS && process.env.NODE_ENV === "development"
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
  if (eventStatus(event) === "past") return event.recapUrl ? "recap" : "past";
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

/** Shorter labels for the full-width CTA on phones. */
export const CTA_LABEL_MOBILE: Record<EventCtaType, string> = {
  tickets: "Register",
  apply: "Apply",
  "coming-soon": "Coming Soon",
  recap: "View event",
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

/** Compact one-line date for phones, e.g. "17 Nov 2026". */
export function formatEventDateShort(event: JazzclubEvent) {
  return new Date(eventTime(event)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Cities that actually have events, alphabetical. */
export function eventCities(events: JazzclubEvent[]) {
  return Array.from(new Set(events.map((event) => event.city))).sort((a, b) =>
    a.localeCompare(b),
  );
}
