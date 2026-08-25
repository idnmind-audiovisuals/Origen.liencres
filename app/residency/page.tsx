import { OpenedState } from "../components/OpenedState";
import {
  getLanguageParam,
  type LanguageSearchParams,
} from "../lib/language";
import { requireOrigenAccess } from "../lib/require-access";
import { getRequestLanguage } from "../lib/request-language";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  const params = await searchParams;
  const language = await getRequestLanguage(getLanguageParam(params.lang));
  return language === "es"
    ? {
        title: "Residencia Origen — Liencres",
        description: "Cinco días en Liencres, España. 9–14 de septiembre.",
      }
    : {
        title: "Origen Residency — Liencres",
        description: "Five days in Liencres, Spain. 9–14 September.",
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
