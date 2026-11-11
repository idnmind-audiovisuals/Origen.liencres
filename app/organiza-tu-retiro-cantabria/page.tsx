import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("organiza-tu-retiro-cantabria");

export default function OrganizaTuRetiroCantabriaPage() {
  return <OrganizerLanding slug="organiza-tu-retiro-cantabria" />;
}
