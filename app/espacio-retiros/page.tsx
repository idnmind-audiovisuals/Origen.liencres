import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("espacio-retiros");

export default function EspacioRetirosPage() {
  return <OrganizerLanding slug="espacio-retiros" />;
}
