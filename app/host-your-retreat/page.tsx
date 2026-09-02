import type { Metadata } from "next";
import Link from "next/link";
import { ORIGEN_WORDMARK_ASSET } from "../lib/brand";
import {
  HOST_APPLICATION_URL,
  ORIGEN_MAPS_URL,
  PUBLIC_SITE_URL,
} from "../lib/public-retreat-content";

const title = "Host your retreat in Cantabria | Origen Liencres";
const description =
  "Host a private retreat for up to 8 guests near Santander, the Atlantic Ocean and Costa Quebrada in Northern Spain.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/host-your-retreat" },
  openGraph: {
    type: "website",
    url: "/host-your-retreat",
    title,
    description,
    locale: "en_GB",
    images: ["/experience-coast.webp"],
  },
};

const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Private retreat venue hire at Origen Liencres",
  description,
  url: `${PUBLIC_SITE_URL}/host-your-retreat`,
  provider: { "@id": `${PUBLIC_SITE_URL}/#retreat-space` },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Cantabria" },
    { "@type": "Country", name: "Spain" },
  ],
  serviceType: "Private retreat venue hire",
};

export default function HostYourRetreatPage() {
  return (
    <main className="retreat-public-page retreat-faq-page" lang="en">
      <header className="retreat-public-header">
        <Link className="retreat-public-brand" href="/" aria-label="Origen Liencres">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ORIGEN_WORDMARK_ASSET} width="1090" height="296" alt="Origen" />
        </Link>
        <nav aria-label="Navigation">
          <Link href="/retreats-spain">Retreat venue</Link>
          <Link href="/retreats-spain/faq">Questions</Link>
          <Link className="retreat-language-link" href="/retiros-cantabria#host">ES</Link>
        </nav>
      </header>

      <section className="retreat-faq-hero retreat-host-hero">
        <p className="retreat-public-eyebrow">Small groups · Northern Spain</p>
        <h1>Host your retreat in Cantabria.</h1>
        <p>
          Origen Liencres is available for private retreats, creative residencies
          and embodiment gatherings of up to 8 guests, close to Santander and the sea.
        </p>
        <a className="retreat-public-primary" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
          Check dates and send your proposal
          <span className="external-link-dot" aria-hidden="true" />
        </a>
      </section>

      <dl className="retreat-public-facts retreat-host-facts scroll-reveal-list">
        <div><dt>Group size</dt><dd>Up to 8 guests</dd></div>
        <div><dt>Journey</dt><dd>25 min from Santander Airport</dd></div>
        <div><dt>Landscape</dt><dd>Ocean, forest and Costa Quebrada</dd></div>
      </dl>

      <section className="retreat-faq-list retreat-host-steps scroll-reveal-list" aria-labelledby="host-process-title">
        <div className="retreat-host-process-heading">
          <p className="retreat-public-eyebrow">The process</p>
          <h2 id="host-process-title">From your idea to the gathering.</h2>
        </div>
        {[
          ["Share your intention", "Tell us the format, purpose and atmosphere of the retreat you want to host."],
          ["Choose possible dates", "Send your preferred dates, length of stay and approximate participant numbers."],
          ["Review the fit", "We will confirm availability and explore whether the house and setting meet your group’s needs."],
        ].map(([heading, body], index) => (
          <article key={heading}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{heading}</h2><p>{body}</p></div>
          </article>
        ))}
      </section>

      <section className="retreat-public-host retreat-faq-host scroll-reveal">
        <div>
          <p className="retreat-public-eyebrow">Origen Liencres</p>
          <h2>A private place for work that matters.</h2>
        </div>
        <div>
          <p>
            Accommodation, shared living spaces and a spacious practice room in
            a landscape shaped by the Atlantic coast.
          </p>
          <a className="retreat-public-primary retreat-public-primary--light" href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            Send your proposal
            <span className="external-link-dot" aria-hidden="true" />
          </a>
          <a className="retreat-host-map" href={ORIGEN_MAPS_URL} target="_blank" rel="noreferrer">View the location in Google Maps</a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
