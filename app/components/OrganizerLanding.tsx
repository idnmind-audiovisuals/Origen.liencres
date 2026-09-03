import Link from "next/link";
import { organizerPages, type OrganizerSlug } from "../lib/organizer-content";
import { HOST_APPLICATION_URL, ORIGEN_AIRBNB_URL, ORIGEN_INSTAGRAM_URL, ORIGEN_MAPS_URL, PUBLIC_SITE_URL } from "../lib/public-retreat-content";
import { OrganizerLinks } from "./OrganizerLinks";
import { GatewayBrandLink } from "./GatewayBrandLink";

export function OrganizerLanding({ slug }: { slug: OrganizerSlug }) {
  const copy = organizerPages[slug];
  const spanish = copy.language === "es";
  const overview = spanish ? "/retiros-cantabria" : "/retreats-spain";
  const faq = spanish ? "/retiros-cantabria/preguntas-frecuentes" : "/retreats-spain/faq";
  const url = `${PUBLIC_SITE_URL}/${slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#page`, url,
        name: copy.title, description: copy.description, inLanguage: copy.language,
        isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
        about: { "@id": `${PUBLIC_SITE_URL}/#retreat-space` },
        mainEntity: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service", "@id": `${url}#service`, url,
        name: copy.serviceName, description: copy.description,
        serviceType: copy.serviceType,
        provider: { "@id": `${PUBLIC_SITE_URL}/#retreat-space` },
        areaServed: { "@type": "AdministrativeArea", name: "Cantabria, Spain" },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Origen Liencres", item: `${PUBLIC_SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: spanish ? "Retiros en Cantabria" : "Retreats in Northern Spain", item: `${PUBLIC_SITE_URL}${overview}` },
          { "@type": "ListItem", position: 3, name: copy.navLabel, item: url },
        ],
      },
    ],
  };

  return (
    <main className="retreat-public-page retreat-public-page--esencia organizer-page" lang={copy.language}>
      <header className="retreat-public-header">
        <GatewayBrandLink className="retreat-public-brand" label={spanish ? "Origen — volver a la entrada" : "Origen — return to the gateway"} />
        <nav aria-label={spanish ? "Navegación" : "Navigation"}>
          <Link href={overview}>{spanish ? "El espacio" : "The space"}</Link>
          <a className="organizer-header-cta" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            <span aria-hidden="true" />{spanish ? "Organizar" : "Host"}
          </a>
          {copy.alternate ? (
            <Link className="retreat-language-link" href={`/${copy.alternate}`} hrefLang={spanish ? "en" : "es"} lang={spanish ? "en" : "es"} aria-label={spanish ? "Read this page in English" : "Leer esta página en español"}>
              {spanish ? "EN" : "ES"}
            </Link>
          ) : null}
        </nav>
      </header>

      <section className="retreat-public-hero" aria-labelledby="organizer-title">
        <div className="retreat-public-hero-copy">
          <p className="retreat-public-eyebrow">{copy.eyebrow}</p>
          <h1 id="organizer-title">{copy.heading}</h1>
          <p className="retreat-public-lead">{copy.lead}</p>
        </div>
        <div className="retreat-public-hero-meta">
          <dl>{copy.facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
          <a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            {copy.cta}<span className="external-link-dot" aria-hidden="true" />
          </a>
          <a className="organizer-jump" href="#planning">{spanish ? "Qué preparar" : "What to prepare"}</a>
        </div>
      </section>

      <section className="retreat-public-intro scroll-reveal" aria-labelledby="organizer-intro">
        <div>
          <p className="retreat-public-eyebrow">Origen Liencres · Costa Quebrada</p>
          <h2 id="organizer-intro">{copy.introTitle}</h2>
        </div>
        <div className="retreat-public-prose">{copy.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="organizer-program" aria-labelledby="organizer-program-title">
        <div className="scroll-reveal">
          <p className="retreat-public-eyebrow">{copy.spaces.eyebrow}</p>
          <h2 id="organizer-program-title">{copy.spaces.title}</h2>
        </div>
        <ol className="scroll-reveal-list">
          {copy.spaces.items.map(([heading, body], index) => (
            <li key={heading}>
              <span className="organizer-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{heading}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="retreat-public-details" id="planning" aria-labelledby="organizer-planning-title">
        <div className="retreat-public-details-heading scroll-reveal">
          <p className="retreat-public-eyebrow">{copy.planning.eyebrow}</p>
          <h2 id="organizer-planning-title">{copy.planning.title}</h2>
        </div>
        <div className="retreat-public-details-grid scroll-reveal-list">
          {copy.planning.items.map(([heading, body], index) => (
            <article key={heading}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{heading}</h3><p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="organizer-questions" aria-labelledby="organizer-questions-title">
        <div className="scroll-reveal">
          <p className="retreat-public-eyebrow">{spanish ? "Antes de dar el paso" : "Before the next step"}</p>
          <h2 id="organizer-questions-title">{spanish ? "Preguntas prácticas." : "Practical questions."}</h2>
        </div>
        <div className="organizer-answers scroll-reveal-list">
          {copy.questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span className="external-link-dot" aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="retreat-public-host scroll-reveal" id="host" aria-labelledby="organizer-host-title">
        <div>
          <p className="retreat-public-eyebrow">{spanish ? "Hablemos de tu propuesta" : "Let’s talk about your idea"}</p>
          <h2 id="organizer-host-title">{copy.closingTitle}</h2>
        </div>
        <div>
          <p>{copy.closingBody}</p>
          <a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            {copy.cta}<span className="external-link-dot" aria-hidden="true" />
          </a>
          <p className="organizer-enquiry-note">{spanish ? "Consulta sin reserva automática. Fechas y condiciones por confirmar." : "An enquiry, not an automatic reservation. Dates and terms to be confirmed."}</p>
        </div>
      </section>

      <nav className="retreat-public-links scroll-reveal" aria-label={spanish ? "Información del espacio" : "Venue information"}>
        <a href={ORIGEN_MAPS_URL} target="_blank" rel="noreferrer">Google Maps</a>
        <a href={ORIGEN_AIRBNB_URL} target="_blank" rel="noreferrer">{spanish ? "Ver alojamiento" : "Accommodation"}</a>
        <Link href={faq}>{spanish ? "Preguntas frecuentes" : "Frequently asked questions"}</Link>
      </nav>
      <OrganizerLinks language={copy.language} current={slug} />

      <footer className="retreat-public-footer">
        <address>
          Origen Liencres<br />Barrio Liencres, 585<br />39120 Liencres, Cantabria<br />
          <a href="tel:+34622181691">+34 622 18 16 91</a>
        </address>
        <div>
          <p>{spanish ? "Retiros · Residencias · Grupos privados" : "Retreats · Residencies · Private groups"}</p>
          <a className="organizer-instagram" href={ORIGEN_INSTAGRAM_URL} target="_blank" rel="noreferrer"><span className="site-instagram-icon" aria-hidden="true" />Instagram</a>
          {!copy.alternate ? (
            <Link className="organizer-other-language" href={spanish ? "/retreats-spain" : "/retiros-cantabria"} lang={spanish ? "en" : "es"}>
              {spanish ? "Discover Origen in English" : "Conoce Origen en español"}
            </Link>
          ) : null}
        </div>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
