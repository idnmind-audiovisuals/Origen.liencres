import { cookies } from "next/headers";
import { AccessGateway } from "./components/AccessGateway";
import {
  ACCESS_COOKIE_NAME,
  verifySessionToken,
} from "./lib/access-session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const initiallyAuthenticated = await verifySessionToken(
    cookieStore.get(ACCESS_COOKIE_NAME)?.value,
  );

  return (
    <AccessGateway
      initiallyAuthenticated={initiallyAuthenticated}
      development={process.env.NODE_ENV === "development"}
    />
  );
}
