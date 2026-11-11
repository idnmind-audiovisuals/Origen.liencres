import type { Metadata } from "next";
import { ResidenciesHub } from "../components/ResidenciesHub";

export const metadata: Metadata = {
  title: "Organizar residencias en Cantabria | Origen Liencres",
  description: "Espacio privado para organizadores de residencias artísticas, coworking y emprendimiento en Liencres, Cantabria, para grupos de hasta 8 personas.",
  alternates: { canonical: "/residencias", languages: { "es-ES": "/residencias", en: "/residencies", "x-default": "/residencias" } },
  robots: { index: true, follow: true },
};

export default function ResidenciasPage() {
  return <ResidenciesHub language="es" />;
}
