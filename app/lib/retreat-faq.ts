import type { RetreatLanguage } from "./public-retreat-content";

export const retreatFaqCopy = {
  es: {
    eyebrow: "Preguntas frecuentes · Origen Liencres",
    title: "Organizar un retiro en Cantabria",
    intro:
      "Respuestas directas para facilitadores y grupos que buscan un espacio de retiro pequeño, privado y próximo al mar en el norte de España.",
    backLabel: "Retiros Cantabria",
    backHref: "/retiros-cantabria",
    alternateLabel: "EN",
    alternateHref: "/retreats-spain/faq",
    questions: [
      {
        question: "¿Dónde puedo organizar un retiro cerca de Santander?",
        answer:
          "Origen Liencres está en Liencres, Cantabria, cerca de Santander y a unos 25 minutos del aeropuerto. Es un espacio privado pensado para retiros pequeños, residencias creativas y encuentros de embodiment.",
      },
      {
        question: "¿Hay espacios para retiros junto al mar en Cantabria?",
        answer:
          "Sí. Origen se encuentra junto a la costa de Liencres, entre el océano Atlántico, el bosque costero y los acantilados de Costa Quebrada. Hay playas y senderos costeros a poca distancia.",
      },
      {
        question: "¿Dónde organizar un retiro pequeño en el norte de España?",
        answer:
          "Origen está diseñado para grupos pequeños de hasta 8 personas que desean privacidad, alojamiento, espacios compartidos y una sala de práctica conectada con la naturaleza.",
      },
      {
        question: "¿Origen Liencres tiene alojamiento?",
        answer:
          "Sí. Origen ofrece alojamiento en la propia casa, habitaciones cómodas y espacios comunes para convivir durante el retiro. Puedes consultar el alojamiento y la disponibilidad mediante el enlace de Airbnb.",
      },
      {
        question: "¿Cuántas personas pueden alojarse?",
        answer:
          "El espacio está preparado para retiros íntimos de hasta 8 personas. Al enviar tu propuesta podemos revisar la distribución y las necesidades concretas del grupo.",
      },
      {
        question: "¿Está cerca de la playa?",
        answer:
          "Sí. Origen está en el entorno costero de Liencres, con dos playas a distancia caminable y acceso cercano al océano, el bosque y los caminos de Costa Quebrada.",
      },
      {
        question: "¿Se puede alquilar el espacio completo para un grupo?",
        answer:
          "Sí. Origen puede reservarse como espacio completo para un grupo privado, permitiendo que el retiro mantenga su intimidad, ritmo y propuesta durante toda la estancia.",
      },
      {
        question: "¿Cómo organizar un retiro en Origen?",
        answer:
          "Completa el formulario para anfitriones indicando el tipo de retiro, las fechas aproximadas, el número de participantes y las necesidades del grupo. Revisaremos la propuesta y la disponibilidad contigo.",
      },
    ],
    hostEyebrow: "Siguiente paso",
    hostTitle: "Cuéntanos el retiro que quieres crear.",
    hostBody:
      "Comparte tu propuesta, fechas y número de participantes para comprobar disponibilidad y encaje.",
    hostCta: "Enviar propuesta",
  },
  en: {
    eyebrow: "Frequently asked questions · Origen Liencres",
    title: "Hosting a retreat in Northern Spain",
    intro:
      "Direct answers for facilitators and groups looking for a small, private retreat venue close to the sea in Cantabria.",
    backLabel: "Retreats Spain",
    backHref: "/retreats-spain",
    alternateLabel: "ES",
    alternateHref: "/retiros-cantabria/preguntas-frecuentes",
    questions: [
      {
        question: "Where can I host a retreat near Santander?",
        answer:
          "Origen Liencres is in Liencres, Cantabria, near Santander and around 25 minutes from the airport. It is a private venue for small retreats, creative residencies and embodiment gatherings.",
      },
      {
        question: "Are there retreat venues by the sea in Cantabria?",
        answer:
          "Yes. Origen sits beside the coast of Liencres, between the Atlantic Ocean, coastal forest and the cliffs of Costa Quebrada. Beaches and coastal paths are close to the house.",
      },
      {
        question: "Where can I organise a small retreat in Northern Spain?",
        answer:
          "Origen is designed for private groups of up to 8 people who want accommodation, shared spaces and a practice room connected with nature.",
      },
      {
        question: "Does Origen Liencres provide accommodation?",
        answer:
          "Yes. Accommodation is available in the house, with comfortable rooms and shared living spaces. The accommodation and available dates can also be viewed through Airbnb.",
      },
      {
        question: "How many people can stay?",
        answer:
          "The venue is intended for intimate retreats of up to 8 guests. We can review the room layout and the particular needs of your group when you send your proposal.",
      },
      {
        question: "Is it close to the beach?",
        answer:
          "Yes. Origen is in the coastal landscape of Liencres, with two beaches within walking distance and easy access to the ocean, forest and Costa Quebrada paths.",
      },
      {
        question: "Can the whole venue be hired for one group?",
        answer:
          "Yes. Origen can be reserved in full for one private group so the retreat can maintain its own intimacy, rhythm and programme throughout the stay.",
      },
      {
        question: "How do I organise a retreat at Origen?",
        answer:
          "Complete the host form with your retreat format, possible dates, participant numbers and group needs. We will review the proposal and availability with you.",
      },
    ],
    hostEyebrow: "Next step",
    hostTitle: "Tell us about the retreat you want to create.",
    hostBody:
      "Share your proposal, dates and group size so we can review availability and fit.",
    hostCta: "Send your proposal",
  },
} as const satisfies Record<RetreatLanguage, object>;
