import Link from "next/link";
import { BookingCalendar } from "./BookingCalendar";
import { GatewayBrandLink } from "./GatewayBrandLink";
import {
  HOST_APPLICATION_URL,
  ORIGEN_AIRBNB_URL,
  ORIGEN_INSTAGRAM_URL,
  ORIGEN_MAPS_URL,
  PUBLIC_SITE_URL,
} from "../lib/public-retreat-content";

const HOUSE_PHOTOS = [
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/b3c60d82-07b7-4f84-9080-c331a39599f7.png?im_w=1440",
    alt: "Origen Liencres, casa para retiros en Cantabria",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/3b1e8c34-f170-45e9-8ebe-d880261a3235.jpeg?im_w=720",
    alt: "Fotografía del alojamiento Origen en Liencres",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/f4641d66-e9d5-4f78-a0d9-88dcfdd83ef7.jpeg?im_w=720",
    alt: "Espacio de la casa Origen en Cantabria",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/a09bcf6c-b2cd-49f4-869e-bbdb4be31da8.jpeg?im_w=720",
    alt: "Alojamiento privado para grupos en Liencres",
  },
  {
    src: "https://a0.muscache.com/im/pictures/hosting/Hosting-23250801/original/dba9c7f3-6380-4957-9da3-fa2311384af3.png?im_w=720",
    alt: "Casa Origen junto a Costa Quebrada",
  },
] as const;

const SPACE_DETAILS = [
  ["8 huéspedes", "Una escala íntima para convivir y sostener la experiencia como un solo grupo."],
  ["3 habitaciones · 7 camas", "Distribución flexible para facilitadores, participantes y residencias creativas."],
  ["2 baños", "Comodidad cotidiana para una estancia compartida de varios días."],
  ["Casa completa", "Cocina-salón, jardín, porche y aparcamiento para uso privado del grupo."],
  ["Sala de práctica", "Un espacio amplio para movimiento, embodiment, yoga, conversación y creación."],
  ["Mar y bosque", "Playas, senderos y el paisaje de Costa Quebrada cerca de la casa."],
] as const;

const BEDROOMS = [
  {
    title: "Habitación principal",
    description:
      "Un dormitorio tranquilo para descansar entre sesiones y días compartidos.",
  },
  {
    title: "Habitación de grupo",
    description:
      "Una distribución pensada para convivir durante retiros y residencias íntimas.",
  },
  {
    title: "Habitación flexible",
    description:
      "El uso de las camas se acuerda según el tamaño y las necesidades de cada grupo.",
  },
] as const;

const AMENITIES = [
  "Alojamiento para hasta 8 huéspedes",
  "3 habitaciones y 7 camas",
  "2 baños",
  "Cocina y salón compartido",
  "Sala amplia de práctica",
  "Jardín y porche",
  "Aparcamiento en la propiedad",
  "Playas, bosque y senderos cercanos",
] as const;

