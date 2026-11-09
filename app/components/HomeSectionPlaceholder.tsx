import Link from "next/link";
import { ORIGEN_HEADER_WORDMARK_BLACK_ASSET } from "../lib/brand";

type HomeSectionPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function HomeSectionPlaceholder({
  eyebrow,
  title,
  description,
}: HomeSectionPlaceholderProps) {
  return (
    <main className="home-section-placeholder">
      <header>
        <Link href="/" aria-label="Volver a Origen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ORIGEN_HEADER_WORDMARK_BLACK_ASSET}
            width="2098"
            height="750"
            alt="Origen"
          />
        </Link>
        <p>Liencres · Costa Quebrada</p>
      </header>

      <section>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href="/">
          Volver a Origen
          <span aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
