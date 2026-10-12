import { CALENDAR_2027 } from "../data/calendar-2027";

/**
 * Figma calendar: four quarter cards with a solid colour header, a row per
 * month and tinted city chips. Data from `calendar-2027.ts`.
 */
export function CalendarGrid() {
  return (
    <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {CALENDAR_2027.map((quarter) => (
        <section
          key={quarter.id}
          aria-label={`${quarter.label} 2027`}
          className="jc-q"
          style={{
            ["--jc-q" as string]: quarter.accent,
            ["--jc-chip" as string]: quarter.chip,
            ["--jc-dot" as string]: quarter.dot,
          }}
        >
          <header className="jc-q__head">
            <h3 className="jc-q__label">{quarter.label}</h3>
            <span className="jc-q__year">2027</span>
          </header>

          <dl>
            {quarter.months.map((entry) => (
              <div key={entry.month} className="jc-q__row">
                <dt className="jc-q__month">{entry.month}</dt>
                <dd>
                  <ul className="flex flex-col items-start gap-2">
                    {entry.cities.map((city) => (
                      <li key={city} className="jc-q__city">
                        {city}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