export function HouseBookingLanding() {
  const url = `${PUBLIC_SITE_URL}/retiro`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: "Alquila Origen para tu retiro en Cantabria",
        description: "Presentación, disponibilidad y reserva de Origen Liencres, una casa privada para retiros y residencias de hasta 8 personas cerca de Santander.",
        inLanguage: "es-ES",
        isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
        about: { "@id": `${PUBLIC_SITE_URL}/#retreat-space` },
      },
      {
        "@type": "Service",
        "@id": `${url}#booking-service`,
        name: "Alquiler privado de Origen Liencres para retiros",
        serviceType: "Alquiler de alojamiento y espacio para retiros",
        provider: { "@id": `${PUBLIC_SITE_URL}/#retreat-space` },
        areaServed: { "@type": "AdministrativeArea", name: "Cantabria, España" },
        url,
      },
      {
        "@type": "LodgingBusiness",
        "@id": `${url}#accommodation`,
        name: "Origen Liencres",
        url,
        description:
          "Casa completa para retiros, residencias y grupos privados de hasta 8 personas en Liencres, Cantabria.",
        numberOfRooms: 3,
        amenityFeature: AMENITIES.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        sameAs: [ORIGEN_AIRBNB_URL, ORIGEN_INSTAGRAM_URL, ORIGEN_MAPS_URL],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Origen Liencres", item: `${PUBLIC_SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Retiros en Cantabria", item: `${PUBLIC_SITE_URL}/retiros-cantabria` },
          { "@type": "ListItem", position: 3, name: "Retiro", item: url },
        ],
      },
    ],
  };

  return (
    <main className="retreat-public-page retreat-public-page--esencia booking-page" lang="es">
      <header className="retreat-public-header">
        <GatewayBrandLink className="retreat-public-brand" label="Origen — volver a la entrada" />
        <nav aria-label="Navegación">
          <a href="#la-casa">La casa</a>
          <a href="#galeria">Fotos</a>
          <a href="#reservar">Disponibilidad</a>
          <Link className="retreat-language-link" href="/host-your-retreat" hrefLang="en" lang="en" aria-label="View retreat hosting information in English">EN</Link>
        </nav>
      </header>

      <section className="booking-hero" aria-labelledby="booking-hero-title">
        <div>
          <p className="retreat-public-eyebrow">Origen Liencres · Costa Quebrada</p>
          <h1 id="booking-hero-title">Un espacio para tu retiro</h1>
        </div>
        <div className="booking-hero-intro">
          <p>Alquila Origen en uso exclusivo para reunir a tu grupo entre el océano, el bosque y el paisaje de Cantabria.</p>
          <a className="retreat-public-primary" href="#reservar">Comprobar fechas<span className="external-link-dot" aria-hidden="true" /></a>
        </div>
      </section>

      <section className="booking-gallery" id="galeria" aria-label="Fotografías de Origen Liencres">
        {HOUSE_PHOTOS.map((photo, index) => (
          <figure key={photo.src} className={index === 0 ? "booking-gallery-main" : ""}>
            {/* The photos belong to the linked Origen Airbnb listing. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} loading={index === 0 ? "eager" : "lazy"} />
          </figure>
        ))}
        <a className="booking-gallery-link" href={ORIGEN_AIRBNB_URL} target="_blank" rel="noreferrer">
          Ver todas las fotos
        </a>
      </section>

      <section className="booking-listing-summary scroll-reveal" aria-labelledby="booking-listing-title">
        <div>
          <p className="retreat-public-eyebrow">Casa completa en Liencres</p>
          <h2 id="booking-listing-title">Origen · Un espacio privado para tu grupo.</h2>
          <p>8 huéspedes · 3 habitaciones · 7 camas · 2 baños</p>
        </div>
        <a href={ORIGEN_AIRBNB_URL} target="_blank" rel="noreferrer">
          Reseñas verificadas en Airbnb
          <span className="external-link-dot" aria-hidden="true" />
        </a>
      </section>

      <section className="booking-story scroll-reveal" id="la-casa" aria-labelledby="booking-story-title">
        <div>
          <p className="retreat-public-eyebrow">La casa</p>
          <h2 id="booking-story-title">Todo sucede en un mismo lugar.</h2>
        </div>
        <div>
          <p>Origen es una casa amplia y privada en Liencres, creada para retiros íntimos, residencias y encuentros que necesitan tiempo, presencia y continuidad.</p>
          <p>El alojamiento, las zonas compartidas, el jardín y el espacio de práctica permiten alternar sesiones, descanso y convivencia sin fragmentar la experiencia.</p>
        </div>
      </section>

      <section className="booking-details" aria-labelledby="booking-details-title">
        <div className="booking-details-heading scroll-reveal">
          <p className="retreat-public-eyebrow">El espacio de un vistazo</p>
          <h2 id="booking-details-title">Privado para tu grupo.</h2>
        </div>
        <div className="booking-detail-grid scroll-reveal-list">
          {SPACE_DETAILS.map(([title, description], index) => (
            <article key={title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-rooms" aria-labelledby="booking-rooms-title">
        <div className="booking-section-heading scroll-reveal">
          <p className="retreat-public-eyebrow">Dónde dormiréis</p>
          <h2 id="booking-rooms-title">Habitaciones para convivir y descansar.</h2>
          <p>
            La casa dispone de tres habitaciones y siete camas. Antes de reservar,
            confirmamos contigo la distribución adecuada para participantes y equipo.
          </p>
        </div>
        <div className="booking-room-grid scroll-reveal-list">
          {BEDROOMS.map((room, index) => (
            <article key={room.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{room.title}</h3>
              <p>{room.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-amenities" aria-labelledby="booking-amenities-title">
        <div className="booking-section-heading scroll-reveal">
          <p className="retreat-public-eyebrow">Qué ofrece el espacio</p>
          <h2 id="booking-amenities-title">Lo esencial para una estancia compartida.</h2>
        </div>
        <ul className="booking-amenities-grid scroll-reveal-list">
          {AMENITIES.map((amenity) => (
            <li key={amenity}>
              <span aria-hidden="true" />
              {amenity}
            </li>
          ))}
        </ul>
      </section>

      <BookingCalendar />

      <section className="booking-host scroll-reveal" aria-labelledby="booking-host-title">
        <div className="booking-host-mark" aria-hidden="true">O</div>
        <div>
          <p className="retreat-public-eyebrow">Tu anfitrión</p>
          <h2 id="booking-host-title">Acompañamiento directo de Origen.</h2>
          <p>
            Antes de la llegada revisamos contigo el grupo, las habitaciones, el uso
            de la sala y las necesidades prácticas de la estancia. Así puedes saber
            si la casa encaja realmente con el retiro que quieres organizar.
          </p>
          <a href={HOST_APPLICATION_URL} target="_blank" rel="noreferrer">
            Hablar con el anfitrión
            <span className="external-link-dot" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="booking-reviews scroll-reveal" aria-labelledby="booking-reviews-title">
        <div>
          <p className="retreat-public-eyebrow">Reseñas</p>
          <h2 id="booking-reviews-title">Opiniones reales, en su fuente original.</h2>
        </div>
        <div>
          <p>
            Consulta en Airbnb las reseñas verificadas y actualizadas de quienes ya
            se han alojado en el espacio.
          </p>
          <a className="retreat-public-primary" href={ORIGEN_AIRBNB_URL} target="_blank" rel="noreferrer">
            Leer reseñas en Airbnb
            <span className="external-link-dot" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="booking-location scroll-reveal" aria-labelledby="booking-location-title">
        <div>
          <p className="retreat-public-eyebrow">Liencres · Cantabria</p>
          <h2 id="booking-location-title">Cerca de Santander. Lejos del ruido.</h2>
        </div>
        <div>
          <p>A unos 25 minutos del aeropuerto de Santander, entre las playas, los acantilados y el bosque costero de Liencres.</p>
          <a href={ORIGEN_MAPS_URL} target="_blank" rel="noreferrer">Abrir en Google Maps<span className="external-link-dot" aria-hidden="true" /></a>
        </div>
      </section>

      <nav className="retreat-public-links scroll-reveal" aria-label="Más información de Origen">
        <Link href="/retiros-cantabria">Retiros en Cantabria</Link>
        <Link href="/espacio-retiros-cantabria">Detalles del espacio</Link>
        <Link href="/retiros-cantabria/preguntas-frecuentes">Preguntas frecuentes</Link>
      </nav>

      <footer className="retreat-public-footer">
        <address>Origen Liencres<br />Barrio Liencres, 585<br />39120 Liencres, Cantabria<br /><a href="tel:+34622181691">+34 622 18 16 91</a></address>
        <div>
          <p>Casa privada · Retiros · Residencias</p>
          <a href={ORIGEN_INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
