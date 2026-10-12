/**
 * JazzClub testimonials shown on /events.
 *
 * Portraits are the supplied cut-outs. Quotes come from JazzHQ — a person
 * with no supplied quote renders without a quote block rather than carrying
 * an invented one.
 */

export type JazzclubTestimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  portrait: string;
  /** Supplied quote, or null until JazzHQ provides one. */
  quote: string | null;
  /** Company mark already in the project, or null. */
  logo: string | null;
  /** Figma accent: name colour and watermark tint. */
  panel: string;
  /** Figma quote block fill. */
  quoteBg: string;
};

export const TESTIMONIALS_HEADING = "Don’t take our word for it.";

/** Figma order: Shashidhar, Ken, Chhavi. Portraits are the Figma cut-outs. */
export const JAZZCLUB_TESTIMONIALS: JazzclubTestimonial[] = [
  {
    id: "shashidhar-bellur",
    name: "Shashidhar Bellur",
    role: "Partner Development",
    company: "HubSpot",
    portrait: "/assets/jazzclub/testimonials/shashidhar-bellur-cutout.webp",
    quote:
      "The evening has been fantastic, lots of lived experiences from people. Loved working with the Jazz HQ team towards curating this event and executing today wonderfully.",
    logo: "/assets/logos/hubspot.svg",
    panel: "#e5484d",
    quoteBg: "#fe4c4c",
  },
  {
    id: "ken-yeung",
    name: "Ken Yeung",
    role: "Co-founder & CEO",
    company: "WATI",
    portrait: "/assets/jazzclub/testimonials/ken-yeung-cutout.webp",
    quote:
      "A huge shoutout to JazzHQ, the \u2018Octopus\u2019 of the day, for connecting people and sparking real opportunities.",
    logo: "/assets/logos/wati.svg",
    panel: "#14ae5d",
    quoteBg: "#14ae5d",
  },
  {
    id: "chhavi-porwal",
    name: "Chhavi Porwal",
    role: "Regional Partnerships",
    company: "monday.com",
    portrait: "/assets/jazzclub/testimonials/chhavi-porwal-cutout.webp",
    quote:
      "I'm really proud of the partnership we've built with JazzHQ and I look forward to working with them in the future.",
    logo: "/assets/testimonials/logo-monday.svg",
    panel: "#5d5ff0",
    quoteBg: "#564ef0",
  },
];

/** Figma "Previous Co-hosts include" row, in Figma order. Full colour. */
export const PARTNER_LOGOS = [
  { name: "monday.com", src: "/assets/logos/monday.svg" },
  { name: "HubSpot", src: "/assets/logos/hubspot-trusted.svg" },
  { name: "WATI", src: "/assets/logos/wati.svg" },
  { name: "Rocketlane", src: "/assets/logos/rocketlane.svg" },
  { name: "SuperOps", src: "/assets/logos/superops.svg" },
  { name: "SeamlessHR", src: "/assets/logos/seamlesshr.svg" },
  { name: "ElevenLabs", src: "/assets/logos/elevenlabs.svg" },
  { name: "SurveySparrow", src: "/assets/logos/surveysparrow.png" },
  { name: "Wrike", src: "/assets/logos/wrike.svg" },
];
