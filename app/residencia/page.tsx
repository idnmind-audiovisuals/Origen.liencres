import type { Metadata } from "next";
import { OpenedState } from "../components/OpenedState";
import {
  getLanguageParam,
  type LanguageSearchParams,
} from "../lib/language";
import { getRequestLanguage } from "../lib/request-language";

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
        alternates: { canonical: "/residencia?lang=es" },
      }
    : {
        title: "Origen Residency — Retreat in Northern Spain",
        description:
          "A five-day residency in Liencres, Cantabria, between the Atlantic Ocean, coastal forest and Costa Quebrada.",
        alternates: { canonical: "/residencia" },
      };
}

export default async function ResidencyPage({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
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
