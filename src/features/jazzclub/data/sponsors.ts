/** Co-hosting options — copy, colours and image mapping from the latest Figma. */

export const COHOST_HEADING = "Co-hosting options";
export const COHOST_INTRO = "Three simple ways to own the conversation";
export const COHOST_CTA_LABEL = "Become a co-host";

export type CohostOption = {
  id: string;
  name: string;
  tagline: string;
  points: string[];
  /** Figma card surface. */
  surface: string;
  /** Figma bullet tick colour. */
  tick: string;
  image: string;
  imageAlt: string;
};

export const COHOST_OPTIONS: CohostOption[] = [
  {
    id: "white-labelled",
    name: "White labelled",
    tagline: "Your name on the door, none of ours.",
    points: [
      "No JazzHQ branding, the room is entirely yours",
      "One co-host owns the event narrative",
      "Audience built around your ICP",
      "Workshop / demo / discussion framed around your category",
      "Priority introductions and follow-up",
    ],
    surface: "#ffffff",
    tick: "#242424",
    image: "/assets/jazzclub/cohost/white-labelled.webp",
    imageAlt: "A co-host speaking at a JazzClub room",
  },
  {
    id: "exclusive",
    name: "Exclusive",
    tagline: "Our name opens it, yours runs the room.",
    points: [
      "JazzHQ branded, you get our credibility and our audience's trust, still telling your story",
      "One co-host owns the event narrative",
      "Audience built around your ICP",
      "Workshop / demo / discussion framed around your category",
      "Priority introductions and follow-up",
    ],
    surface: "#edecff",
    tick: "#564ef0",
    image: "/assets/jazzclub/cohost/exclusive.webp",
    imageAlt: "Attendees at an exclusive JazzClub evening",
  },
  {
    id: "co-market",
    name: "Co-market",
    tagline: "Split the room, double the reach.",
    points: [
      "Two complementary co-hosts share room and cost",
      "Broader market conversation without competitor conflict",
      "Joint promotion and content distribution",
      "Shared attendee engagement",
    ],
    surface: "#ffe8e9",
    tick: "#e5484d",
    image: "/assets/jazzclub/cohost/co-market.webp",
    imageAlt: "Co-hosts and guests in conversation at a JazzClub event",
  },
];
