"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CINEMATIC_ENTRY_EASE } from "../lib/gateway-motion";

type HomeNavigationProps = {
  visible: boolean;
  reducedMotion?: boolean;
  className?: string;
};

export const HOME_LINKS = [
  { href: "/circulo-de-hombres-cantabria", label: "Círculo de hombres" },
  { href: "/circulo-de-mujeres-cantabria", label: "Círculo de mujeres" },
  { href: "/residencias", label: "Residencias" },
  { href: "/retiros", label: "Retiros" },
  { href: "/eventos-bienestar-cantabria", label: "Eventos" },
] as const;

export function HomeNavigation({
  visible,
  reducedMotion = false,
  className = "",
}: HomeNavigationProps) {
  return (
    <motion.nav
      className={`gateway-home-menu${className ? ` ${className}` : ""}`}
      aria-label="Explorar Origen"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{
        duration: reducedMotion ? 0.16 : 0.72,
        ease: CINEMATIC_ENTRY_EASE,
      }}
      inert={!visible ? true : undefined}
    >
      {HOME_LINKS.map((item, index) => (
        <Link href={item.href} key={item.href}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.label}</strong>
        </Link>
      ))}
    </motion.nav>
  );
}
