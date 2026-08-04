import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { ORIGEN_SYMBOL_ASSET } from "./lib/brand";

const title = "Origen — Key to open";
const description = "A quiet gateway into Origen.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0];
  const requestHost = forwardedHost ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0];
  const protocol = forwardedProtocol === "http" ? "http" : "https";
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  let metadataBase = new URL("http://localhost:3000");

  try {
    if (requestHost) metadataBase = new URL(`${protocol}://${requestHost}`);
    else if (vercelHost) metadataBase = new URL(`https://${vercelHost}`);
  } catch {
    // Retain the local fallback for malformed forwarded headers.
  }

  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    icons: {
      icon: ORIGEN_SYMBOL_ASSET,
      shortcut: ORIGEN_SYMBOL_ASSET,
    },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "Origen",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href={ORIGEN_SYMBOL_ASSET} as="image" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
