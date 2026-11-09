import type { Metadata } from "next";
import { WomensCircleState } from "../components/WomensCircleState";

export const metadata: Metadata = {
  title: "Círculo de mujeres — Origen Liencres",
  description:
    "Círculo semanal de mujeres en Origen Liencres: presencia, escucha y cuidado cada martes de 18:00 a 20:00.",
  alternates: { canonical: "/circulo-de-mujeres" },
};

export default function WomensCirclePage() {
  return <WomensCircleState />;
}
