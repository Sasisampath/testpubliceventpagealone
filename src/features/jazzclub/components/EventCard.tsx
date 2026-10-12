import Image from "next/image";
import {
  CTA_LABEL,
  CTA_LABEL_MOBILE,
  ctaIsAction,
  eventCta,
  eventStatus,
  formatEventDate,
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
 * A single event card (V2 visual design, unchanged). The artwork is the
 * event's own thumbnail — never archive photography.
 *
 * Only the ACTIVE card's CTA is a link. Side cards render the same CTA as an
 * inert label; the deck turns a side-card click into "make active".
 */
export function EventCard({ event, isActive }: Props) {
  const cta = eventCta(event);
  const label = CTA_LABEL[cta];
  const isAction = ctaIsAction(cta);
  const isPast = cta === "past" || cta === "recap";
  const href = cta === "recap" ? event.recapUrl : event.url;

  // Phones: one full-width 48px button. Desktop: the compact pill.
  const ctaClass = `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold max-sm:h-12 max-sm:w-full max-sm:justify-center max-sm:text-sm ${
    cta === "past"
      ? "bg-[#ecebe6] text-[#6b6b73]"
      : isAction
        ? "bg-[#131315] text-white"
        : "border border-[#d8d5cc] text-[#6b6b73]"
  }`;

  const ctaContent = (
    <>
      <span className="sm:hidden">{CTA_LABEL_MOBILE[cta]}</span>
      <span className="max-sm:hidden">{label}</span>
      {isAction && <span aria-hidden="true">→</span>}
    </>
  );

  return (
    <article className="flex h-full flex-col rounded-[26px] bg-white p-4 shadow-[0_18px_50px_rgba(16,16,20,0.18)] ring-1 ring-black/5">
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-2xl sm:aspect-square sm:shrink">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={`${event.title} — ${event.city}`}
            fill
            sizes="(max-width: 640px) 360px, 340px"
            className={`object-cover ${isPast && !isActive ? "grayscale-[25%]" : ""}`}
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

      <div className="flex flex-1 flex-col px-1 pt-4 sm:pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-semibold tracking-[0.28em] text-[#e8574c]">
            {event.city.toUpperCase()}
          </span>
          <StatusPills event={event} />
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-[#131315] sm:line-clamp-none sm:text-lg">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5b5b63] max-sm:hidden">
          {event.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <span className="text-sm font-medium text-[#6b6b73] sm:hidden">
            {formatEventDateShort(event)}
          </span>
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
          <span className="text-right text-xs font-medium text-[#6b6b73] max-sm:hidden">
            {formatEventDate(event)}
          </span>
        </div>
      </div>
    </article>
  );
}
