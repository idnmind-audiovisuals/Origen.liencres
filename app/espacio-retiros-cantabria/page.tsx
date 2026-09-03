import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("espacio-retiros-cantabria");

export default function EspacioRetirosCantabriaPage() {
  return <OrganizerLanding slug="espacio-retiros-cantabria" />;
}
