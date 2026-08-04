import { AccessGateway } from "./components/AccessGateway";
import {
  getLanguageParam,
  type LanguageSearchParams,
} from "./lib/language";
import { getRequestLanguage } from "./lib/request-language";

export default async function Home({
  searchParams,
}: {
  searchParams: LanguageSearchParams;
}) {
  const params = await searchParams;
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
