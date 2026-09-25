import type { Metadata } from "next";
import { EmpoderateState } from "../components/EmpoderateState";
import { requireOrigenAccess } from "../lib/require-access";
import { PROTECTED_PAGE_ROBOTS } from "../lib/seo";

const title = "BROS — Retiro de hombres | Origen Liencres";
const description =
  "Tres días entre hombres en Liencres para salir del ruido, conocerte mejor y volver con claridad.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
  robots: PROTECTED_PAGE_ROBOTS,
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Origen Liencres",
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [],
  },
};

export default async function RetiroRebrosPage() {
  await requireOrigenAccess("empoderate");

  return <EmpoderateState development={false} />;
}
