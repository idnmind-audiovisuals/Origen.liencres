import type { Metadata } from "next";
import Link from "next/link";
import { GatewayBrandLink } from "../../components/GatewayBrandLink";
import { RetreatPlanner } from "../../components/RetreatPlanner";

export const metadata: Metadata = {
  title: "Planificador gratuito de retiros | Origen Liencres",
  description: "Una guía por preguntas para facilitadores: diseña el programa, crea comunidad, encuentra participantes y prepara la logística de tu retiro.",
  alternates: { canonical: "/organiza-tu-retiro-cantabria/planificador" },
};

export default function RetreatPlannerPage() {
  return (
    <main className="retreat-public-page retreat-planner-page" lang="es">
      <header className="retreat-public-header">
        <GatewayBrandLink className="retreat-public-brand" label="Origen Liencres" variant="black" />
        <nav aria-label="Navegación del planificador">
          <Link href="/organiza-tu-retiro-cantabria">Volver a Organiza tu retiro</Link>
        </nav>
      </header>
      <div className="retreat-planner-layout">
        <section className="retreat-planner-intro" aria-labelledby="retreat-planner-title">
          <p className="retreat-public-eyebrow">Origen · Para facilitadores</p>
          <h1 id="retreat-planner-title">Planificador gratuito</h1>
          <p>Tu idea, seis pasos y un plan para hacerla realidad.</p>
        </section>
        <RetreatPlanner />
      </div>
    </main>
  );
}
