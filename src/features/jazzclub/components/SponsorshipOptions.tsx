import Image from "next/image";
import { SPONSOR_ID } from "../data/anchors";
import {
  COHOST_CTA_LABEL,
  COHOST_HEADING,
  COHOST_INTRO,
  COHOST_OPTIONS,
} from "../data/sponsors";
import { SponsorCta } from "./SponsorCta";

/** Figma tick: 18px filled circle with a white check. */
function Tick({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 16.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
        fill={color}
        stroke={color}
        strokeWidth="1.125"
      />
      <path
        d="M6 9.375 7.5 10.875 11.625 7.125"
        stroke="#fff"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma "Co-hosting options": heading + intro + CTA, three equal cards. */
export function SponsorshipOptions() {
  return (
    <section aria-labelledby="cohost-heading" className="page-section">
      <div className="mx-auto max-w-[var(--max-content)]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="pt-1.5">
            <h2 id="cohost-heading" className="jc-h2">
              {COHOST_HEADING}
            </h2>
            <p className="jc-lead mt-3.5">{COHOST_INTRO}</p>
          </div>
          <SponsorCta target={SPONSOR_ID} tone="dark">
            {COHOST_CTA_LABEL}
          </SponsorCta>
        </div>

        <ul className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
          {COHOST_OPTIONS.map((option) => (
            <li
              key={option.id}
              className="jc-plan"
              style={{ backgroundColor: option.surface }}
            >
              <h3 className="jc-plan__title">{option.name}</h3>
              <p className="jc-plan__brand">{option.tagline}</p>

              <div className="jc-plan__media">
                <Image
                  src={option.image}
                  alt={option.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>

              <ul className="jc-plan__points">
                {option.points.map((point) => (
                  <li key={point}>
                    <Tick color={option.tick} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
