import { ResidencyLanding } from "../components/ResidencyLanding";
import { getResidencyMetadata } from "../lib/residency-routes";

export const metadata = getResidencyMetadata("artistic", "es");

export default function ArtisticResidenciesCantabriaPage() {
  return <ResidencyLanding focus="artistic" language="es" />;
}
