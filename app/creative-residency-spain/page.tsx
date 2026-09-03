import { OrganizerLanding } from "../components/OrganizerLanding";
import { organizerMetadata } from "../lib/organizer-content";

export const metadata = organizerMetadata("creative-residency-spain");

export default function CreativeResidencySpainPage() {
  return <OrganizerLanding slug="creative-residency-spain" />;
}
