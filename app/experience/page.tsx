import type { Metadata } from "next";
import { ExperienceState } from "../components/ExperienceState";
import { requireOrigenAccess } from "../lib/require-access";

const title = "Origen — The Experience";
const description =
  "A cinematic journey through ocean, rock, horizon and forest in Liencres, Cantabria.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Origen",
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [],
  },
};

export default async function ExperiencePage() {
  await requireOrigenAccess("experience");

  return <ExperienceState development={false} />;
}
