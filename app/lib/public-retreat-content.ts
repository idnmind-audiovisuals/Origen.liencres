export const PUBLIC_SITE_URL = "https://www.origenliencres.com";
export const ORIGEN_MAPS_URL =
  "https://maps.app.goo.gl/CcDJ15DKT4QvTdW4A";
export const ORIGEN_INSTAGRAM_URL =
  "https://www.instagram.com/origen.liencres/";
export const ORIGEN_AIRBNB_URL =
  "https://es-l.airbnb.com/rooms/23250801?source_impression_id=p3_1785061106_P3QhtYkp0415WTpb&modal=PHOTO_TOUR_SCROLLABLE";
export const HOST_APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf9DrIbIV4OKiswKQhuKsssMyVvuP_l8CROR0ijH0_WUQSpIw/viewform?usp=publish-editor";

export const retreatLandingCopy = {
  es: {
    htmlLang: "es",
    alternateLabel: "EN",
    alternateHref: "/retreats-spain",
    faqLabel: "Preguntas",
    faqHref: "/retiros-cantabria/preguntas-frecuentes",
    eyebrow: "Origen Liencres · Cantabria",
    title: "Espacio para organizar retiros en Cantabria",
    lead:
      "Origen es un espacio para organizar retiros en Cantabria, en Liencres, cerca de Santander. Un lugar privado para grupos pequeños entre el océano, el bosque y los acantilados de Costa Quebrada.",
    cta: "Consultar disponibilidad",
    introEyebrow: "Qué es Origen",
    introTitle: "Un lugar creado para reunir, practicar y volver a lo esencial.",
    introParagraphs: [
      "Origen Liencres acoge retiros de bienestar, residencias creativas, encuentros de embodiment y experiencias cocreadas en el norte de España.",
      "La casa ofrece alojamiento para grupos de hasta 8 personas, espacios compartidos y una amplia sala de práctica abierta a la naturaleza. El espacio completo puede reservarse para que cada grupo viva su proceso con privacidad.",
    ],
    facts: [
      ["Capacidad", "Hasta 8 personas"],
      ["Entorno", "Playa, bosque y Costa Quebrada"],
      ["Ubicación", "Liencres, cerca de Santander"],
    ],
    landscapeCaption: "Costa Quebrada · Liencres",
    featuresEyebrow: "Para grupos pequeños y privados",
    featuresTitle: "Un espacio de retiros conectado con el paisaje del norte.",
    features: [
      "Alojamiento y uso exclusivo para grupos privados",
      "Sala de práctica abierta a la naturaleza",
      "Océano y bosque a pocos pasos",
      "A 25 minutos del aeropuerto de Santander",
      "Retiros, residencias creativas y embodiment",
      "Dos playas a distancia caminable",
    ],
    hostEyebrow: "Organiza tu retiro",
    hostTitle: "Trae tu grupo a Origen.",
    hostBody:
      "Cuéntanos qué experiencia quieres facilitar, las fechas que imaginas y las necesidades de tu grupo. Te ayudaremos a valorar si Origen es el lugar adecuado.",
    hostCta: "Enviar propuesta",
    mapCta: "Abrir en Google Maps",
    airbnbCta: "Ver el alojamiento",
    faqCta: "Resolver preguntas frecuentes",
    footerLine: "Retreat space · Liencres · Cantabria · Northern Spain",
  },
  en: {
    htmlLang: "en",
    alternateLabel: "ES",
    alternateHref: "/retiros-cantabria",
    faqLabel: "Questions",
    faqHref: "/retreats-spain/faq",
    eyebrow: "Origen Liencres · Cantabria",
    title: "Retreat venue in Cantabria, Northern Spain",
    lead:
      "Origen is a private retreat venue in Liencres, Cantabria, near Santander. A place for small groups where the Atlantic Ocean, coastal forest and the cliffs of Costa Quebrada meet.",
    cta: "Check availability",
    introEyebrow: "What Origen is",
    introTitle: "A place created to gather, practise and return to what is essential.",
    introParagraphs: [
      "Origen Liencres hosts wellness retreats, creative residencies, embodiment gatherings and cocreated experiences in Northern Spain.",
      "The house offers accommodation for groups of up to 8 people, shared spaces and a spacious practice room open to nature. The full venue can be privately hired for one group.",
    ],
    facts: [
      ["Capacity", "Up to 8 guests"],
      ["Setting", "Beach, forest and Costa Quebrada"],
      ["Location", "Liencres, near Santander"],
    ],
    landscapeCaption: "Costa Quebrada · Liencres",
    featuresEyebrow: "For small, private groups",
    featuresTitle: "A retreat venue shaped by the landscape of Northern Spain.",
    features: [
      "Accommodation and exclusive use for private groups",
      "A nature-facing practice space",
      "Wild ocean and coastal forest close by",
      "25 minutes from Santander Airport",
      "Retreats, creative residencies and embodiment",
      "Two beaches within walking distance",
    ],
    hostEyebrow: "Host your retreat",
    hostTitle: "Bring your group to Origen.",
    hostBody:
      "Tell us about the experience you want to facilitate, your possible dates and what your group needs. We will help you understand whether Origen is the right place.",
    hostCta: "Send your proposal",
    mapCta: "Open in Google Maps",
    airbnbCta: "View the accommodation",
    faqCta: "Read frequently asked questions",
    footerLine: "Retreat space · Liencres · Cantabria · Northern Spain",
  },
} as const;

export type RetreatLanguage = keyof typeof retreatLandingCopy;
