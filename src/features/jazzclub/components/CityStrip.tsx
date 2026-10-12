import Image from "next/image";
import { CALENDAR_CITIES } from "../data/calendar-2027";

/**
 * Figma city strip: 174x204 cards, slowly auto-scrolling as a seamless loop
 * (the list is rendered twice and the track moves by exactly one set).
 * Pauses on hover, focus or touch; static under reduced motion.
 */
export function CityStrip() {
  const loop = [...CALENDAR_CITIES, ...CALENDAR_CITIES];
  return (
    <div className="jc-strip" role="region" aria-label="JazzClub cities in 2027">
      <ul className="jc-strip__track">
        {loop.map((city, index) => {
          const clone = index >= CALENDAR_CITIES.length;
          return (
            <li key={`${city.id}-${index}`} className="jc-city" aria-hidden={clone}>
              <Image
                src={`/assets/jazzclub/cities/${city.id}.webp`}
                alt={clone ? "" : city.name}
                fill
                sizes="174px"
                loading="lazy"
                className="object-cover"
              />
              <span aria-hidden="true" className="jc-city__shade" />
              <span className="jc-city__meta">
                <span className="jc-city__icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/jazzclub/cities/${city.icon}`}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="jc-city__name">{city.name}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
