import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function BrosPage() {
  redirect("/circulo-de-hombres");
}
