/**
 * "Pay for the seconds you use" (home, Billing): the receipt a job
 * produces, so the billing rules read off something everyone knows. Pick a
 * sample job and a billing mode; the receipt shows what ran, the minimum,
 * the rounding, the currency and how to pay — and, billed by the hour for
 * comparison, the time that rounding would add.
 *
 * Zero JavaScript: every job's receipt, in both modes, is server markup
 * computed by lib/art/receipt.ts; CSS (:has, app/styles/home.css → .rc)
 * shows the one picked. Sample jobs, no prices: rates are quoted per
 * request.
 */
import { NoteRef, type Notes } from "@/components/system/fact";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { addClock, clock, hourly, MINIMUM_SECONDS, perSecond, spoken } from "@/lib/art/receipt";
import { v } from "@/lib/facts";

function Row({ k, value, mode, strong, extra, i }: { k: string; value: React.ReactNode; mode?: "second" | "hour"; strong?: boolean; extra?: boolean; i: number }) {
  return (
    <div
      className={`rc-row${strong ? " rc-row--total" : ""}${extra ? " rc-row--extra" : ""}`}
      data-mode={mode}
      style={{ "--i": i } as React.CSSProperties}
    >
      <dt>{k}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/** A decorative barcode, the same for every receipt. */
function Barcode() {
  const bars: React.ReactNode[] = [];
  let x = 0;
  for (let i = 0; i < 46; i++) {
    const w = [1, 2, 1, 3, 1, 1, 2][(i * 5) % 7]!;
    bars.push(<rect key={i} x={x} y="0" width={w} height="18" />);
    x += w + [1, 2, 1][(i * 3) % 3]!;
  }
  return (
    <svg viewBox={`0 0 ${x} 18`} preserveAspectRatio="none" className="rc-barcode" aria-hidden="true" focusable="false">
      {bars}
    </svg>
  );
}

export function ReceiptSection({ notes }: { notes: Notes }) {
  const r = HOME.receipt;
  const p = r.paper;
  return (
    <section aria-labelledby="receipt-title" className="section-y relative isolate">
      <GlassLight variant="c" />
      <div className="rc container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHead id="receipt-title" kicker={r.kicker} title={r.title} continuation={r.continuation} lead={r.lead} />
          <div className="flex flex-col gap-6">
            <fieldset>
              <legend className="type-kicker mb-3 text-ink-3">{r.jobsLabel}</legend>
              <div className="flex flex-wrap gap-2">
                {r.jobs.map((j) => (
                  <label key={j.id} className="pa-chip">
                    <input type="radio" name="rc-job" id={`rc-${j.id}`} value={j.id} defaultChecked={j.id === "run"} className="sr-only" />
                    {j.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="type-kicker mb-3 text-ink-3">{r.modeLabel}</legend>
              <div className="rc-mode">
                {(["second", "hour"] as const).map((m) => (
                  <label key={m} className="rc-mode__opt">
                    <input type="radio" name="rc-mode" id={`rc-${m}`} value={m} defaultChecked={m === "second"} className="sr-only" />
                    {r.modes[m]}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <ul className="flex flex-col gap-2.5">
            {r.points.map((pt) => (
              <li key={pt} className="type-body flex items-baseline gap-3 text-ink-2">
                <span aria-hidden="true" className="size-1.5 shrink-0 translate-y-[-0.15rem] rounded-full bg-hydro" />
                {pt}
              </li>
            ))}
          </ul>
          <div>
            <TextLink href={r.link.href} arrow>
              {r.link.label}
            </TextLink>
          </div>
        </div>

        <figure className="flex flex-col items-center gap-4">
          <div className="rc-stage" aria-live="polite">
            {r.jobs.map((j) => {
              const ps = perSecond(j.seconds);
              const hs = hourly(j.seconds);
              let i = 0;
              return (
                <div key={j.id} data-job={j.id} className="rc-paper">
                  <div className="rc-head" style={{ "--i": i++ } as React.CSSProperties}>
                    <p className="rc-brand">{p.head}</p>
                    <p className="rc-sub" data-mode="second">
                      {p.sub}
                    </p>
                    <p className="rc-sub" data-mode="hour">
                      {p.compare}
                    </p>
                  </div>
                  <dl>
                    <Row i={i++} k={p.job} value={j.label} />
                    <Row i={i++} k={p.ranOn} value={`${j.ranOn} · ${v("gpu.model")}`} />
                    <Row i={i++} k={p.started} value={j.start} />
                    <Row i={i++} k={p.stopped} value={addClock(j.start, j.seconds)} />
                    <Row i={i++} k={p.queue} value={p.queueValue} />
                  </dl>
                  <hr className="rc-rule" />
                  <dl>
                    <Row i={i++} k={p.time} value={clock(j.seconds)} />
                    <Row i={i} k={p.per} value={p.perValue.second} mode="second" />
                    <Row i={i++} k={p.per} value={p.perValue.hour} mode="hour" />
                    <Row i={i++} k={p.minimum} value={`${v("billing.minimum")}${j.seconds >= MINIMUM_SECONDS ? " · met" : ""}`} />
                    <Row i={i} k={p.rounded} value={p.none} mode="second" />
                    <Row i={i++} k={p.rounded} value={`+ ${clock(hs - j.seconds)}`} mode="hour" extra />
                  </dl>
                  <hr className="rc-rule" />
                  <dl>
                    <Row i={i++} k={p.currency} value={v("billing.currency")} />
                    <Row i={i++} k={p.margin} value={p.none} />
                    <Row i={i++} k={p.vat} value={p.vatValue} />
                    <Row i={i++} k={p.payBy} value={v("billing.rails")} />
                  </dl>
                  <hr className="rc-rule rc-rule--double" />
                  <dl>
                    <Row i={i} k={p.total} value={spoken(ps)} mode="second" strong />
                    <Row i={i++} k={p.total} value={spoken(hs)} mode="hour" strong extra />
                  </dl>
                  <div className="rc-tail" style={{ "--i": i } as React.CSSProperties}>
                    <Barcode />
                  </div>
                </div>
              );
            })}
          </div>
          <figcaption className="type-caption text-center text-ink-3">
            Illustration · sample jobs, no rates
            <NoteRef notes={notes} id="receipt" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
