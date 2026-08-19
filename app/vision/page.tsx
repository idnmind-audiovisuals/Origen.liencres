import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
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
}): Promise<Metadata> {
  const params = await searchParams;
  const language = await getRequestLanguage(getLanguageParam(params.lang));
  return language === "es"
    ? {
        title: "Visión — Origen",
        description: "La visión de Origen en Costa Quebrada, España.",
      }
    : {
        title: "Vision — Origen",
        description: "The vision behind Origen in Costa Quebrada, Spain.",
      };
}

export default async function VisionPage({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  await requireOrigenAccess("residency");
  const params = await searchParams;
  const initialLanguage = await getRequestLanguage(
    getLanguageParam(params.lang),
  );

  return <EditorialPage initialLanguage={initialLanguage} page="vision" />;
}
