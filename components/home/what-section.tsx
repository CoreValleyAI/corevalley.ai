/**
 * "Everything AI needs, run for you" (home, What we do): what running AI
 * takes, row by row — on your own on the left, with CoreValley on the
 * right — each row drawn as the real object (what-art.tsx).
 *
 * As the list is read (ScrollSteps, --step), each row is handed over: its
 * box ticks, the link to the right lights and flows, and the CoreValley
 * side comes forward. Without JS or with reduced motion every row is shown
 * handed over. Server markup throughout; the frame only sets --step.
 */
import { WhatArt } from "@/components/home/what-art";
import { ScrollSteps } from "@/components/motion/frames";
import { NoteRef, type Notes } from "@/components/system/fact";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { v } from "@/lib/facts";

function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M3.5 8.5 L6.8 11.5 L12.5 4.5" pathLength={1} className="what-tick fill-none" strokeWidth="1.8" />
    </svg>
  );
}

export function WhatSection({ notes }: { notes: Notes }) {
  const w = HOME.what;
  return (
    <section id="what" aria-labelledby="what-title" className="section-y relative isolate scroll-mt-[var(--header-h)]">
      <GlassLight quiet />
      <div className="container-page flex flex-col gap-12 md:gap-14">
        <SectionHead id="what-title" kicker={w.kicker} title={w.title} continuation={w.continuation} lead={w.lead} />

        <ScrollSteps steps={w.rows.length} from={0} to={0.9} className="what">
          <div aria-hidden="true" className="what-head">
            <p className="type-kicker text-ink-3">{w.yourself}</p>
            <span />
            <p className="type-kicker text-hydro-ink light:text-hydro">{w.withUs}</p>
          </div>

          <ol className="what-rows">
            {w.rows.map((r, i) => (
              <li key={r.id} className="what-row" style={{ "--row": i } as React.CSSProperties}>
                <div className="what-self">
                  <span aria-hidden="true" className="what-box">
                    <Tick className="size-3.5" />
                  </span>
                  <WhatArt part={r.id} className="what-art" />
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="type-body font-semibold text-ink">{r.name}</h3>
                    <p className="type-small text-ink-2">
                      <span className="what-tag">{w.yourself}: </span>
                      {r.yourself}
                    </p>
                  </div>
                </div>

                <svg viewBox="0 0 80 24" preserveAspectRatio="none" className="what-link" aria-hidden="true" focusable="false">
                  <path d="M2 12 H 72" className="what-link__base" />
                  <path d="M2 12 H 72" className="what-link__flow" />
                  <path d="M68 7 L 74 12 L 68 17" className="what-link__head" />
                </svg>

                <div className="what-us">
                  <span aria-hidden="true" className="what-dot">
                    <Tick className="size-3.5" />
                  </span>
                  <p className="type-small text-ink">
                    <span className="what-tag what-tag--us">{w.withUs}: </span>
                    {r.withUs}
                    {r.note ? <NoteRef notes={notes} id={r.note} /> : null}
                    {r.href ? (
                      <>
                        {" "}
                        <TextLink href={r.href} arrow className="type-small whitespace-nowrap">
                          <span className="sr-only">{r.name}: </span>More
                        </TextLink>
                      </>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="what-foot">
            <p className="type-small text-ink-3">{w.before.yourself}</p>
            <span />
            <p className="type-small font-medium text-ink">
              {w.before.withUs} A plan and a firm quote {v("contact.reply").toLowerCase()}.
            </p>
          </div>
        </ScrollSteps>

        <div>
          <TextLink href={w.link.href} arrow>
            {w.link.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
