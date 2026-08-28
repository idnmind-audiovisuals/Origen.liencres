import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
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
        title: "Historia — Origen",
        description: "La historia de Origen en Liencres, España.",
        robots: PROTECTED_PAGE_ROBOTS,
      }
    : {
        title: "Story — Origen",
        description: "The story behind Origen in Liencres, Spain.",
        robots: PROTECTED_PAGE_ROBOTS,
      };
}

export default async function StoryPage({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  const accessScope = await requireOrigenAccess(["residency", "space"]);
  const params = await searchParams;
  const initialLanguage = await getRequestLanguage(
    getLanguageParam(params.lang),
  );

  return (
    <EditorialPage
      initialLanguage={initialLanguage}
      origin={accessScope}
      page="story"
    />
  );
}
