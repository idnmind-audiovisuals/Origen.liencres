import type { Metadata } from "next";
import { HouseBookingLanding } from "../components/HouseBookingLanding";

const title = "Origen Liencres | Casa para retiros y grupos en Cantabria";
const description =
  "Descubre Origen en Liencres: fotos, habitaciones, servicios y disponibilidad para reservar una casa privada de retiros de hasta 9 personas cerca de Santander.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/retiro",
    languages: {
      "es-ES": "/retiro",
      en: "/host-your-retreat",
      "x-default": "/retiro",
    },
  },
  openGraph: {
    type: "website",
    url: "/retiro",
    title,
    description,
    locale: "es_ES",
    alternateLocale: ["en_GB"],
    images: [
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/b3c60d82-07b7-4f84-9080-c331a39599f7.png?im_w=1440",
        alt: "Origen Liencres, casa para retiros en Cantabria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/b3c60d82-07b7-4f84-9080-c331a39599f7.png?im_w=1440",
    ],
  },
};

export default function RetiroPage() {
  return <HouseBookingLanding />;
}
