import type { Metadata } from "next";
import Link from "next/link";
import { GatewayBrandLink } from "../components/GatewayBrandLink";
import { InstagramLink } from "../components/InstagramLink";
import { ORIGEN_INSTAGRAM_URL, PUBLIC_SITE_URL } from "../lib/public-retreat-content";
import { HOSTS_CIRCLE_AGREEMENTS, HOSTS_CIRCLE_FLOW, HOSTS_CIRCLE_SCHEDULE } from "../lib/hosts-circle";

const title = "Retreat Organisers Circle — Origen Hosts";
const description = "A monthly online circle for retreat venue organisers to share challenges, celebrate successes and support one another. First Tuesday of every month, 5pm mainland Spain time.";
const url = `${PUBLIC_SITE_URL}/retreat-organizers-circle`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${url}#page`, url, name: title, description, inLanguage: "en",
  isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
  publisher: { "@id": `${PUBLIC_SITE_URL}/#organization` },
  audience: { "@type": "Audience", audienceType: "Retreat venue owners and organisers" },
};

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: url, languages: {} },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url, title, description, siteName: "Origen Liencres", locale: "en_GB",
    images: [{ url: `${PUBLIC_SITE_URL}/og.png`, width: 1536, height: 1024, alt: "Origen Liencres" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${PUBLIC_SITE_URL}/og.png`] },
};

export default function RetreatOrganizersCirclePage() {
  return (
    <main className="bros-page hosts-circle-page" lang="en" id="hosts-top">
      <div className="invitation-texture bros-texture" aria-hidden="true" />
      <div className="bros-content">
        <header className="bros-header">
          <GatewayBrandLink className="bros-brand" label="Origen — return to the gateway" />
          <p>Retreat organisers · Online</p>
        </header>

        <section className="bros-hero" aria-labelledby="hosts-title">
          <div className="bros-hero-title">
            <p>Connection · Support · Service</p>
            <h1 id="hosts-title"><span>Origen</span><span>Hosts</span></h1>
          </div>
          <div className="bros-hero-aside">
            <p>A circle for the people who bring others together.</p>
            <p className="bros-place">{HOSTS_CIRCLE_SCHEDULE.cadence}<br /><time dateTime={HOSTS_CIRCLE_SCHEDULE.time}>5pm</time> · Mainland Spain time</p>
            <a className="bros-primary-action" href="#join">Join the circle<span className="external-link-dot" aria-hidden="true" /></a>
          </div>
        </section>

        <section className="bros-manifesto scroll-reveal" aria-labelledby="hosts-manifesto">
          <h2 id="hosts-manifesto">Who holds space for you?</h2>
          <div className="bros-manifesto-copy">
            <p>Bring what is working.</p>
            <p>Bring what is difficult.</p>
            <p className="bros-manifesto-turn">You don’t have to hold it all alone.</p>
            <p className="hosts-manifesto-body">Running a retreat space can be deeply meaningful — and demanding. Behind each gathering are decisions, responsibilities and questions that are easier to carry with people who understand.</p>
            <p className="hosts-manifesto-body">Origen Hosts is a monthly online meeting for retreat venue owners and organisers to exchange honestly, celebrate successes and support one another. A place to reconnect with why we do this work, and how we can create a more positive impact together.</p>
          </div>
        </section>

        <section className="hosts-meeting scroll-reveal" aria-labelledby="hosts-meeting-title">
          <div className="bros-section-heading">
            <p>A regular place to return to</p>
            <h2 id="hosts-meeting-title">Once a month.<br />Together.</h2>
          </div>
          <div>
            <dl className="hosts-meeting-facts">
              <div><dt>When</dt><dd>{HOSTS_CIRCLE_SCHEDULE.cadence}</dd></div>
              <div><dt>Time</dt><dd><time dateTime={HOSTS_CIRCLE_SCHEDULE.time}>5pm / 17:00</time><span>Mainland Spain · {HOSTS_CIRCLE_SCHEDULE.timeZone}</span></dd></div>
              <div><dt>Where</dt><dd>Online<span>Joining details on request</span></dd></div>
            </dl>
            <p className="hosts-time-note">The meeting stays at 5pm in mainland Spain throughout the year, following the local daylight-saving changes. If you are joining from elsewhere, check the time difference for that date.</p>
          </div>
        </section>

        <section className="bros-circle" id="monthly-circle" aria-labelledby="hosts-flow-title">
          <div className="bros-section-heading scroll-reveal">
            <p>A suggested {HOSTS_CIRCLE_SCHEDULE.durationMinutes}-minute structure</p>
            <h2 id="hosts-flow-title">The monthly circle</h2>
          </div>
          <div className="bros-circle-content">
            <p className="bros-circle-schedule scroll-reveal">A familiar rhythm, with room for what is alive in the group. Time to listen, learn, ask and offer.</p>
            <ol className="bros-practices scroll-reveal-list">
              {HOSTS_CIRCLE_FLOW.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="hosts-step-duration">{step.minutes} minutes</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <p className="hosts-step-prompt">{step.prompt}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bros-intentions" aria-labelledby="hosts-for-title">
          <div className="bros-section-heading scroll-reveal">
            <p>For the people behind the spaces</p>
            <h2 id="hosts-for-title">A place to be supported.</h2>
          </div>
          <ol className="scroll-reveal-list">
            {[
              "For venue owners and organisers who want meaningful connection with peers.",
              "For sharing the difficult parts as openly as the successful ones.",
              "For learning from experience, without pretending to have everything figured out.",
              "For supporting healthier ways to work, welcome guests and care for our teams.",
              "For giving something back, and serving our communities with greater intention.",
            ].map((intention, index) => (
              <li key={intention}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{intention}</p></li>
            ))}
          </ol>
        </section>

        <section className="bros-agreements" aria-labelledby="hosts-agreements-title">
          <div className="bros-section-heading scroll-reveal">
            <p>How we hold the space</p>
            <h2 id="hosts-agreements-title">Our agreements</h2>
          </div>
          <dl className="scroll-reveal-list">
            {HOSTS_CIRCLE_AGREEMENTS.map(([heading, body], index) => (
              <div key={heading}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <dt>{heading}</dt><dd>{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="hosts-prepare" aria-labelledby="hosts-prepare-title">
          <div className="bros-section-heading scroll-reveal">
            <p>No presentation needed</p>
            <h2 id="hosts-prepare-title">Bring three things.</h2>
          </div>
          <ol className="scroll-reveal-list">
            <li><span>01</span><h3>One win.</h3><p>Something worth celebrating or a lesson worth passing on.</p></li>
            <li><span>02</span><h3>One challenge.</h3><p>A question you don’t need to hold on your own.</p></li>
            <li><span>03</span><h3>One offer.</h3><p>Some experience, encouragement or support you can give.</p></li>
          </ol>
        </section>

        <section className="bros-needs scroll-reveal" id="join" aria-labelledby="hosts-join-title">
          <p>Come as you are</p>
          <div>
            <h2 id="hosts-join-title">Let’s hold space for each other.</h2>
            <p>You don’t need a perfect venue, a polished story or all the answers. Come with a willingness to be honest, listen and contribute.</p>
            <p>To enquire about the circle, message @origen.liencres with your name, your venue or project, and what you hope to receive or offer.</p>
            <a className="hosts-join-link" href={ORIGEN_INSTAGRAM_URL} target="_blank" rel="noreferrer">Ask to join on Instagram<span className="external-link-dot" aria-hidden="true" /></a>
            <p className="hosts-join-note">Ask for the meeting link and participation details. Opening Instagram does not register you for the circle.</p>
          </div>
        </section>
        <footer className="bros-footer hosts-footer">
          <p>Origen Hosts · Connection · Support · Service</p>
          <Link href="/retreat-venue-spain">Discover the Origen venue<span className="external-link-dot" aria-hidden="true" /></Link>
        </footer>
        <InstagramLink />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
