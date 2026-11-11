import Link from "next/link";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";
import { HOST_APPLICATION_URL, PUBLIC_SITE_URL } from "../lib/public-retreat-content";
import { RESIDENCY_ROUTES } from "../lib/residency-routes";
import type { Language } from "../lib/language";

const HUB_ROUTES = { es: "/residencias", en: "/residencies" } as const;

const HUB_COPY = {
  es: {
    lang: "es",
    alternateLabel: "EN",
    eyebrow: "Para organizadores · Liencres, Cantabria",
    title: "Organiza una residencia en Origen.",
    lead: "Tú traes la comunidad, la intención y el programa. Origen ofrece una casa privada, una shala y el paisaje de Costa Quebrada para reunir a un grupo de hasta 8 personas.",
    facts: [["Grupo", "Hasta 8 personas alojadas"], ["Uso", "Un grupo privado"], ["Ubicación", "Liencres · cerca de Santander"]],
    formatsEyebrow: "Tres formatos",
    formatsTitle: "Elige la residencia que quieres organizar.",
    cards: {
      artistic: ["Residencias artísticas", "Para comisarios, facilitadores y líderes creativos que quieren reunir a un grupo alrededor de un proceso de creación."],
      coworking: ["Residencias coworking", "Para comunidades y equipos que buscan combinar trabajo profundo, convivencia, accountability y naturaleza."],
      entrepreneur: ["Residencias emprendedoras", "Para aceleradoras, mentores y comunidades que diseñan programas intensivos para fundadores y emprendedores."],
    },
    processEyebrow: "Cómo funciona",
    processTitle: "El espacio acompaña. El programa es tuyo.",
    process: [
      ["Comparte tu intención", "Cuéntanos para quién es la residencia, qué quieres facilitar y cómo imaginas el ritmo del grupo."],
      ["Propón fechas y formato", "Indica el número de noches, las personas alojadas y las necesidades de trabajo, práctica o materiales."],
      ["Confirma el encaje", "Revisamos contigo disponibilidad, espacios, distribución y condiciones antes de anunciar fechas a participantes."],
    ],
    ctaEyebrow: "Tu residencia en Origen",
    ctaTitle: "Hablemos de la propuesta que quieres liderar.",
    ctaBody: "Esta página no vende plazas a participantes. Está creada para quienes organizan y traen su propio grupo o comunidad.",
    cta: "Enviar propuesta",
    footer: "Residencias · Retiros · Eventos privados",
  },
  en: {
    lang: "en",
    alternateLabel: "ES",
    eyebrow: "For organisers · Liencres, Cantabria",
    title: "Host a residency at Origen.",
    lead: "You bring the community, intention and programme. Origen provides a private home, a shala and the Costa Quebrada landscape for a group of up to 8 people.",
    facts: [["Group", "Up to 8 overnight guests"], ["Use", "One private group"], ["Location", "Liencres · near Santander"]],
    formatsEyebrow: "Three formats",
    formatsTitle: "Choose the residency you want to organise.",
    cards: {
      artistic: ["Artist residencies", "For curators, facilitators and creative leaders bringing a group together around a creative process."],
      coworking: ["Coworking residencies", "For communities and teams combining deep work, shared living, accountability and nature."],
      entrepreneur: ["Entrepreneur residencies", "For accelerators, mentors and communities designing focused programmes for founders."],
    },
    processEyebrow: "How it works",
    processTitle: "The venue supports it. The programme is yours.",
    process: [
      ["Share your intention", "Tell us who the residency is for, what you facilitate and the rhythm you imagine for the group."],
      ["Propose dates and format", "Include nights, overnight guests and any work, practice or material requirements."],
      ["Confirm the fit", "We review availability, spaces, rooming and terms with you before dates are announced to participants."],
    ],
    ctaEyebrow: "Your residency at Origen",
    ctaTitle: "Let’s discuss the programme you want to lead.",
    ctaBody: "This page does not sell participant places. It is for organisers bringing their own group or community.",
    cta: "Send your proposal",
    footer: "Residencies · Retreats · Private events",
  },
} as const;

export function ResidenciesHub({ language }: { language: Language }) {
  const copy = HUB_COPY[language];
  const alternateLanguage = language === "es" ? "en" : "es";
  const url = `${PUBLIC_SITE_URL}${HUB_ROUTES[language]}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: copy.title,
        description: copy.lead,
        inLanguage: language === "es" ? "es-ES" : "en-GB",
        isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#residency-types` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#residency-types`,
        itemListElement: (["artistic", "coworking", "entrepreneur"] as const).map((focus, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${PUBLIC_SITE_URL}/${RESIDENCY_ROUTES[focus][language].slug}`,
          name: copy.cards[focus][0],
        })),
      },
    ],
  };

  return (
    <main className="retreat-public-page retreat-public-page--esencia organizer-page" lang={copy.lang}>
      <header className="retreat-public-header">
        <GatewayBrandLink className="retreat-public-brand" label="Origen" variant="black" />
        <nav aria-label={language === "es" ? "Navegación" : "Navigation"}>
          <Link href={HUB_ROUTES[alternateLanguage]} hrefLang={alternateLanguage} lang={alternateLanguage}>{copy.alternateLabel}</Link>
          <a className="organizer-header-cta" href="#propuesta">{copy.cta}</a>
        </nav>
      </header>

      <section className="retreat-public-hero" aria-labelledby="residencies-title">
        <div className="retreat-public-hero-copy">
          <p className="retreat-public-eyebrow">{copy.eyebrow}</p>
          <h1 id="residencies-title">{copy.title}</h1>
          <p className="retreat-public-lead">{copy.lead}</p>
        </div>
        <div className="retreat-public-hero-meta">
          <dl>{copy.facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
          <a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">{copy.cta}<span className="external-link-dot" aria-hidden="true" /></a>
        </div>
      </section>

      <section className="organizer-program" aria-labelledby="residency-formats-title">
        <div className="scroll-reveal">
          <p className="retreat-public-eyebrow">{copy.formatsEyebrow}</p>
          <h2 id="residency-formats-title">{copy.formatsTitle}</h2>
        </div>
        <ol className="scroll-reveal-list">
          {(["artistic", "coworking", "entrepreneur"] as const).map((focus, index) => (
            <li key={focus}>
              <span className="organizer-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3><Link href={`/${RESIDENCY_ROUTES[focus][language].slug}`}>{copy.cards[focus][0]}</Link></h3>
                <p>{copy.cards[focus][1]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="retreat-public-details" aria-labelledby="residency-process-title">
        <div className="retreat-public-details-heading scroll-reveal">
          <p className="retreat-public-eyebrow">{copy.processEyebrow}</p>
          <h2 id="residency-process-title">{copy.processTitle}</h2>
        </div>
        <div className="retreat-public-details-grid scroll-reveal-list">
          {copy.process.map(([heading, body], index) => <article key={heading}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{heading}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="retreat-public-host scroll-reveal" id="propuesta" aria-labelledby="residency-proposal-title">
        <div><p className="retreat-public-eyebrow">{copy.ctaEyebrow}</p><h2 id="residency-proposal-title">{copy.ctaTitle}</h2></div>
        <div><p>{copy.ctaBody}</p><a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">{copy.cta}<span className="external-link-dot" aria-hidden="true" /></a></div>
      </section>

      <footer className="retreat-public-footer"><p>Origen Liencres · Costa Quebrada</p><InstagramLink /><p>{copy.footer}</p></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
