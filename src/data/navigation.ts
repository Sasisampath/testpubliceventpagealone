// Link map for the shared footer.
// `href: null` means the destination is not wired yet: the item is shown
// but does not navigate.
export const ROUTES = {
  home: "/events",
} as const;

export type NavDestination = string | null;

export const FOOTER_COMPANY: { label: string; href: NavDestination }[] = [
  { label: "About us", href: null },
];

export const FOOTER_HELP: { label: string; href: NavDestination }[] = [
  { label: "Contact us", href: null },
  { label: "Privacy policy", href: null },
  { label: "Terms and conditions", href: null },
];

export const FOOTER_LEGAL: { label: string; href: NavDestination }[] = [
  { label: "Privacy Policy", href: null },
  { label: "Terms of Service", href: null },
];

// "Summarize with AI" targets; not wired yet.
export const AI_SUMMARY_LINKS: { label: string; logo: string; href: NavDestination }[] = [
  { label: "ChatGPT", logo: "/ai-logos/chatgpt.svg", href: null },
  { label: "Claude", logo: "/ai-logos/claude.svg", href: null },
  { label: "Gemini", logo: "/ai-logos/gemini.svg", href: null },
  { label: "Grok", logo: "/ai-logos/grok.svg", href: null },
];
