/**
 * "You bring the idea. We run everything else." (home, What we do): one
 * statement and the four things we run, on a single pane of liquid glass,
 * sized to sit in one screen. The glyphs light on hover; nothing else moves.
 */
import { SectionLight } from "@/components/gl/section-light";
import { DotGlyph } from "@/components/system/dot-glyph";
import { Kicker } from "@/components/system/kicker";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";
import { cn } from "@/lib/cn";

export function WhatSection() {
  const w = HOME.what;
  return (
    <section id="what" aria-labelledby="what-title" className="section-y relative isolate scroll-mt-[var(--header-h)]">
      <SectionLight />
      <div className="container-page flex flex-col items-center gap-12 text-center md:gap-16">
        <header className="flex flex-col items-center gap-5" data-glass-keepout>
          <Kicker>{w.kicker}</Kicker>
          <h2 id="what-title" className="type-title-1 max-w-[24ch] text-balance" data-reveal>
            {w.title}
            <br className="hidden md:block" /> <span className="text-ink-3">{w.continuation}</span>
          </h2>
          <p className="type-lead measure text-ink-2" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            {w.lead}
          </p>
        </header>

        <ul
          data-refract
          data-refract-bezel="22"
          data-glass-panel=""
          className="lg grid w-full max-w-[68rem] grid-cols-1 rounded-panel text-left sm:grid-cols-2 lg:grid-cols-4"
        >
          {w.items.map((it, i) => (
            <li
              key={it.title}
              className={cn(
                "group flex flex-col gap-5 p-6 md:p-8",
                i > 0 && "border-t border-ink/10",
                i === 1 && "sm:border-t-0 sm:border-l",
                i === 2 && "sm:border-l-0 lg:border-t-0 lg:border-l",
                i === 3 && "sm:border-l lg:border-t-0",
              )}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <DotGlyph name={it.glyph} className="size-10" />
              <span className="flex flex-col gap-1.5">
                <h3 className="type-title-3 text-ink">{it.title}</h3>
                <p className="type-small text-ink-2">{it.body}</p>
              </span>
            </li>
          ))}
        </ul>

        <TextLink href={w.link.href} arrow data-glass-keepout>
          {w.link.label}
        </TextLink>
      </div>
    </section>
  );
}
