import { ResidencyLanding } from "../components/ResidencyLanding";
import { getResidencyMetadata } from "../lib/residency-routes";

export const metadata = getResidencyMetadata("coworking", "en");

export default function CoworkingResidenciesCantabriaPage() {
  return <ResidencyLanding focus="coworking" language="en" />;
}
