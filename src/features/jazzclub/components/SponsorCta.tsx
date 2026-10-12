"use client";

import { EVENTS_ID, SPONSOR_ID, scrollToSection } from "../data/anchors";

type Props = {
  target?: typeof EVENTS_ID | typeof SPONSOR_ID;
  /** Figma: coral pill by default, black (#242424) pill in co-host headers. */
  tone?: "coral" | "dark";
  children: React.ReactNode;
};

/**
 * Figma coral pill CTA. Stays on /events and scrolls to its section, so
 * every "Become a co-host" on the page behaves identically.
 */
export function SponsorCta({ target = SPONSOR_ID, tone = "coral", children }: Props) {
  return (
    <a
      href={`#${target}`}
      onClick={(event) => scrollToSection(event, target)}
      className={`jc-cta ${tone === "dark" ? "jc-cta--dark" : ""}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}
