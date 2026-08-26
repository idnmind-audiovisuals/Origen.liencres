const INSTAGRAM_URL = "https://www.instagram.com/origen.liencres/";

export function InstagramLink() {
  return (
    <a
      className="site-instagram-link"
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram — Origen Liencres (opens in a new tab)"
    >
      <span className="site-instagram-icon" aria-hidden="true" />
    </a>
  );
}
