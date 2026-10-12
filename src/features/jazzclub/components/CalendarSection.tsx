import { SPONSOR_ID } from "../data/anchors";
import { CALENDAR_HEADING, CALENDAR_INTRO } from "../data/calendar-2027";
import { COHOST_CTA_LABEL } from "../data/sponsors";
import { CalendarGrid } from "./CalendarGrid";
import { CityStrip } from "./CityStrip";
import { SponsorCta } from "./SponsorCta";

/** Figma: heading + intro + co-host CTA, city strip, then the quarter cards. */
export function CalendarSection() {
  return (
    <section aria-labelledby="calendar-2027-heading" className="page-section">
      <div className="mx-auto max-w-[var(--max-content)]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="pt-1.5">
            <h2 id="calendar-2027-heading" className="jc-h2">
              {CALENDAR_HEADING}
            </h2>
            <p className="jc-lead mt-3.5 max-w-[860px]">{CALENDAR_INTRO}</p>
          </div>
          <SponsorCta target={SPONSOR_ID} tone="dark">
            {COHOST_CTA_LABEL}
          </SponsorCta>
        </div>

        <div className="mt-8">
          <CityStrip />
        </div>

        <div className="mt-12">
          <CalendarGrid />
        </div>
      </div>
    </section>
  );
}
