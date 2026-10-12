"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { JazzclubEvent } from "../data/events";
import { EventCard } from "./EventCard";

type Props = {
  events: JazzclubEvent[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
};

/**
 * Deck geometry, indexed by distance from the active card (0 = active).
 * `x` is the horizontal offset as a fraction of the card width, so cards
 * overlap like a physical deck rather than sitting in a row with gaps.
 */
const X = [0, 0.8, 1.42, 1.94, 2.36];
const SCALE = [1, 0.9, 0.8, 0.7, 0.62];
const ROTATE = [0, 5, 9, 13, 16];
const OPACITY = [1, 1, 0.9, 0.75, 0];
const BRIGHTNESS = [1, 0.82, 0.68, 0.56, 0.5];
const MAX_VISIBLE = 3;

/** Fraction of a card width that counts as a committed drag. */
const DRAG_COMMIT = 0.18;
const CLICK_SUPPRESS_DISTANCE = 6;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Entrance runs once on mount; after this the classes are dropped. */
const ENTRANCE_MS = 360;

function sample(table: number[], distance: number) {
  const d = Math.min(distance, table.length - 1);
  const lo = Math.floor(d);
  const hi = Math.min(lo + 1, table.length - 1);
  return table[lo] + (table[hi] - table[lo]) * (d - lo);
}

/** Continuous so drag follows the finger and releases snap cleanly. */
function cardStyle(
  offset: number,
  cardWidth: number,
  dragging: boolean,
): React.CSSProperties {
  const distance = Math.abs(offset);
  const sign = Math.sign(offset);
  const x = sign * sample(X, distance) * cardWidth;
  const scale = sample(SCALE, distance);
  const rotate = -sign * sample(ROTATE, distance);
  const opacity = distance > MAX_VISIBLE + 0.5 ? 0 : sample(OPACITY, distance);
  const brightness = sample(BRIGHTNESS, distance);

  return {
    transform: `translateX(-50%) translateX(${x}px) translateZ(${-distance * 60}px) rotateY(${rotate}deg) scale(${scale})`,
    zIndex: 100 - Math.round(distance * 10),
    opacity,
    filter: distance < 0.01 ? "none" : `brightness(${brightness})`,
    visibility: opacity === 0 ? "hidden" : "visible",
    transition: dragging
      ? "none"
      : `transform 520ms ${EASE}, opacity 520ms ease, filter 520ms ease`,
  };
}

/**
 * Layered, fanned event deck. Plain React + CSS transforms (V2 motion).
 * - The deck only decides which event is active.
 * - A side-card click makes that card active; it never opens its link.
 * - Only the active card's CTA navigates.
 */
export function EventDeck({ events, activeIndex, onActiveChange }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(330);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pointerId = useRef<number | null>(null);
  const startX = useRef(0);
  const moved = useRef(0);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), ENTRANCE_MS);
    return () => clearTimeout(timer);
  }, []);

  const count = events.length;
  const index = Math.min(activeIndex, count - 1);

  // Card width drives the overlap spacing; it changes with breakpoints.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const card = stage.querySelector<HTMLElement>("[data-deck-card]");
      if (card) setCardWidth(card.offsetWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (clamped !== index) onActiveChange(clamped);
  }

  // Drag position in "cards", resisted at the ends of the deck.
  const step = cardWidth * X[1];
  let dragCards = step > 0 ? -dragX / step : 0;
  const projected = index + dragCards;
  if (projected < 0) dragCards = -index + projected * 0.3;
  if (projected > count - 1) dragCards = count - 1 - index + (projected - (count - 1)) * 0.3;

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId.current = event.pointerId;
    startX.current = event.clientX;
    moved.current = 0;
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || event.pointerId !== pointerId.current) return;
    const delta = event.clientX - startX.current;
    moved.current = Math.max(moved.current, Math.abs(delta));
    setDragX(delta);
  }

  function endDrag() {
    if (!dragging) return;
    setDragging(false);
    pointerId.current = null;
    // Always snap to a whole card — never rest between two states.
    if (Math.abs(dragCards) >= DRAG_COMMIT) {
      const jump =
        Math.sign(dragCards) * Math.max(1, Math.round(Math.abs(dragCards)));
      goTo(index + jump);
    }
    setDragX(0);
  }

  // A drag must never also count as a click (on a card or on a CTA).
  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (moved.current > CLICK_SUPPRESS_DISTANCE) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  }

  const arrowClass =
    "flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#08080a] transition hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white";

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Jazzclub events"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={handleClickCapture}
        className={`${entering ? "jc-enter-deck" : ""} relative mt-6 h-[380px] w-full sm:mt-8 touch-pan-y select-none [perspective:1600px] focus-visible:outline-none sm:h-[490px] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {events.map((event, i) => {
          const offset = i - index - dragCards;
          const isActive = i === index;
          const distance = Math.abs(i - index);
          return (
            <div
              key={event.id}
              data-deck-card
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${event.title}`}
              onClick={isActive ? undefined : () => goTo(i)}
              className={`absolute left-1/2 top-0 h-[370px] w-[220px] sm:h-[480px] sm:w-[320px] lg:w-[330px] ${
                isActive ? "" : "cursor-pointer"
              }`}
              style={{
                ...cardStyle(offset, cardWidth, dragging),
                pointerEvents: distance > MAX_VISIBLE ? "none" : "auto",
              }}
            >
              <div
                className={`h-full ${entering ? "jc-enter-card" : ""}`}
                style={entering ? { animationDelay: `${distance * 40}ms` } : undefined}
              >
                <EventCard event={event} isActive={isActive} />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`${entering ? "jc-enter-rise" : ""} mt-4 flex items-center justify-center gap-10 sm:mt-6`}
        style={entering ? { animationDelay: "120ms" } : undefined}
      >
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous event"
          className={arrowClass}
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
        </button>

        <span
          aria-live="polite"
          className="min-w-[64px] text-center text-base font-semibold tabular-nums text-white"
        >
          {index + 1} / {count}
        </span>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === count - 1}
          aria-label="Next event"
          className={arrowClass}
        >
          <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
