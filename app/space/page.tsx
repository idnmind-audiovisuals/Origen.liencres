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
  const title =
    language === "es"
      ? "Espacio Origen — Liencres"
      : "Origen Space — Liencres";
  const description =
    language === "es"
      ? "Un espacio de retiro entre el océano, el bosque y la naturaleza viva de Liencres."
      : "A retreat space held by the ocean, forest and living landscape of Liencres.";

  return {
    title,
    description,
    robots: PROTECTED_PAGE_ROBOTS,
    openGraph: { title, description, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export const dynamic = "force-dynamic";

export default async function SpacePage({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  await requireOrigenAccess("space");
  const params = await searchParams;
  const initialLanguage = await getRequestLanguage(
    getLanguageParam(params.lang),
  );

  return (
    <OpenedState
      development={false}
      initialLanguage={initialLanguage}
      variant="space"
    />
  );
}
