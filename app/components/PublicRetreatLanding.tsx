import Link from "next/link";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import {
  HOST_APPLICATION_URL,
  ORIGEN_AIRBNB_URL,
  ORIGEN_INSTAGRAM_URL,
  ORIGEN_MAPS_URL,
  retreatLandingCopy,
  type RetreatLanguage,
} from "../lib/public-retreat-content";

export function PublicRetreatLanding({
  language,
}: {
  language: RetreatLanguage;
}) {
  const copy = retreatLandingCopy[language];

  return (
    <main className="retreat-public-page" lang={copy.htmlLang}>
      <header className="retreat-public-header">
        <Link className="retreat-public-brand" href="/" aria-label="Origen Liencres">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ORIGEN_WORDMARK_ASSET} width="1090" height="296" alt="Origen" />
        </Link>
        <nav aria-label={language === "es" ? "Navegación" : "Navigation"}>
          <Link href={copy.faqHref}>{copy.faqLabel}</Link>
          <Link href={language === "en" ? "/host-your-retreat" : "/retiros-cantabria#host"}>
            {language === "en" ? "Host" : "Organizar"}
          </Link>
          <a href={ORIGEN_MAPS_URL} target="_blank" rel="noreferrer">Maps</a>
          <Link className="retreat-language-link" href={copy.alternateHref}>
            {copy.alternateLabel}
          </Link>
        </nav>
      </header>

      <section className="retreat-public-hero" aria-labelledby="retreat-public-title">
        <div className="retreat-public-hero-copy">
          <p className="retreat-public-eyebrow">{copy.eyebrow}</p>
          <h1 id="retreat-public-title">{copy.title}</h1>
          <p className="retreat-public-lead">{copy.lead}</p>
          <a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            {copy.cta}
            <span className="external-link-dot" aria-hidden="true" />
          </a>
        </div>

        <figure className="retreat-public-hero-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/experience-coast.webp"
            width="1536"
            height="1024"
            alt={
              language === "es"
                ? "Acantilados de Costa Quebrada junto al mar en Liencres, Cantabria"
                : "Costa Quebrada cliffs beside the sea in Liencres, Cantabria"
            }
          />
          <figcaption>{copy.landscapeCaption}</figcaption>
        </figure>
      </section>

      <section className="retreat-public-intro" aria-labelledby="retreat-intro-title">
        <div>
          <p className="retreat-public-eyebrow">{copy.introEyebrow}</p>
          <h2 id="retreat-intro-title">{copy.introTitle}</h2>
        </div>
        <div className="retreat-public-prose">
          {copy.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <dl className="retreat-public-facts">
        {copy.facts.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section className="retreat-public-features" aria-labelledby="retreat-features-title">
        <div className="retreat-public-feature-copy">
          <p className="retreat-public-eyebrow">{copy.featuresEyebrow}</p>
          <h2 id="retreat-features-title">{copy.featuresTitle}</h2>
          <ol>
            {copy.features.map((feature, index) => (
              <li key={feature}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {feature}
              </li>
            ))}
          </ol>
        </div>

        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/experience-forest.webp"
            width="1536"
            height="1024"
            loading="lazy"
            alt={
              language === "es"
                ? "Sendero entre el bosque costero de Liencres"
                : "A path through the coastal forest of Liencres"
            }
          />
        </figure>
      </section>

      <section className="retreat-public-details" aria-labelledby="retreat-details-title">
        <div className="retreat-public-details-heading">
          <p className="retreat-public-eyebrow">{copy.detailsEyebrow}</p>
          <h2 id="retreat-details-title">{copy.detailsTitle}</h2>
        </div>
        <div className="retreat-public-details-grid">
          {copy.detailSections.map(([heading, paragraph], index) => (
            <article key={heading}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{heading}</h3>
              <p>{paragraph}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="retreat-public-host" id="host" aria-labelledby="retreat-host-title">
        <div>
          <p className="retreat-public-eyebrow">{copy.hostEyebrow}</p>
          <h2 id="retreat-host-title">{copy.hostTitle}</h2>
        </div>
        <div>
          <p>{copy.hostBody}</p>
          <a className="retreat-public-primary retreat-public-primary--light" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            {copy.hostCta}
            <span className="external-link-dot" aria-hidden="true" />
          </a>
        </div>
      </section>

      <nav className="retreat-public-links" aria-label={language === "es" ? "Enlaces de Origen" : "Origen links"}>
        <a href={ORIGEN_MAPS_URL} target="_blank" rel="noreferrer">{copy.mapCta}</a>
        <a href={ORIGEN_AIRBNB_URL} target="_blank" rel="noreferrer">{copy.airbnbCta}</a>
        <Link href={copy.faqHref}>{copy.faqCta}</Link>
      </nav>

      <footer className="retreat-public-footer">
        <address>
          Origen Liencres<br />
          Barrio Liencres, 585<br />
          39120 Liencres, Cantabria<br />
          <a href="tel:+34622181691">+34 622 18 16 91</a>
        </address>
        <div>
          <p>{copy.footerLine}</p>
          <a href={ORIGEN_INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </main>
  );
}
