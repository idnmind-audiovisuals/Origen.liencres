import type { Metadata } from "next";
import { HostsCircleState } from "../components/HostsCircleState";
import { HOSTS_CIRCLE_COPY } from "../lib/hosts-circle";
import { getLanguageParam, type LanguageSearchParams } from "../lib/language";
import { getRequestLanguage } from "../lib/request-language";
import { requireOrigenAccess } from "../lib/require-access";
import { PROTECTED_PAGE_ROBOTS } from "../lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: LanguageSearchParams };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const language = await getRequestLanguage(getLanguageParam(params.lang));
  const { title, description } = HOSTS_CIRCLE_COPY[language];
  return {
    title,
    description,
    alternates: { canonical: "/retreat-organizers-circle", languages: {} },
    robots: PROTECTED_PAGE_ROBOTS,
    openGraph: {
      type: "website", title, description, siteName: "Origen",
      locale: language === "es" ? "es_ES" : "en_GB",
      images: [],
    },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function RetreatOrganizersCirclePage({ searchParams }: PageProps) {
  await requireOrigenAccess(["hosts-es", "hosts-en"]);
  const params = await searchParams;
  const initialLanguage = await getRequestLanguage(getLanguageParam(params.lang));
  return <HostsCircleState initialLanguage={initialLanguage} />;
}
