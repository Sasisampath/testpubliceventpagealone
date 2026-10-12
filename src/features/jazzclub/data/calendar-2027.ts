/**
 * The 2027 JazzClub calendar — ONE source of truth.
 *
 * Used by the full editorial section on /events and by the dark modal on
 * /events/explore. Add or change a month here only.
 */

export type CalendarMonth = {
  month: string;
  /** Published cities. Empty means "no published location yet". */
  cities: string[];
};

export type CalendarQuarter = {
  id: string;
  label: string;
  /** Figma header fill. */
  accent: string;
  /** Figma city chip fill and dot. */
  chip: string;
  dot: string;
  months: CalendarMonth[];
};

export const CALENDAR_2027: CalendarQuarter[] = [
  {
    id: "q1",
    label: "Q1",
    accent: "#e5484d",
    chip: "#fdeeed",
    dot: "#e8574c",
    months: [
      { month: "January", cities: ["Chennai", "Bengaluru"] },
      { month: "February", cities: ["Bengaluru", "Mumbai"] },
      { month: "March", cities: ["Chennai", "Dubai"] },
    ],
  },
  {
    id: "q2",
    label: "Q2",
    accent: "#14ae5d",
    chip: "#eaf2ef",
    dot: "#2f7d5c",
    months: [
      { month: "April", cities: ["Singapore", "Kuala Lumpur"] },
      { month: "May", cities: ["Bengaluru", "London"] },
      { month: "June", cities: ["Mumbai", "Berlin"] },
    ],
  },
  {
    id: "q3",
    label: "Q3",
    accent: "#564ef0",
    chip: "#ededfc",
    dot: "#4f46e5",
    months: [
      { month: "July", cities: ["Chennai", "Singapore"] },
      { month: "September", cities: ["Berlin", "Amsterdam"] },
    ],
  },
  {
    id: "q4",
    label: "Q4",
    accent: "#242424",
    chip: "#e4e4e4",
    dot: "#131315",
    months: [
      { month: "October", cities: ["Dubai", "London"] },
      { month: "November", cities: ["Amsterdam", "New York"] },
    ],
  },
];

export const CALENDAR_HEADING = "The 2027 JazzClub Calendar";

export const CALENDAR_INTRO =
  "A curated 2027 event calendar connecting sponsors with the right people, in the right markets, around the right conversations.";

export const CALENDAR_NOTE = "Exact dates to be announced soon.";

/** Months with no room planned — deliberate, not missing information. */
export const CALENDAR_EMPTY_LABEL = "—";

/** City strip under the heading — order and artwork from the latest Figma. */
export const CALENDAR_CITIES = [
  { id: "chennai", name: "Chennai", icon: "chennai-icon.png" },
  { id: "bengaluru", name: "Bengaluru", icon: "bengaluru-icon.png" },
  { id: "mumbai", name: "Mumbai", icon: "mumbai-icon.png" },
  { id: "dubai", name: "Dubai", icon: "dubai-icon.svg" },
  { id: "kuala-lumpur", name: "Kuala Lumpur", icon: "kuala-lumpur-icon.svg" },
  { id: "berlin", name: "Berlin", icon: "berlin-icon.svg" },
  { id: "amsterdam", name: "Amsterdam", icon: "amsterdam-icon.svg" },
  { id: "singapore", name: "Singapore", icon: "singapore-icon.svg" },
  { id: "new-delhi", name: "New Delhi", icon: "new-delhi-icon.png" },
];
