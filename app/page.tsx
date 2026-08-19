import { AccessGateway } from "./components/AccessGateway";
import { redirect } from "next/navigation";
import { ACCESS_DESTINATION_BY_SCOPE } from "./lib/access-types";
import {
  getLanguageParam,
  type LanguageSearchParams,
} from "./lib/language";
import { getRequestLanguage } from "./lib/request-language";
import { getOrigenAccessScope } from "./lib/require-access";

export default async function Home({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  const params = await searchParams;
  const accessScope = await getOrigenAccessScope();
  if (accessScope) redirect(ACCESS_DESTINATION_BY_SCOPE[accessScope]);

  const initialLanguage = await getRequestLanguage(
    getLanguageParam(params.lang),
  );

  return (
    <AccessGateway
      development={process.env.NODE_ENV === "development"}
      initialLanguage={initialLanguage}
    />
  );
}
