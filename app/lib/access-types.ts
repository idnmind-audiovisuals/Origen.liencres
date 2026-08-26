export const ACCESS_SCOPES = [
  "residency",
  "bros",
  "space",
  "experience",
] as const;

export type AccessScope = (typeof ACCESS_SCOPES)[number];

export const ACCESS_DESTINATION_BY_SCOPE = {
  residency: "/residency",
  bros: "/bros",
  space: "/space",
  experience: "/experience",
} as const satisfies Record<AccessScope, string>;

export type AccessDestination =
  (typeof ACCESS_DESTINATION_BY_SCOPE)[AccessScope];

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
