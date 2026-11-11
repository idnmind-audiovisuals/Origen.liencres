import { ResidencyLanding } from "../components/ResidencyLanding";
import { getResidencyMetadata } from "../lib/residency-routes";

export const metadata = getResidencyMetadata("coworking", "es");

export default function CoworkingResidenciesCantabriaPage() {
  return <ResidencyLanding focus="coworking" language="es" />;
}
