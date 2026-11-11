import { ResidencyLanding } from "../components/ResidencyLanding";
import { getResidencyMetadata } from "../lib/residency-routes";

export const metadata = getResidencyMetadata("artistic", "en");

export default function ArtistResidenciesCantabriaPage() {
  return <ResidencyLanding focus="artistic" language="en" />;
}
