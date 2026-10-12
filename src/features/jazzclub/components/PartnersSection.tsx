import Image from "next/image";
import { PARTNER_LOGOS } from "../data/jazzclub-testimonials";

/** Figma: centred heading over a full-width white band of co-host logos. */
export function PartnersSection() {
  return (
    <section aria-labelledby="partners-heading">
      <div className="page-section">
        <h2 id="partners-heading" className="jc-h2 text-center">
          Previous Co-hosts include
        </h2>
      </div>

      <div className="jc-logo-row mt-[30px]">
      <ul className="jc-logo-row__track">
        {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => (
          <li
            key={`${logo.name}-${index}`}
            className="jc-logo-row__item"
            aria-hidden={index >= PARTNER_LOGOS.length}
          >
            <Image
              src={logo.src}
              alt={index >= PARTNER_LOGOS.length ? "" : logo.name}
              width={180}
              height={40}
              loading="lazy"
              className="jc-logo-row__logo"
            />
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
