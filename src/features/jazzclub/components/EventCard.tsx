import Image from "next/image";
import {
  CTA_LABEL_MOBILE,
  ctaIsAction,
  eventCta,
  eventStatus,
  formatEventDateShort,
  type JazzclubEvent,
} from "../data/events";

/** Compact state pills — secondary to the artwork, title and CTA. */
function StatusPills({ event }: { event: JazzclubEvent }) {
  const past = eventStatus(event) === "past";
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      {event.featured && !past && (
        <span className="jc-status jc-status--featured">Featured</span>
      )}
      <span className={`jc-status ${past ? "jc-status--past" : "jc-status--upcoming"}`}>
        {past ? "Past" : "Upcoming"}
      </span>
    </span>
  );
}

type Props = {
  event: JazzclubEvent;
  isActive: boolean;
};

/**
 * A single event card: full square poster (never cropped), city + status,
 * title, date, full-width CTA. Same hierarchy on phones and desktop.
 *
 * Only the ACTIVE card's CTA is a link. Side cards render the same CTA as an
 * inert label; the deck turns a side-card click into "make active".
 */
export function EventCard({ event, isActive }: Props) {
  const cta = eventCta(event);
  const label = CTA_LABEL_MOBILE[cta];
  const isAction = ctaIsAction(cta);
  const isPast = cta === "past" || cta === "recap";
  const href = cta === "recap" ? event.recapUrl : event.url;

  // One full-width button at every size.
  const ctaClass = `inline-flex h-12 w-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-semibold sm:h-[52px] sm:text-base ${
    cta === "past"
      ? "bg-[#ecebe6] text-[#6b6b73]"
      : isAction
        ? "bg-[#131315] text-white"
        : "border border-[#d8d5cc] text-[#6b6b73]"
  }`;

  const ctaContent = (
    <>
      {label}
      {isAction && <span aria-hidden="true">→</span>}
    </>
  );

  return (
    <article className="flex h-full flex-col rounded-[26px] bg-white p-4 shadow-[0_18px_50px_rgba(16,16,20,0.18)] ring-1 ring-black/5">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-white">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={`${event.title} — ${event.city}`}
            fill
            sizes="(max-width: 640px) 380px, 420px"
            className={`object-contain object-center ${isPast && !isActive ? "grayscale-[25%]" : ""}`}
            priority={isActive}
            draggable={false}
          />
        ) : (
          // No artwork supplied for this event yet.
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center"
            style={{
              background: `linear-gradient(150deg, ${event.accent} 0%, #131315 130%)`,
            }}
          >
            <span className="text-[11px] font-semibold tracking-[0.34em] text-white/75">
              JAZZCLUB
            </span>
            <span className="text-4xl font-bold leading-none text-white">
              {event.city}
            </span>
            <span className="h-px w-10 bg-white/40" />
            <span className="text-xs font-medium tracking-[0.18em] text-white/70">
              {event.title.replace(/^\[Demo\]\s*/, "").toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-semibold tracking-[0.28em] text-[#e8574c]">
            {event.city.toUpperCase()}
          </span>
          <StatusPills event={event} />
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-[#131315] sm:mt-2 sm:text-lg">
          {event.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#6b6b73] sm:mt-1.5">
          {formatEventDateShort(event)}
        </p>

        <div className="mt-auto pt-3 sm:pt-4">
          {isActive && isAction && href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              className={`${ctaClass} transition hover:bg-[#2a2a2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8574c]`}
            >
              {ctaContent}
            </a>
          ) : (
            <span className={ctaClass}>{ctaContent}</span>
          )}
        </div>
      </div>
    </article>
  );
}
