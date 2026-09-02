import Link from "next/link";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import { HOST_APPLICATION_URL, type RetreatLanguage } from "../lib/public-retreat-content";
import { retreatFaqCopy } from "../lib/retreat-faq";

export function PublicRetreatFaq({ language }: { language: RetreatLanguage }) {
  const copy = retreatFaqCopy[language];
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <main className="retreat-public-page retreat-faq-page" lang={language}>
      <header className="retreat-public-header">
        <Link className="retreat-public-brand" href="/" aria-label="Origen Liencres">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ORIGEN_WORDMARK_ASSET} width="1090" height="296" alt="Origen" />
        </Link>
        <nav aria-label={language === "es" ? "Navegación" : "Navigation"}>
          <Link href={copy.backHref}>{copy.backLabel}</Link>
          <Link className="retreat-language-link" href={copy.alternateHref}>
            {copy.alternateLabel}
          </Link>
        </nav>
      </header>

      <section className="retreat-faq-hero">
        <p className="retreat-public-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </section>

      <section className="retreat-faq-list scroll-reveal-list" aria-label={language === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}>
        {copy.questions.map(({ question, answer }, index) => (
          <article key={question}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{question}</h2>
              <p>{answer}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="retreat-public-host retreat-faq-host scroll-reveal">
        <div>
          <p className="retreat-public-eyebrow">{copy.hostEyebrow}</p>
          <h2>{copy.hostTitle}</h2>
        </div>
        <div>
          <p>{copy.hostBody}</p>
          <a className="retreat-public-primary retreat-public-primary--light" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            {copy.hostCta}
            <span className="external-link-dot" aria-hidden="true" />
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
