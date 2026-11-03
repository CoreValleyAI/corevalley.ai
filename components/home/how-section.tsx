/**
 * "From a short brief to running" (home, How to start): the three things
 * a customer actually sees, drawn as themselves — the brief they send, the
 * capacity plan and firm quote that comes back (the reply time is a fact),
 * and their workspace with a job running and its meter counting seconds.
 *
 * As the strip is read (ScrollSteps) the panels light in order and the
 * connector between them fills; without JS or with reduced motion all
 * three are lit. The meter is a CSS odometer that only turns on screen.
 * Sample content, labelled as an illustration; the total is withheld.
 */
import { ScrollSteps } from "@/components/motion/frames";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { HOME } from "@/copy/en/home";
import { v } from "@/lib/facts";

/** Where the meter rests (and the turning starts): four minutes 17 seconds in. */
const AT = 4 * 60 + 17;

/** One odometer wheel: the digits 0…n-1 stacked, turned by CSS. */
function Wheel({ n, period }: { n: number; period: number }) {
  const digit = Math.floor(AT / (period / n)) % n;
  return (
    <span className="how-wheel" style={{ "--n": n, "--t": `${period}s`, "--d": digit, "--at": `-${AT}s` } as React.CSSProperties}>
      <span className="how-wheel__digits">
        {Array.from({ length: n + 1 }, (_, d) => (
          <span key={d}>{d % n}</span>
        ))}
      </span>
    </span>
  );
}

export function HowSection() {
  const h = HOME.how;
  return (
    <section id="how" aria-labelledby="how-title" className="section-y relative isolate scroll-mt-[var(--header-h)]">
      <GlassLight variant="a" />
      <div className="container-page flex flex-col gap-12">
        <SectionHead id="how-title" kicker={h.kicker} title={h.title} continuation={h.continuation} />
        <ScrollSteps steps={3} from={0} to={0.8} className="how">
          <ol className="how-steps">
            {/* 01 · The brief */}
            <li className="how-step" style={{ "--row": 0 } as React.CSSProperties}>
              <div className="how-card" aria-hidden="true">
                <p className="how-card__title">{h.brief.title}</p>
                <dl className="how-fields">
                  {h.brief.fields.map((f) => (
                    <div key={f.k}>
                      <dt>{f.k}</dt>
                      <dd>{f.v}</dd>
                    </div>
                  ))}
                </dl>
                <span className="how-send">{h.brief.send}</span>
              </div>
              <span className="how-num">01</span>
              <h3 className="type-title-3">{h.steps[0]!.title}</h3>
              <p className="type-body text-ink-2">{h.steps[0]!.body}</p>
            </li>

            {/* 02 · The plan and the firm quote */}
            <li className="how-step" style={{ "--row": 1 } as React.CSSProperties}>
              <div className="how-card how-card--doc" aria-hidden="true">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="how-card__title">{h.plan.title}</p>
                  <p className="how-card__from">{h.plan.from}</p>
                </div>
                <dl className="how-fields">
                  {h.plan.rows.map((r) => (
                    <div key={r.k}>
                      <dt>{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                  <div className="how-total">
                    <dt>{h.plan.total}</dt>
                    <dd>
                      NPR <span className="how-redact" />
                    </dd>
                  </div>
                </dl>
                <span className="how-stamp">{h.plan.stamp}</span>
                <span className="how-clock">{v("contact.reply")}</span>
              </div>
              <span className="how-num">02</span>
              <h3 className="type-title-3">{h.steps[1]!.title}</h3>
              <p className="type-body text-ink-2">
                {h.steps[1]!.body} {v("contact.reply")}.
              </p>
            </li>

            {/* 03 · Running */}
            <li className="how-step" style={{ "--row": 2 } as React.CSSProperties}>
              <div className="how-card" aria-hidden="true">
                <p className="how-card__title">{h.running.title}</p>
                <div className="how-job">
                  <span className="how-job__dot" />
                  <span className="how-job__name">{h.running.job}</span>
                  <span className="how-job__state">{h.running.state}</span>
                </div>
                <div className="how-meter">
                  <span className="how-meter__label">{h.running.meter}</span>
                  <span className="how-meter__clock">
                    <span>00:</span>
                    <Wheel n={6} period={3600} />
                    <Wheel n={10} period={600} />
                    <span>:</span>
                    <Wheel n={6} period={60} />
                    <Wheel n={10} period={10} />
                  </span>
                </div>
                <div className="how-bars">
                  {[62, 48, 74, 55, 68, 80, 58, 71].map((hgt, i) => (
                    <span key={i} style={{ "--h": `${hgt}%`, "--i": i } as React.CSSProperties} />
                  ))}
                </div>
              </div>
              <span className="how-num">03</span>
              <h3 className="type-title-3">{h.steps[2]!.title}</h3>
              <p className="type-body text-ink-2">{h.steps[2]!.body}</p>
            </li>
          </ol>
          <div className="how-rail" aria-hidden="true">
            <span className="how-rail__fill" />
          </div>
        </ScrollSteps>
        <p className="type-caption text-ink-3">{h.caption}</p>
      </div>
    </section>
  );
}
