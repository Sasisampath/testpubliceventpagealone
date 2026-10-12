import Image from "next/image";
import {
  JAZZCLUB_TESTIMONIALS,
  TESTIMONIALS_HEADING,
} from "../data/jazzclub-testimonials";

/**
 * Figma composition — portrait stage with the name as an oversized
 * watermark, logo + name + role beside the cut-out, coral quote block —
 * executed at web quality: 800px transparent cut-outs, equal card heights
 * and a quote block that grows with its copy.
 */
export function JazzclubTestimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="page-section">
      <div className="mx-auto max-w-[var(--max-content)]">
        <h2 id="testimonials-heading" className="jc-h2 text-center">
          {TESTIMONIALS_HEADING}
        </h2>

        <ul className="mt-5 grid gap-[17px] lg:grid-cols-3">
          {JAZZCLUB_TESTIMONIALS.map((person) => (
            <li key={person.id} className="flex">
              <figure
                className="jc-voice w-full"
                style={{ ["--jc-accent" as string]: person.panel }}
              >
                <div className="jc-voice__stage">
                  <div className="jc-voice__portrait">
                    <Image
                      src={person.portrait}
                      alt={`${person.name}, ${person.role} at ${person.company}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 60vw, 260px"
                      className="object-contain object-bottom"
                    />
                  </div>

                  <figcaption className="jc-voice__meta">
                    {person.logo && (
                      <Image
                        src={person.logo}
                        alt={person.company}
                        width={110}
                        height={26}
                        loading="lazy"
                        className="jc-voice__logo"
                      />
                    )}
                    <p className="jc-voice__name">
                      {person.name.split(" ").map((part) => (
                        <span key={part} className="block">
                          {part}
                        </span>
                      ))}
                    </p>
                    <p className="jc-voice__role">{person.role}</p>
                  </figcaption>
                </div>

                {person.quote && (
                  <div
                    className="jc-voice__quote"
                    style={{ backgroundColor: person.quoteBg }}
                  >
                    <span aria-hidden="true" className="jc-voice__mark">
                      “
                    </span>
                    <blockquote>{person.quote}</blockquote>
                  </div>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
