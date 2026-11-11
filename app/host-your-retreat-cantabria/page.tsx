import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("host-your-retreat-cantabria");

export default function HostYourRetreatCantabriaPage() {
  return <OrganizerLanding slug="host-your-retreat-cantabria" />;
}
