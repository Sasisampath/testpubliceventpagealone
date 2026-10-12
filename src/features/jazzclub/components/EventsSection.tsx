"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { EVENTS_ID } from "../data/anchors";
import {
  eventCities,
  eventStatus,
  eventTime,
  jazzclubEvents,
  startOfToday,
  type JazzclubEvent,
} from "../data/events";
import { EventDeck } from "./EventDeck";

/**
 * The event catalogue, directly below the hero. Filters decide which events
 * are in the deck (status AND city); the deck decides which one is active.
 * Everything is derived from `events.ts`, so new Lu.ma events just appear.
 */

export type StatusFilter = "all" | "upcoming" | "featured" | "past";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "featured", label: "Featured" },
  { id: "past", label: "Past" },
];

const ALL_CITIES = "all";

/**
 * - upcoming → nearest date first
 * - past     → most recent first
 * - featured → editorial order, then date
 * - all      → upcoming (nearest first), then past (most recent first)
 */
function filterEvents(
  events: JazzclubEvent[],
  status: StatusFilter,
  city: string,
  today: number,
) {
  const inCity = events.filter(
    (event) => city === ALL_CITIES || event.city === city,
  );
  const upcoming = inCity
    .filter((event) => eventStatus(event, today) === "upcoming")
    .sort((a, b) => eventTime(a) - eventTime(b));
  const past = inCity
    .filter((event) => eventStatus(event, today) === "past")
    .sort((a, b) => eventTime(b) - eventTime(a));

  if (status === "upcoming") return upcoming;
  if (status === "past") return past;
  if (status === "featured") {
    return inCity
      .filter((event) => event.featured)
      .sort(
        (a, b) =>
          (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
            (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) ||
          eventTime(a) - eventTime(b),
      );
  }
  return [...upcoming, ...past];
}

/** Opens on a featured upcoming event, else the nearest upcoming, else first. */
function defaultIndex(deck: JazzclubEvent[], today: number) {
  const featured = deck.findIndex(
    (event) => event.featured && eventStatus(event, today) === "upcoming",
  );
  if (featured !== -1) return featured;
  const upcoming = deck.findIndex(
    (event) => eventStatus(event, today) === "upcoming",
  );
  return upcoming === -1 ? 0 : upcoming;
}

export function EventsSection() {
  const [today] = useState(startOfToday);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [city, setCity] = useState<string>(ALL_CITIES);

  const cities = useMemo(() => eventCities(jazzclubEvents), []);
  const deck = useMemo(
    () => filterEvents(jazzclubEvents, status, city, today),
    [status, city, today],
  );
  const [activeIndex, setActiveIndex] = useState(() =>
    defaultIndex(deck, today),
  );

  function applyFilters(nextStatus: StatusFilter, nextCity: string) {
    setStatus(nextStatus);
    setCity(nextCity);
    setActiveIndex(
      defaultIndex(filterEvents(jazzclubEvents, nextStatus, nextCity, today), today),
    );
  }

  // A new key per filter set replays the short swap transition.
  const deckKey = `${status}|${city}`;

  return (
    <section
      id={EVENTS_ID}
      aria-labelledby="events-heading"
      className="jc-section jc-section--dark relative w-full overflow-hidden scroll-mt-24"
    >
      <div className="page-section">
        <div className="mx-auto max-w-[var(--max-content)] text-center">
          <h2 id="events-heading" className="jc-title mx-auto max-w-[22ch]">
            Find the next Jazz Club room near you.
          </h2>

          <div className="mx-auto mt-7 flex max-w-[900px] flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <div
              role="radiogroup"
              aria-label="Event status"
              className="flex w-full flex-nowrap items-center justify-center gap-1.5 sm:w-auto sm:flex-wrap sm:gap-3"
            >
              {STATUS_FILTERS.map((filter) => {
                const selected = filter.id === status;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => applyFilters(filter.id, city)}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-[13px] font-semibold sm:px-6 sm:py-2.5 sm:text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      selected
                        ? "border-white bg-white text-[#08080a]"
                        : "border-white/20 bg-transparent text-white/80 hover:border-white/45 hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <span aria-hidden="true" className="mx-1.5 hidden h-9 w-px bg-white/15 sm:block" />

            <label className="relative inline-flex items-center">
              <span className="sr-only">City</span>
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute left-4 h-4 w-4 text-white/80"
              />
              <select
                value={city}
                onChange={(event) => applyFilters(status, event.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-white/20 bg-transparent py-2.5 pl-10 pr-10 text-sm font-semibold text-white/90 transition-colors duration-200 hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <option value={ALL_CITIES} className="bg-[#131315] text-white">
                  All cities
                </option>
                {cities.map((name) => (
                  <option key={name} value={name} className="bg-[#131315] text-white">
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 h-4 w-4 text-white/80"
              />
            </label>
          </div>
        </div>
      </div>

      <div key={deckKey} className="jc-deck-swap">
        {deck.length > 0 ? (
          <EventDeck
            events={deck}
            activeIndex={Math.min(activeIndex, deck.length - 1)}
            onActiveChange={setActiveIndex}
          />
        ) : (
          // Same height as the deck, so switching to an empty filter never
          // makes the page jump.
          <div className="page-section">
            <div className="mx-auto flex h-[500px] max-w-[var(--max-content)] flex-col items-center justify-center gap-5 text-center sm:h-[586px]">
              <p className="text-xl font-semibold text-white">No events here yet.</p>
              <button
                type="button"
                onClick={() => applyFilters("all", ALL_CITIES)}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#08080a] transition hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View all events
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
