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

/** The marked day: a Wednesday in late July. */
const MARK = { col: 29, row: 3 };

function YearGrid() {
  // 365 days in week columns of seven: each column one dashed stroke, six
  // units wide, whose dashes are the days.
  let d = "";
  for (let col = 0; col * 7 < 365; col++) {
    const days = Math.min(7, 365 - col * 7);
    d += `M${col * 8 + 3} 0v${days * 8 - 2}`;
  }
  const mx = MARK.col * 8;
  const my = MARK.row * 8;
  return (
    <svg viewBox="-1 -1 426 58" className="up-year" aria-hidden="true" focusable="false">
      <path d={d} className="up-year__days" strokeWidth="6" strokeDasharray="6 2" />
      <rect x={mx - 1} y={my - 1} width="8" height="8" rx="1" className="up-year__mark" />
    </svg>
  );
}

export function UptimeSection({ notes }: { notes: Notes }) {
  const u = HOME.uptime;
  // The most downtime the commitment allows in a year, in minutes (≈ 53).
  const allowance = (YEAR_MINUTES * (100 - parseFloat(v("place.uptime")))) / 100;
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
            <p className="up-panel__note">{u.day}</p>
          </figure>

          <span aria-hidden="true" className="up-leader" />

          <figure className="up-panel up-panel--allow">
            <figcaption className="up-panel__head">
              <span className="up-panel__num">03</span>
              {u.panels.allowance}
            </figcaption>
            <p className="up-allow">
              <F id="place.uptimeMinutes" />
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
