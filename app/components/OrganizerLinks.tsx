import Link from "next/link";
import { organizerPages, organizerSlugs, type OrganizerSlug } from "../lib/organizer-content";
import type { RetreatLanguage } from "../lib/public-retreat-content";

export function OrganizerLinks({ language, current }: { language: RetreatLanguage; current?: OrganizerSlug }) {
  return (
    <nav className="organizer-links scroll-reveal" aria-label={language === "es" ? "Para organizadores" : "For organisers"}>
      <p className="retreat-public-eyebrow">{language === "es" ? "Para organizadores" : "For organisers"}</p>
      <div>
        {organizerSlugs.filter((slug) => organizerPages[slug].language === language).map((slug) => (
          <Link key={slug} href={`/${slug}`} aria-current={current === slug ? "page" : undefined}>
            {organizerPages[slug].navLabel}
            <span className="external-link-dot" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
