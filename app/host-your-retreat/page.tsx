import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("host-your-retreat");

export default function HostYourRetreatPage() {
  return <OrganizerLanding slug="host-your-retreat" />;
}
