import { OpenedState } from "./OpenedState";
import type { Language } from "../lib/language";
import {
  getResidencyLanguageHrefs,
  getResidencyStructuredData,
} from "../lib/residency-routes";
import type { ResidencyFocus } from "../lib/site-copy";

type ResidencyLandingProps = {
  focus: ResidencyFocus;
  language: Language;
};

export function ResidencyLanding({ focus, language }: ResidencyLandingProps) {
  const structuredData = getResidencyStructuredData(focus, language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <OpenedState
        development={false}
        initialLanguage={language}
        residencyFocus={focus}
        residencyLanguageHrefs={getResidencyLanguageHrefs(focus)}
        variant="residency"
      />
    </>
  );
}
