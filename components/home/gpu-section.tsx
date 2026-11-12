/**
 * "NVIDIA H200 NVL." (home, Hardware): the GPU we run, said the way a
 * datasheet says it — the drawing, three headline figures (CTO ruling,
 * 14 Oct 2026: headline figures only), the three ways to use it and what
 * comes next. Its state is "early access", never "available now"
 * (docs/revamp/04 §4). The detail lives on /hardware.
 */
import { GpuArt } from "@/components/hardware/visuals";
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { GlassLight } from "@/components/system/glass-light";
import { Kicker } from "@/components/system/kicker";
import { SpecList } from "@/components/system/spec-list";
import { TextLink } from "@/components/system/text-link";
import { HARDWARE } from "@/copy/en/hardware";
import { HOME } from "@/copy/en/home";
import { cn } from "@/lib/cn";

export function GpuSection() {
  const g = HOME.gpu;
  const r = HARDWARE.roadmap;
  const roadmap = [
    { ...r.now, state: "now" },
    { ...r.next, state: "next" },
    { ...r.later, state: "later" },
  ];
  return (
    <section id="gpu" aria-labelledby="gpu-title" className="section-y relative isolate scroll-mt-[var(--header-h)]">
      <GlassLight variant="b" quiet />
      <div className="container-page flex flex-col gap-14 md:gap-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-x-16">
          <header className="flex flex-col gap-5 lg:col-start-2 lg:self-end">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Kicker>{g.kicker}</Kicker>
              <Kicker dot="soon" className="rounded-pill bg-hydro-wash px-2.5 py-1 text-hydro-ink light:text-hydro">
                {g.status}
              </Kicker>
            </div>
            <h2 id="gpu-title" className="type-title-1" data-reveal>
              {g.title}
            </h2>
            <p className="type-lead measure text-ink-2" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              {g.lead}
            </p>
          </header>

          {/* The drawing names itself (its own title block), so it needs no caption. */}
          <div
            data-refract
            data-refract-bezel="22"
            className="lg rounded-panel p-3 md:p-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center"
            data-reveal
          >
            <GpuArt />
          </div>

          <div className="flex flex-col gap-8 lg:col-start-2 lg:self-start">
            <SpecList rows={[...g.specs, g.slices]} />
            <div>
              <TextLink href={g.link.href} arrow>
                {g.link.label}
              </TextLink>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <h3 className="type-kicker text-ink-3">{g.waysTitle}</h3>
            <ul>
              {g.ways.map((w) => (
                <li key={w.product} className="border-t border-line last:border-b">
                  <AppLink
                    href={`/products/${w.product}`}
                    className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline"
                  >
                    <span className="type-body font-semibold text-ink">{w.title}</span>
                    <span className="type-body text-ink-2 max-sm:row-start-2">{w.body}</span>
                    <Arrow className="self-center text-ink-4 transition-[color,transform] duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-0.5 group-hover:text-ink max-sm:row-span-2" />
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="type-kicker text-ink-3">{g.roadmapTitle}</h3>
            <ol>
              {roadmap.map((step) => (
                <li
                  key={step.label}
                  className="grid gap-x-6 gap-y-1 border-t border-line py-4 last:border-b sm:grid-cols-[6rem_1fr] sm:items-baseline"
                >
                  <span className="type-kicker flex items-center gap-3 text-ink-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        step.state === "now" && "bg-hydro shadow-[0_0_0_4px_var(--hydro-wash)]",
                        step.state === "next" && "border-[1.5px] border-hydro",
                        step.state === "later" && "border-[1.5px] border-dashed border-line-strong",
                      )}
                    />
                    {step.label}
                  </span>
                  <span className="type-body text-ink-2">
                    <span className="font-semibold text-ink">{step.title}.</span> {step.body.replace(/\.$/, "")}.
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
