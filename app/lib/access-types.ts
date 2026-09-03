export const ACCESS_SCOPES = [
  "residency",
  "bros",
  "space",
  "experience",
  "hosts-es",
  "hosts-en",
] as const;

export type AccessScope = (typeof ACCESS_SCOPES)[number];

export const ACCESS_DESTINATION_BY_SCOPE = {
  residency: "/residency",
  bros: "/circulo-de-hombres",
  space: "/space",
  experience: "/experience",
  "hosts-es": "/retreat-organizers-circle?lang=es",
  "hosts-en": "/retreat-organizers-circle?lang=en",
} as const satisfies Record<AccessScope, string>;

export type AccessDestination =
  (typeof ACCESS_DESTINATION_BY_SCOPE)[AccessScope];

export function getHostsCircleLanguage(destination: AccessDestination | null) {
  if (destination === ACCESS_DESTINATION_BY_SCOPE["hosts-es"]) return "es";
  if (destination === ACCESS_DESTINATION_BY_SCOPE["hosts-en"]) return "en";
  return null;
}

export function isAccessScope(value: unknown): value is AccessScope {
  return ACCESS_SCOPES.includes(value as AccessScope);
}

export function isAccessDestination(
  value: unknown,
): value is AccessDestination {
  return Object.values(ACCESS_DESTINATION_BY_SCOPE).includes(
    value as AccessDestination,
  );
}
