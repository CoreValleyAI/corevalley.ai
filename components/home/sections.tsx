/**
 * Home chapters, in plain words: what we do, how it works, why local, the
 * ways to start and the first step of the climb. Each hands off to the page
 * that owns the subject.
 */
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { DotGlyph, type GlyphName } from "@/components/system/dot-glyph";
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { cn } from "@/lib/cn";

export function ProductsSection() {
  const p = HOME.products;
  return (
    <section aria-labelledby="products-title" className="section-y relative isolate">
      <GlassLight variant="c" />
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            id="products-title"
            kicker={p.kicker}
            title={p.title}
            continuation={p.continuation}
            lead={p.lead}
          />
          <TextLink href={p.link.href} arrow className="shrink-0">
            {p.link.label}
          </TextLink>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
          {p.routes.map((r, i) => (
            <li key={r.href} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <AppLink
                href={r.href}
                data-refract
                data-refract-bezel="18"
                className="lg lg-card group flex h-full flex-col gap-10 rounded-panel p-6 md:p-7"
              >
                <DotGlyph name={r.glyph} className="size-11" />
                <span className="mt-auto flex flex-col gap-2">
                  <span className="type-title-3 flex items-center justify-between gap-3 text-ink">
                    {r.title}
                    <Arrow className="group-btn text-ink-3 transition-transform duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-1 group-hover:text-ink" />
                  </span>
                  <span className="type-small text-ink-2">{r.body}</span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhatSection() {
  const w = HOME.what;
  return (
    <section aria-labelledby="what-title" className="section-y">
      <div className="container-page flex flex-col gap-14">
        <SectionHead id="what-title" kicker={w.kicker} title={w.title} continuation={w.continuation} lead={w.lead} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {w.items.map((it, i) => (
            <li
              key={it.title}
              className="flex flex-col gap-8 rounded-panel border border-line bg-bg-raised p-6 md:p-7"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <DotGlyph name={it.glyph} className="size-10" />
              <span className="mt-auto flex flex-col gap-2">
                <h3 className="type-title-3 text-ink">{it.title}</h3>
                <p className="type-small text-ink-2">{it.body}</p>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowSection() {
  const h = HOME.how;
  return (
    <section id="how" aria-labelledby="how-title" className="section-y scroll-mt-[var(--header-h)]">
      <div className="container-page">
        <SectionHead id="how-title" kicker={h.kicker} title={h.title} continuation={h.continuation} />
        <ol className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {h.steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 border-t border-line pt-6"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="type-kicker text-hydro-ink light:text-hydro">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="type-title-3">{step.title}</h3>
              <p className="type-body text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhySection() {
  const w = HOME.why;
  return (
    <section aria-labelledby="why-title" className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
        <SectionHead id="why-title" kicker={w.kicker} title={w.title} continuation={w.continuation} />
        <ul className="flex flex-col">
          {w.items.map((it, i) => (
            <li
              key={it.title}
              className="grid gap-2 border-t border-line py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <h3 className="type-title-3">{it.title}</h3>
              <p className="type-body text-ink-2">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const ROUTES: { href: string; title: string; body: string; glyph: GlyphName; primary?: boolean }[] = [
  {
    href: "/contact?intent=workloads",
    title: "Use AI in your organisation",
    body: "Ready-made AI, a workspace to build in, or engineers to help.",
    glyph: "hardware",
    primary: true,
  },
  {
    href: "/contact?intent=partner",
    title: "Partner with us",
    body: "Resellers, integrators, universities.",
    glyph: "company",
  },
  { href: "/contact?intent=press", title: "Press", body: "Interviews and information.", glyph: "blog" },
  { href: "/jobs", title: "Careers", body: "Build Nepal's AI infrastructure.", glyph: "careers" },
  { href: "/contact?intent=support", title: "Support", body: "Help with an existing request.", glyph: "services" },
];

export function Climb() {
  const c = HOME.climb;
  return (
    <section aria-labelledby="climb-title" className="section-y">
      <div className="container-page">
        <SectionHead id="climb-title" kicker={c.kicker} title={c.title} lead={c.lead} align="center" />
        <ul className="mx-auto mt-12 grid max-w-[64rem] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTES.map((r, i) => (
            <li
              key={r.href}
              className={cn(r.primary && "sm:col-span-2 lg:col-span-1 lg:row-span-2")}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <AppLink
                href={r.href}
                className={cn(
                  "group flex h-full items-start gap-4 rounded-panel border p-5 transition-[border-color,background-color,transform] duration-[var(--dur-spring-smooth)] ease-spring hover:-translate-y-0.5 md:p-6",
                  r.primary
                    ? "border-hydro bg-hydro-wash lg:flex-col lg:justify-between lg:p-8"
                    : "border-line bg-bg-raised hover:border-line-strong",
                )}
              >
                <DotGlyph name={r.glyph} className={cn("size-9", r.primary && "lg:size-14")} on={r.primary} />
                <span className="flex flex-1 flex-col gap-1">
                  <span className={cn("type-title-3 flex items-center gap-2 text-ink", r.primary && "lg:type-title-2")}>
                    {r.title}
                    <Arrow className="text-ink-3 transition-transform duration-[var(--dur-spring-snappy)] ease-spring group-hover:translate-x-1 group-hover:text-ink" />
                  </span>
                  <span className="type-small text-ink-2">{r.body}</span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
