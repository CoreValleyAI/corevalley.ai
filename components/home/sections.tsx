/**
 * The home page's closing chapter: the first step of the climb, one route
 * per reason someone is here.
 */
import { AppLink } from "@/components/system/app-link";
import { Arrow } from "@/components/system/button";
import { DotGlyph, type GlyphName } from "@/components/system/dot-glyph";
import { SectionHead } from "@/components/system/section";
import { HOME } from "@/copy/en/home";
import { cn } from "@/lib/cn";

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
