/**
 * "Why here, and not a cloud abroad." (home, Why CoreValley): the plain
 * differences, side by side. No prices, no named competitor and no speed
 * claim about anyone else; our one figure carries its disclaimer
 * (docs/revamp/04 §2a, §4).
 *
 * A real table. On a phone each row stacks and every cell names its column,
 * so the roles are spelled out: a table whose rows are not laid out as rows
 * loses them in some browsers. Our column is tinted (app/styles/home.css,
 * .why-here).
 */
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";

const CELL = "type-body align-top max-md:block md:border-t md:border-line md:px-6 md:py-5";

export function WhySection() {
  const w = HOME.why;
  return (
    <section id="why" aria-labelledby="why-title" className="section-y scroll-mt-[var(--header-h)]">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHead id="why-title" kicker={w.kicker} title={w.title} continuation={w.continuation} lead={w.lead} />

        <div className="flex flex-col gap-6 md:gap-8">
          <table
            role="table"
            className="why w-full border-separate border-spacing-0 text-left max-md:block"
            data-reveal
          >
            <caption className="sr-only">{w.caption}</caption>
            <thead role="rowgroup" className="max-md:sr-only">
              <tr role="row">
                <th role="columnheader" scope="col" className="type-kicker w-[30%] py-4 pr-6 text-ink-3">
                  {w.columns.topic}
                </th>
                <th role="columnheader" scope="col" className="type-kicker w-[31%] px-6 py-4 text-ink-3">
                  {w.columns.abroad}
                </th>
                <th role="columnheader" scope="col" className="why-here type-kicker px-6 py-4 text-ink">
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="size-2 rounded-full bg-hydro" />
                    {w.columns.here}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" className="max-md:block">
              {w.rows.map((row) => (
                <tr
                  role="row"
                  key={row.topic}
                  className="max-md:grid max-md:gap-2.5 max-md:border-t max-md:border-line max-md:py-5"
                >
                  <th role="rowheader" scope="row" className={`${CELL} font-semibold text-ink md:pl-0`}>
                    {row.topic}
                  </th>
                  <td role="cell" className={`${CELL} text-ink-3`}>
                    <span aria-hidden="true" className="type-kicker mb-1 block md:hidden">
                      {w.columns.abroad}
                    </span>
                    {row.abroad}
                  </td>
                  <td role="cell" className={`${CELL} why-here text-ink max-md:rounded-chip max-md:px-4 max-md:py-3`}>
                    <span
                      aria-hidden="true"
                      className="type-kicker mb-1 flex items-center gap-2 text-hydro-ink md:hidden light:text-hydro"
                    >
                      <span className="size-1.5 rounded-full bg-hydro" />
                      {w.columns.here}
                    </span>
                    {row.here}
                    {row.note ? <span className="type-caption mt-1.5 block text-ink-2">{row.note}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-small text-ink-2">{w.quote}</p>
            <TextLink href={w.link.href} arrow className="type-small shrink-0">
              {w.link.label}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
