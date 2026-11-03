/**
 * "An AI assistant that's yours alone" (home, Private AI): a private
 * assistant at work inside the organisation's own workspace. A question is
 * picked from three samples; the answer cites the organisation's own
 * documents, which light up beside the window; an audit strip records what
 * happened; and the whole picture sits inside the workspace boundary.
 *
 * Zero JavaScript. The chips are native radios; every answer is server
 * markup, and CSS (:has, app/styles/home.css → .pa) shows the one picked.
 * Sample content, labelled as an illustration. One answer is in Nepali and
 * English (lang="ne" on the Nepali), drafted for a native-speaker check.
 */
import { GlassLight } from "@/components/system/glass-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";

function DocArt() {
  return (
    <svg viewBox="0 0 40 48" className="pa-doc__art" aria-hidden="true" focusable="false">
      <path d="M4 3 h22 l10 10 v32 h-32 z" className="pa-doc__page" />
      <path d="M26 3 v10 h10" className="pa-doc__fold" />
      {[18, 23, 28, 33, 38].map((y, i) => (
        <line key={y} x1="9" y1={y} x2={i === 4 ? 22 : 31} y2={y} className="pa-doc__line" />
      ))}
    </svg>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden="true" focusable="false">
      <path d="M5 7 V5 a3 3 0 0 1 6 0 V7" className="fill-none stroke-current" strokeWidth="1.4" />
      <rect x="3.5" y="7" width="9" height="7" rx="1.5" className="fill-none stroke-current" strokeWidth="1.4" />
    </svg>
  );
}

export function AssistantSection() {
  const a = HOME.assistant;
  return (
    <section aria-labelledby="assistant-title" className="section-y relative isolate">
      <GlassLight variant="c" quiet />
      <div className="pa container-page grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHead id="assistant-title" kicker={a.kicker} title={a.title} continuation={a.continuation} lead={a.lead} />
          <fieldset className="flex flex-col gap-3">
            <legend className="type-kicker mb-3 text-ink-3">{a.pick}</legend>
            <div className="flex flex-wrap gap-2">
              {a.questions.map((q, i) => (
                <label key={q.id} className="pa-chip">
                  <input type="radio" name="pa-q" id={`pa-${q.id}`} value={q.id} defaultChecked={i === 0} className="sr-only" />
                  {q.chip}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <TextLink href={a.link.href} arrow>
              {a.link.label}
            </TextLink>
          </div>
        </div>

        <figure className="flex flex-col gap-3">
          <div className="pa-space">
            <p className="pa-boundary">{a.boundary}</p>
            <div className="pa-body">
              <div className="pa-window">
                <div className="pa-window__bar">
                  <span aria-hidden="true" className="pa-window__dot" />
                  <span className="type-caption text-ink-2">{a.window}</span>
                </div>
                <div className="pa-window__thread" aria-live="polite">
                  {a.questions.map((q) => (
                    <div key={q.id} data-a={q.id} className="pa-thread">
                      <p className="pa-bubble pa-bubble--you">{q.ask}</p>
                      <div className="pa-bubble pa-bubble--ai">
                        {q.answer.map((line, i) => (
                          <p key={i} lang={line.lang} style={{ "--i": i } as React.CSSProperties}>
                            {line.text}
                            {line.cite.map((c) => (
                              <sup key={c} className="pa-cite" data-cite={c}>
                                <span className="sr-only">source </span>
                                {c}
                              </sup>
                            ))}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="pa-docs" aria-label="Sources in your workspace">
                {a.docs.map((d) => (
                  <li key={d.id} className="pa-doc" data-doc={d.id}>
                    <span className="pa-doc__num" aria-hidden="true">
                      {d.id}
                    </span>
                    <DocArt />
                    <span className="flex min-w-0 flex-col">
                      <span className="type-caption font-medium text-ink">{d.name}</span>
                      <span className="pa-doc__kind">{d.kind}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pa-foot">
              <p className="pa-lock">
                <Lock />
                {a.lock}
              </p>
              {a.questions.map((q) => (
                <ol key={q.id} data-a={q.id} className="pa-audit" aria-label="Audit log">
                  <li>{a.audit[0]}</li>
                  <li>
                    {a.audit[1]}: {q.read}
                  </li>
                  <li>{a.audit[2]}</li>
                </ol>
              ))}
            </div>
          </div>
          <figcaption className="type-caption text-ink-3">{a.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
