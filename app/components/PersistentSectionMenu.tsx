"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HOME_LINKS } from "./HomeNavigation";

export function PersistentSectionMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (pathname === "/") return null;

  return (
    <aside className={`site-section-menu${open ? " is-open" : ""}`}>
      <nav id="site-section-menu-links" aria-label="Secciones de Origen">
        {HOME_LINKS.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="site-section-menu-links"
        onClick={() => setOpen((current) => !current)}
      >
        <i aria-hidden="true" />
      </button>
    </aside>
  );
}
