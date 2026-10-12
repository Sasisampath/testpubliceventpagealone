/**
 * /events is a single page. Every CTA scrolls to one of these two sections,
 * and both carry `scroll-mt-*` so the fixed navbar never covers the heading.
 */
export const EVENTS_ID = "events";
export const SPONSOR_ID = "become-a-co-host";

/** The two CTA labels used across the page — no other variants. */
export const ATTEND_LABEL = "Attend Our Event";
export const SPONSOR_LABEL = "Become a Co-host";

export function scrollToSection(
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string,
) {
  const target = document.getElementById(id);
  if (!target) return; // section not on this page — follow the href
  event.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
  // Keep the hash shareable without a second jump.
  history.replaceState(null, "", `#${id}`);
}
