/**
 * "Built on": NVIDIA's mark, centred and on its own, under the hero.
 *
 * Used with care (docs/revamp/04 §4): the official artwork, unaltered in
 * shape and colour, at a legible size with clear space all round, never
 * inside a sentence, never next to our own mark as if co-branded, and with
 * NVIDIA's trademark notice. Names identify the hardware; no partner
 * designation is claimed.
 */
import { NvidiaLogo } from "@/components/brand/partner-logos";
import { HOME } from "@/copy/en/home";

export function BuiltOn() {
  const b = HOME.builtOn;
  return (
    <section aria-label={`${b.label} NVIDIA`} className="border-y border-line bg-bg-sunken/50">
      <div className="container-page flex flex-col items-center gap-5 py-10 text-center md:py-12">
        <p className="type-kicker text-ink-3">{b.label}</p>
        <div className="px-6 py-2 text-ink" data-reveal>
          <NvidiaLogo className="h-7 md:h-8" />
        </div>
        <p className="type-caption text-ink-3">{b.notice}</p>
      </div>
    </section>
  );
}
