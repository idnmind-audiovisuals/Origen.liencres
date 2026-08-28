import type { Metadata } from "next";
import { OpenedState } from "../components/OpenedState";
import {
  getLanguageParam,
  type LanguageSearchParams,
} from "../lib/language";
import { requireOrigenAccess } from "../lib/require-access";
import { getRequestLanguage } from "../lib/request-language";
import { PROTECTED_PAGE_ROBOTS } from "../lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const language = await getRequestLanguage(getLanguageParam(params.lang));
  return language === "es"
    ? {
        title: "Origen Residency — Retiro en Cantabria",
        description:
          "Una residencia de cinco días en Liencres, Cantabria, entre el océano, el bosque y Costa Quebrada.",
        robots: PROTECTED_PAGE_ROBOTS,
      }
    : {
        title: "Origen Residency — Retreat in Northern Spain",
        description:
          "A five-day residency in Liencres, Cantabria, between the Atlantic Ocean, coastal forest and Costa Quebrada.",
        robots: PROTECTED_PAGE_ROBOTS,
      };
}

export default async function ResidencyPage({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  await requireOrigenAccess("residency");
  const params = await searchParams;
  const initialLanguage = await getRequestLanguage(
    getLanguageParam(params.lang),
  );

  return (
    <OpenedState
      development={false}
      initialLanguage={initialLanguage}
      variant="residency"
    />
  );
}
