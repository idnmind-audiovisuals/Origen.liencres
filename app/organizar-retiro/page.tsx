import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("organizar-retiro");

export default function OrganizarRetiroPage() {
  return <OrganizerLanding slug="organizar-retiro" />;
}
