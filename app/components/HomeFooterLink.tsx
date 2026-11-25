import Link from "next/link";

export function HomeFooterLink({ language = "es" }: { language?: "es" | "en" }) {
  return (
    <Link className="site-home-footer-link" href="/">
      {language === "en" ? "Back to home" : "Volver al inicio"}
    </Link>
  );
}
