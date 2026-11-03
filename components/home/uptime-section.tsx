/**
 * "99.99 %, in plain time" (home, Reliability): the facility's uptime
 * commitment turned into time, in three panels read left to right — a
 * year (every square a day), one day magnified (every dot a minute), and
 * the allowance: about 53 minutes, the most downtime the commitment allows
 * in a whole year, marked on that one day.
 *
 * The facts are the facility's commitment (power, cooling, building), not a
 * service-level promise; both footnotes say so. The finished picture is the
 * resting state; on screen, the marked day and the allowance pulse gently.
 */
import { PlayFrame } from "@/components/motion/frames";
import { F, NoteRef, type Notes } from "@/components/system/fact";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { v } from "@/lib/facts";

/** Minutes in a 365-day year. */
const YEAR_MINUTES = 365 * 24 * 60;

/** A year as a calendar: one row per month, one square per day (365). */
const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
/** The marked day: 23 July. */
const MARK = { month: 6, day: 22 };

function YearGrid() {
  // Each month one dashed stroke, six units thick, whose dashes are its days.
  const d = MONTHS.map((days, m) => `M14 ${m * 8 + 3}h${days * 8 - 2}`).join("");
  return (
    <svg viewBox="0 -1 263 97" className="up-year" aria-hidden="true" focusable="false">
      {INITIALS.map((l, m) => (
        <text key={m} x="4" y={m * 8 + 5.4} className="up-year__month">
          {l}
        </text>
      ))}
      <path d={d} className="up-year__days" strokeWidth="6" strokeDasharray="6 2" />
      <rect x={14 + MARK.day * 8 - 1} y={MARK.month * 8 - 1} width="8" height="8" rx="1" className="up-year__mark" />
    </svg>
  );
}

export function UptimeSection({ notes }: { notes: Notes }) {
  const u = HOME.uptime;
  // The most downtime the commitment allows in a year, in minutes (≈ 53).
  const allowance = (YEAR_MINUTES * (100 - parseFloat(v("place.uptime")))) / 100;
  // "≈ 53 minutes" → the number, set large, and its unit.
  const [, num = v("place.uptimeMinutes"), unit = ""] = /^(.*?\d+)\s*(.*)$/.exec(v("place.uptimeMinutes")) ?? [];
  return (
    <section aria-labelledby="uptime-title" className="section-y relative isolate">
      <GlassLight variant="a" quiet />
      <div className="container-page flex flex-col gap-12">
        <SectionHead
          id="uptime-title"
          kicker={u.kicker}
          title={u.title}
          continuation={u.continuation}
          lead={
            <>
              {u.lead}{" "}
              <strong className="font-semibold text-ink">
                <F id="place.uptimeMinutes" />
              </strong>
              .<NoteRef notes={notes} id="place.uptime" anchor={false} />
            </>
          }
        />

        <PlayFrame className="up">
          <figure className="up-panel">
            <figcaption className="up-panel__head">
              <span className="up-panel__num">01</span>
              {u.panels.year}
            </figcaption>
            <YearGrid />
            <p className="up-panel__note">{u.year}</p>
          </figure>

          <span aria-hidden="true" className="up-leader" />

          <figure className="up-panel">
            <figcaption className="up-panel__head">
              <span className="up-panel__num">02</span>
              {u.panels.day}
            </figcaption>
            <div className="up-day" aria-hidden="true">
              <span className="up-day__allow" style={{ "--allow": allowance } as React.CSSProperties} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <p className="up-panel__note">{u.day}</p>
              <p className="up-legend">
                <span aria-hidden="true" className="up-legend__dot" />
                {u.legend}
              </p>
            </div>
          </figure>

          <span aria-hidden="true" className="up-leader" />

          <figure className="up-panel up-panel--allow">
            <figcaption className="up-panel__head">
              <span className="up-panel__num">03</span>
              {u.panels.allowance}
            </figcaption>
            <p className="up-allow">
              <span className="up-allow__num">{num}</span> <span className="up-allow__unit">{unit}</span>
              <NoteRef notes={notes} id="place.uptimeMinutes" />
            </p>
            <p className="type-body font-medium text-ink">{u.allowanceSub}</p>
            <p className="type-small text-ink-2">{u.allowanceBody}</p>
          </figure>
        </PlayFrame>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="type-caption text-ink-3">{u.caption}</p>
          <TextLink href={u.link.href} arrow>
            {u.link.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
