/**
 * "An AI assistant that's yours alone" (home, Private AI): a private
 * assistant at work, on one pane of liquid glass — a question, its answer
 * from the organisation's own documents with the source named, and the
 * sample questions as suggestions inside the same window, the way a chat
 * app offers them, so what can be pressed is plain.
 *
 * Zero JavaScript: the suggestions are native radios, every answer is
 * server markup, and CSS (:has, app/styles/home.css → .pa) shows the one
 * picked. Sample content, labelled as an illustration. One answer is in
 * Nepali and English (lang="ne" on the Nepali), drafted for a native-speaker
 * check.
 */
import { SectionLight } from "@/components/gl/section-light";
import { SectionHead } from "@/components/system/section";
import { TextLink } from "@/components/system/text-link";
import { HOME } from "@/copy/en/home";

export function AssistantSection() {
  const a = HOME.assistant;
  return (
    <section aria-labelledby="assistant-title" className="section-y relative isolate">
      <SectionLight />
      <div className="pa container-page grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHead id="assistant-title" kicker={a.kicker} title={a.title} continuation={a.continuation} lead={a.lead} />
          <div>
            <TextLink href={a.link.href} arrow>
              {a.link.label}
            </TextLink>
          </div>
        </div>

        <figure className="flex flex-col gap-4">
          <div data-refract data-refract-bezel="24" data-glass-panel="" className="lg pa-window rounded-panel">
            <div className="pa-bar">
              <span className="type-body font-semibold text-ink">{a.window}</span>
              <span className="type-caption text-ink-3">{a.private}</span>
            </div>

            <div className="pa-thread-wrap" aria-live="polite">
              {a.questions.map((q) => (
                <div key={q.id} data-a={q.id} className="pa-thread">
                  <p className="pa-you">{q.ask}</p>
                  <div className="pa-ai">
                    {q.answer.map((line, i) => (
                      <p key={i} lang={line.lang} style={{ "--i": i } as React.CSSProperties}>
                        {line.text}
                      </p>
                    ))}
                    <p className="pa-source" style={{ "--i": q.answer.length } as React.CSSProperties}>
                      {a.source}: {q.read}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pa-suggest">
              <fieldset>
                <legend className="type-caption mb-2.5 text-ink-3">{a.pick}</legend>
                <div className="flex flex-wrap gap-2">
                  {a.questions.map((q, i) => (
                    <label key={q.id} className="pa-chip">
                      <input type="radio" name="pa-q" id={`pa-${q.id}`} value={q.id} defaultChecked={i === 0} className="sr-only" />
                      {q.chip}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          <figcaption className="type-caption text-ink-3">{a.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
