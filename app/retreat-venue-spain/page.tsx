import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("retreat-venue-spain");

export default function RetreatVenueSpainPage() {
  return <OrganizerLanding slug="retreat-venue-spain" />;
}
