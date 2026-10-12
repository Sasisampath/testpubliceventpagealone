"use client";

import {
  ATTEND_LABEL,
  EVENTS_ID,
  SPONSOR_ID,
  SPONSOR_LABEL,
  scrollToSection,
} from "../data/anchors";
import { JazzclubPlaque } from "./JazzclubPlaque";

export type HeroPhase = "loading" | "intro" | "settling" | "idle";

type Props = {
  phase: HeroPhase;
  /** The plaque has started (or finished) settling into place. */
  showPlaque: boolean;
  /** Settle quickly — skip, returning visit or reduced motion. */
  fastSettle: boolean;
  onSkip: () => void;
};

/**
 * DOM layer above the WebGL canvas. The plaque and CTAs live here rather
 * than in the scene so they stay crisp, selectable and keyboard accessible.
 */
export function HeroOverlay({ phase, showPlaque, fastSettle, onSkip }: Props) {
  const duration = fastSettle ? "duration-200" : "duration-[900ms]";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
    >
      {/* Soft scrim behind the copy only — the ring stays visible. */}
      <div
        aria-hidden="true"
        className={`absolute h-[min(560px,110vh)] w-[min(620px,130vw)] rounded-full bg-[radial-gradient(circle,rgba(8,8,10,0.82)_0%,rgba(8,8,10,0.6)_40%,rgba(8,8,10,0.2)_65%,rgba(8,8,10,0)_78%)] transition-opacity ${duration} ${
          showPlaque ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Plaque settles into the scene: slightly back and low → final. */}
        <div
          className={`transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] ${duration} ${
            showPlaque
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-3 scale-[0.94] opacity-0"
          }`}
        >
          <JazzclubPlaque interactive={phase === "idle"} />
        </div>

        <div
          className={`flex flex-col items-center transition-[opacity,transform] ease-out ${
            fastSettle ? "duration-200" : "delay-200 duration-700"
          } ${
            showPlaque
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <p className="mt-8 max-w-[34ch] text-balance text-base leading-relaxed text-white/85 sm:text-lg">
            Invite-only rooms where AI founders, operators, and partners close real deals.
          </p>

          <div className="pointer-events-auto mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            {/* Primary — left (Figma). */}
            <a
              href={`#${EVENTS_ID}`}
              onClick={(event) => scrollToSection(event, EVENTS_ID)}
              className="inline-flex items-center gap-2 rounded-full bg-[#e8574c] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(232,87,76,0.35)] transition hover:bg-[#d54a40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {ATTEND_LABEL}
              <span aria-hidden="true">→</span>
            </a>
            {/* Secondary — right (Figma). */}
            <a
              href={`#${SPONSOR_ID}`}
              onClick={(event) => scrollToSection(event, SPONSOR_ID)}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/70 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {SPONSOR_LABEL}
              <span aria-hidden="true">→</span>
            </a>

          </div>
        </div>
      </div>

      {/* Utility control, only while the intro is running. */}
      {(phase === "intro" || phase === "settling") && (
        <button
          type="button"
          onClick={onSkip}
          className="group pointer-events-auto absolute bottom-6 right-6 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/50 transition-colors hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:bottom-8 sm:right-10 sm:text-[13px]"
        >
          Skip intro
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      )}
    </div>
  );
}
