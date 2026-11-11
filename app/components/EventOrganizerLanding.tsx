import Link from "next/link";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";
import { HOST_APPLICATION_URL, PUBLIC_SITE_URL } from "../lib/public-retreat-content";
import type { Language } from "../lib/language";

const EVENT_ROUTES = {
  es: "/eventos-bienestar-cantabria",
  en: "/wellness-events-cantabria",
} as const;

const EVENT_COPY = {
  es: {
    eyebrow: "Para organizadores · Eventos privados",
    title: "Organiza tu evento de bienestar en Cantabria.",
    lead: "Origen es un espacio íntimo en Liencres para facilitadores, marcas y comunidades que quieren producir su propio encuentro con un grupo reducido.",
    facts: [["Formato", "Tu evento · tu programa"], ["Escala", "Grupos pequeños"], ["Entorno", "Costa Quebrada · Liencres"]],
    introEyebrow: "El espacio",
    introTitle: "Una casa para el encuentro que tú lideras.",
    intro: "No vendemos entradas para un programa cerrado. Trabajamos con quien organiza, facilita y reúne a su propia comunidad.",
    items: [
      ["Encuentros de bienestar", "Yoga, movimiento, embodiment, respiración o prácticas de presencia diseñadas y facilitadas por tu equipo."],
      ["Jornadas de comunidad", "Conversaciones, talleres y experiencias para grupos que necesitan intimidad y continuidad."],
      ["Presentaciones y experiencias de marca", "Formatos pequeños vinculados al bienestar, la creatividad y una relación cuidada con el entorno."],
    ],
    planningTitle: "Qué necesitamos saber.",
    planning: [
      ["La intención", "Objetivo del evento, perfil de asistentes y experiencia que quieres crear."],
      ["El formato", "Horarios, aforo, necesidades de sonido, materiales, comida y uso de espacios."],
      ["Las fechas", "Propón una fecha o periodo flexible para revisar disponibilidad y condiciones."],
    ],
    ctaTitle: "Cuéntanos el evento que quieres organizar.",
    ctaBody: "Envía una propuesta con intención, fechas, número de personas y necesidades prácticas.",
    cta: "Enviar propuesta",
  },
  en: {
    eyebrow: "For organisers · Private events",
    title: "Host your wellness event in Cantabria.",
    lead: "Origen is an intimate venue in Liencres for facilitators, brands and communities producing their own small-group gathering.",
    facts: [["Format", "Your event · your programme"], ["Scale", "Small groups"], ["Setting", "Costa Quebrada · Liencres"]],
    introEyebrow: "The venue",
    introTitle: "A home for the gathering you lead.",
    intro: "We are not selling tickets to a fixed programme. We work with the person organising, facilitating and bringing their own community.",
    items: [
      ["Wellness gatherings", "Yoga, movement, embodiment, breathwork or presence practices designed and led by your team."],
      ["Community days", "Conversations, workshops and experiences for groups that need intimacy and continuity."],
      ["Brand experiences", "Small formats connected to wellbeing, creativity and a considered relationship with the landscape."],
    ],
    planningTitle: "What we need to know.",
    planning: [
      ["The intention", "Your event goal, audience and the experience you want to create."],
      ["The format", "Schedule, capacity, sound, materials, food and how you need to use the spaces."],
      ["The dates", "Suggest a date or flexible period so availability and terms can be reviewed."],
    ],
    ctaTitle: "Tell us about the event you want to host.",
    ctaBody: "Send a proposal with your intention, dates, group size and practical requirements.",
    cta: "Send your proposal",
  },
} as const;

export function EventOrganizerLanding({ language }: { language: Language }) {
  const copy = EVENT_COPY[language];
  const alternate = language === "es" ? "en" : "es";
  const url = `${PUBLIC_SITE_URL}${EVENT_ROUTES[language]}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#page`, url, name: copy.title, description: copy.lead, inLanguage: language === "es" ? "es-ES" : "en-GB", isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` }, about: { "@id": `${url}#service` } },
      { "@type": "Service", "@id": `${url}#service`, url, name: copy.title, description: copy.lead, serviceType: language === "es" ? "Alquiler de espacio para eventos de bienestar" : "Wellness event venue hire", provider: { "@id": `${PUBLIC_SITE_URL}/#organization` }, areaServed: { "@type": "AdministrativeArea", name: "Cantabria" }, audience: { "@type": "Audience", audienceType: language === "es" ? "Organizadores, facilitadores y marcas" : "Organisers, facilitators and brands" } },
    ],
  };

  return (
    <main className="retreat-public-page retreat-public-page--esencia organizer-page" lang={language}>
      <header className="retreat-public-header">
        <GatewayBrandLink className="retreat-public-brand" label="Origen" variant="black" />
        <nav aria-label={language === "es" ? "Navegación" : "Navigation"}><Link href={EVENT_ROUTES[alternate]} hrefLang={alternate}>{alternate.toUpperCase()}</Link><a className="organizer-header-cta" href="#propuesta">{copy.cta}</a></nav>
      </header>
      <section className="retreat-public-hero" aria-labelledby="events-title">
        <div className="retreat-public-hero-copy"><p className="retreat-public-eyebrow">{copy.eyebrow}</p><h1 id="events-title">{copy.title}</h1><p className="retreat-public-lead">{copy.lead}</p></div>
        <div className="retreat-public-hero-meta"><dl>{copy.facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl><a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">{copy.cta}<span className="external-link-dot" aria-hidden="true" /></a></div>
      </section>
      <section className="retreat-public-intro scroll-reveal" aria-labelledby="events-intro-title"><div><p className="retreat-public-eyebrow">{copy.introEyebrow}</p><h2 id="events-intro-title">{copy.introTitle}</h2></div><div className="retreat-public-prose"><p>{copy.intro}</p></div></section>
      <section className="organizer-program" aria-label={copy.introTitle}><ol className="scroll-reveal-list">{copy.items.map(([heading, body], index) => <li key={heading}><span className="organizer-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{heading}</h3><p>{body}</p></div></li>)}</ol></section>
      <section className="retreat-public-details" aria-labelledby="events-planning-title"><div className="retreat-public-details-heading scroll-reveal"><h2 id="events-planning-title">{copy.planningTitle}</h2></div><div className="retreat-public-details-grid scroll-reveal-list">{copy.planning.map(([heading, body], index) => <article key={heading}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{heading}</h3><p>{body}</p></article>)}</div></section>
      <section className="retreat-public-host scroll-reveal" id="propuesta" aria-labelledby="events-proposal-title"><div><h2 id="events-proposal-title">{copy.ctaTitle}</h2></div><div><p>{copy.ctaBody}</p><a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">{copy.cta}<span className="external-link-dot" aria-hidden="true" /></a></div></section>
      <footer className="retreat-public-footer"><p>Origen Liencres · Costa Quebrada</p><InstagramLink /><p>{language === "es" ? "Para organizadores" : "For organisers"}</p></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
