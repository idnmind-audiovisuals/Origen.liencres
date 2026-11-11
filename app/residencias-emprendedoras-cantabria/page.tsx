import { ResidencyLanding } from "../components/ResidencyLanding";
import { getResidencyMetadata } from "../lib/residency-routes";

export const metadata = getResidencyMetadata("entrepreneur", "es");

export default function EntrepreneurResidenciesCantabriaPage() {
  return <ResidencyLanding focus="entrepreneur" language="es" />;
}
