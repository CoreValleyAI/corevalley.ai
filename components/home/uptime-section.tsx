/**
 * "99.99 %, in plain time" (home, Reliability): the facility's uptime
 * commitment turned into time — about 53 minutes a year, at most — on one
 * pane of liquid glass beside the statement. It is the facility's
 * commitment (power, cooling, building), not a service-level promise; both
 * footnotes say so.
 */
import { NoteRef, type Notes } from "@/components/system/fact";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { v } from "@/lib/facts";

export function UptimeSection({ notes }: { notes: Notes }) {
  const u = HOME.uptime;
  // "≈ 53 minutes" → the number, set large, and its unit.
  const [, num = v("place.uptimeMinutes"), unit = ""] = /^(.*?\d+)\s*(.*)$/.exec(v("place.uptimeMinutes")) ?? [];
  return (
    <section aria-labelledby="uptime-title" className="section-y relative isolate">
      <GlassLight variant="a" />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHead
            id="uptime-title"
            kicker={u.kicker}
            title={u.title}
            continuation={u.continuation}
            lead={
              <>
                {u.lead}
                <NoteRef notes={notes} id="place.uptime" />
              </>
            }
          />
          <div>
            <TextLink href={u.link.href} arrow>
              {u.link.label}
            </TextLink>
          </div>
        </div>

        <div data-refract data-refract-bezel="24" className="lg flex flex-col gap-5 rounded-panel p-8 md:p-10" data-reveal>
          <p className="type-kicker text-ink-3">{u.card}</p>
          <p className="font-semibold leading-none text-ink">
            <span className="text-[clamp(3.5rem,7vw,5.5rem)] tracking-[-0.045em] tabular">{num}</span>{" "}
            <span className="type-title-3">{unit}</span>
            <NoteRef notes={notes} id="place.uptimeMinutes" />
          </p>
          <div className="flex flex-col gap-1">
            <p className="type-body font-medium text-ink">{u.sub}</p>
            <p className="type-small text-ink-2">{u.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
