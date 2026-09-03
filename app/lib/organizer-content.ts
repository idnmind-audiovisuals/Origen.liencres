import type { Metadata } from "next";
import { PUBLIC_SITE_URL, type RetreatLanguage } from "./public-retreat-content";

export type OrganizerSlug =
  | "retreat-venue-spain"
  | "espacio-retiros-cantabria"
  | "creative-residency-spain"
  | "host-your-retreat"
  | "espacio-retiros"
  | "organizar-retiro";

type OrganizerSection = {
  eyebrow: string;
  title: string;
  items: readonly (readonly [string, string])[];
};

type OrganizerCopy = {
  language: RetreatLanguage;
  title: string;
  description: string;
  navLabel: string;
  eyebrow: string;
  heading: string;
  lead: string;
  facts: readonly (readonly [string, string])[];
  cta: string;
  introTitle: string;
  intro: readonly string[];
  spaces: OrganizerSection;
  planning: OrganizerSection;
  questions: readonly (readonly [string, string])[];
  closingTitle: string;
  closingBody: string;
  serviceName: string;
  serviceType: string;
  alternate?: OrganizerSlug;
};

// Public, intent-specific pages. Password-protected experiences stay separate.
export const organizerPages: Record<OrganizerSlug, OrganizerCopy> = {
  "retreat-venue-spain": {
    language: "en",
    title: "Retreat Venue in Spain for Small Groups | Origen Liencres",
    description: "A private retreat venue in Northern Spain for facilitators: accommodation for up to 8, a nature-facing shala and coastal forest near Santander.",
    navLabel: "Venue & practical details",
    eyebrow: "For retreat leaders · Northern Spain",
    heading: "Retreat venue in Spain.",
    lead: "Bring your practice and your people. Origen Liencres is a small, private venue in Cantabria, with accommodation and space to gather between the Atlantic coast and the forest.",
    facts: [["Stay", "Up to 8 overnight guests"], ["Use", "One private group"], ["Place", "Liencres · near Santander"]],
    cta: "Host your retreat",
    introTitle: "A venue that fits your group.",
    intro: [
      "For facilitators comparing retreat venues in Spain, scale matters. Origen is a home for an intimate group, not a large retreat complex. Include any overnight facilitators in the house’s capacity of 8 people.",
      "Your group can reserve the whole space. Bedrooms, shared living areas and a generous practice shala allow sessions, meals and downtime to remain part of the same stay.",
    ],
    spaces: {
      eyebrow: "The venue at a glance", title: "Stay. Practise. Step outside.",
      items: [
        ["Accommodation together", "A residential base for up to 8 people. Discuss the room and bed arrangement before you finalise participant numbers."],
        ["A nature-facing shala", "An open-to-nature practice space for movement, embodiment and group work. Share any equipment or setup requirements with your proposal."],
        ["Atlantic coast & pine forest", "Beaches, coastal paths and the landscape of Costa Quebrada are close by. Leave space in the programme for weather and time outdoors."],
        ["Near Santander", "Liencres is around 25 minutes from Santander Airport by road. Plan your group’s arrival and onward transport separately."],
      ],
    },
    planning: {
      eyebrow: "Before you choose", title: "Make an informed venue decision.",
      items: [
        ["Group & rooming", "Confirm the total overnight group, including your team, and how the available rooms would work for everyone."],
        ["Practice & facilities", "Tell us about sound, materials, privacy, accessibility and your daily rhythm so we can review suitability."],
        ["Food & travel", "Ask what arrangements are possible for your stay. Do not assume catering, transfers or facilitation are included."],
        ["Dates & terms", "Request availability and the terms for your particular group before announcing a confirmed retreat."],
      ],
    },
    questions: [
      ["Is this a venue or a scheduled retreat?", "This page is for organisers who want to bring their own group and programme. Send your idea to discuss a private venue stay."],
      ["Can I hire the whole venue?", "Yes, the full space can be reserved for one private group, subject to dates and an agreement for your stay."],
      ["How do I get a price?", "Use the host form with dates, number of nights, total overnight guests and practical needs. Ask for a proposal and confirmation of what it includes."],
    ],
    closingTitle: "Your practice. Your people. Origen.",
    closingBody: "Tell us what you want to host and what your group needs. Start with a venue enquiry, before committing your participants.",
    serviceName: "Small-group retreat venue at Origen Liencres",
    serviceType: "Private retreat venue hire",
    alternate: "espacio-retiros-cantabria",
  },
  "espacio-retiros-cantabria": {
    language: "es",
    title: "Espacio de Retiros en Cantabria para Facilitadores | Origen",
    description: "Consulta capacidad, alojamiento, shala y ubicación de Origen Liencres. Un espacio privado para organizar retiros de hasta 8 personas cerca de Santander.",
    navLabel: "El espacio en Cantabria",
    eyebrow: "Espacio para retiros · Liencres",
    heading: "Tu retiro en Cantabria.",
    lead: "Un espacio para facilitadores que quieren reunir a su grupo con intimidad. Alojamiento, práctica y naturaleza entre el mar, el bosque y Costa Quebrada, cerca de Santander.",
    facts: [["Alojamiento", "Hasta 8 personas"], ["Uso", "Un grupo privado"], ["Lugar", "Liencres · Cantabria"]],
    cta: "Organiza tu retiro",
    introTitle: "Un lugar a la medida de tu grupo.",
    intro: [
      "Si buscas un espacio para retiros en Cantabria, empieza por la escala de tu encuentro. Origen es una casa para grupos pequeños, no un gran complejo. La capacidad de alojamiento es de 8 personas en total, contando al equipo que se quede a dormir.",
      "El grupo puede reservar el espacio completo. Habitaciones, zonas compartidas y una amplia shala permiten alternar sesiones y descanso sin separar el alojamiento de la experiencia.",
    ],
    spaces: {
      eyebrow: "Ficha del espacio", title: "Alojarse. Practicar. Salir al paisaje.",
      items: [
        ["Alojamiento para el grupo", "Una base residencial para hasta 8 personas. Consulta la distribución de habitaciones y camas antes de cerrar el número de participantes."],
        ["Shala abierta a la naturaleza", "Un espacio de práctica para movimiento, embodiment y trabajo grupal. Comparte las necesidades de material y montaje de tus sesiones."],
        ["Costa y bosque", "Playas, senderos costeros y el paisaje de Costa Quebrada cerca de la casa. Conviene adaptar las actividades exteriores al tiempo del norte."],
        ["Cerca de Santander", "Origen está en Liencres, a unos 25 minutos por carretera del aeropuerto de Santander. Prevé cómo llegará y se desplazará el grupo."],
      ],
    },
    planning: {
      eyebrow: "Antes de elegir", title: "Los detalles que conviene confirmar.",
      items: [
        ["Grupo y habitaciones", "Cuenta a todas las personas que dormirán en la casa y revisa qué distribución encaja con tu grupo."],
        ["Práctica y necesidades", "Cuéntanos qué necesitas en cuanto a sonido, materiales, accesibilidad, privacidad y ritmo de las sesiones."],
        ["Comidas y desplazamientos", "Consulta las opciones para tu estancia. No des por incluidos catering, traslados ni facilitación."],
        ["Fechas y condiciones", "Solicita disponibilidad y las condiciones de tu propuesta antes de anunciar el retiro como confirmado."],
      ],
    },
    questions: [
      ["¿Se trata de un retiro programado o de un espacio?", "Esta página está dirigida a organizadores que traen su propio grupo y programa. Envíanos tu idea para valorar una estancia privada."],
      ["¿Se puede reservar el espacio completo?", "Sí, el espacio puede reservarse para un único grupo privado, sujeto a disponibilidad y al acuerdo de la estancia."],
      ["¿Cómo solicito un presupuesto?", "Envía el formulario con fechas, noches, número total de personas alojadas y necesidades. Pide una propuesta y la confirmación de qué incluye."],
    ],
    closingTitle: "Tu práctica. Tu grupo. Origen.",
    closingBody: "Comparte la experiencia que quieres facilitar y lo que necesita tu grupo. Empieza consultando el espacio antes de comprometer las plazas.",
    serviceName: "Espacio para retiros de grupos pequeños en Origen Liencres",
    serviceType: "Alquiler privado de espacio para retiros",
    alternate: "retreat-venue-spain",
  },
  "creative-residency-spain": {
    language: "en",
    title: "Creative Residency Space in Spain | Origen Liencres",
    description: "Plan a self-directed creative residency in Northern Spain. A private home for up to 8 artists, writers or movement practitioners near the sea and Santander.",
    navLabel: "Creative residencies",
    eyebrow: "Creative residency · Northern Spain",
    heading: "Space for a creative residency.",
    lead: "Bring a project that needs time, attention and people. Origen is a residential base in Liencres for small creative groups, with the Atlantic coast and pine forest close by.",
    facts: [["Format", "Self-directed stays"], ["Group", "Up to 8 overnight guests"], ["Setting", "Costa Quebrada · Spain"]],
    cta: "Propose a residency",
    introTitle: "A home for the work in progress.",
    intro: [
      "A creative residency can begin with an unfinished text, a movement research question or a collaboration that needs uninterrupted time. Here, your group defines the purpose, the schedule and what you want to share.",
      "Origen provides a setting to live and gather while you develop your work. This is a private venue enquiry, not an application for a funded residency, grant or curated programme.",
    ],
    spaces: {
      eyebrow: "Ways to inhabit the space", title: "Make room for your process.",
      items: [
        ["Writing & reflection", "Use the house as a shared base for focused periods, reading and conversations. Discuss quiet working arrangements with the people you bring."],
        ["Movement research", "Explore embodiment, dance or collaborative practice in the nature-facing shala. Confirm floor, equipment and setup needs before committing."],
        ["Creative collaboration", "Give a small collective time to develop an idea together, moving between individual attention and shared sessions."],
        ["Field observation", "Walk the coast and forest of Liencres as part of your process. The landscape is a starting point for attention, not a prescribed outcome."],
      ],
    },
    planning: {
      eyebrow: "Shape your stay", title: "Tell us what the work needs.",
      items: [
        ["Your intention", "Describe the project, the people involved and why working together in residence would help."],
        ["Time & numbers", "Send a preferred period, number of nights and total overnight group, up to 8 people including your team."],
        ["Materials & conditions", "Flag technical equipment, messy processes, sound, storage or dedicated working needs. A specialist studio setup is not assumed."],
        ["Shared rhythm", "Describe how you imagine working, resting, eating and using common areas, so we can review whether the house is a fit."],
      ],
    },
    questions: [
      ["Is this a funded artist residency?", "No funding or grant is offered on this page. It is an invitation to enquire about hiring the space for a self-directed creative stay."],
      ["Is specialist equipment provided?", "Do not assume specialist studio or production equipment is available. Include your technical requirements in your enquiry and confirm them before booking."],
      ["Do we need to produce an exhibition?", "No exhibition or public outcome is advertised here. Describe any sharing or event you have in mind so that its suitability can be discussed."],
    ],
    closingTitle: "Bring something unfinished.",
    closingBody: "Tell us about the work, the people and the time you need. We can explore whether Origen is the right home for your residency.",
    serviceName: "Self-directed creative residency venue at Origen Liencres",
    serviceType: "Creative residency venue hire",
  },
  "host-your-retreat": {
    language: "en",
    title: "Host Your Retreat in Cantabria, Spain | Origen Liencres",
    description: "A practical guide for retreat leaders: plan dates, rooming, practice and logistics for a private retreat of up to 8 guests at Origen near Santander.",
    navLabel: "Host your retreat",
    eyebrow: "For facilitators & organisers",
    heading: "Host your retreat in Cantabria.",
    lead: "You hold the intention. We offer a place to bring people together. Start planning a small, private retreat at Origen Liencres, between the sea and the forest in Northern Spain.",
    facts: [["Group", "Up to 8 overnight guests"], ["Format", "Your group · your programme"], ["Arrival", "~25 min from Santander Airport"]],
    cta: "Send your proposal",
    introTitle: "From an idea to a considered stay.",
    intro: [
      "This guide is for facilitators and retreat leaders who already have a practice, community or group in mind. Origen combines accommodation, shared spaces and a nature-facing shala in one private setting.",
      "The first step is an enquiry, not an instant booking. Use the host form to discuss the fit, dates and practical conditions before opening your retreat to participants.",
    ],
    spaces: {
      eyebrow: "The process", title: "Three steps to hosting.",
      items: [
        ["Share your intention", "Tell us what you facilitate, who the retreat is for and the atmosphere you want to create. Explain the balance between practice, rest and time outside."],
        ["Outline the stay", "Suggest dates or a flexible date range, number of nights and the total overnight group. Include facilitators within the capacity of 8."],
        ["Review the fit together", "Confirm availability, rooming, use of the space and commercial terms. Wait for an agreed arrangement before promising dates to your group."],
      ],
    },
    planning: {
      eyebrow: "Your enquiry checklist", title: "A little preparation goes a long way.",
      items: [
        ["The people", "Participant numbers, overnight team, rooming preferences and any accessibility needs."],
        ["The practice", "Your outline schedule, equipment, sound, materials and the kind of space each session needs."],
        ["The logistics", "Meals, arrival times, transport and any support you would like to discuss. Confirm what is and is not included."],
        ["The agreement", "Ask for the price, payment schedule, cancellation conditions and confirmation of the dates and services."],
      ],
    },
    questions: [
      ["Can I bring my own programme?", "Yes. This enquiry is for organisers bringing their own programme and group. Share the format so we can review whether the venue suits it."],
      ["Does sending the form reserve dates?", "No. The form starts a conversation. Dates, price and booking conditions need to be confirmed separately."],
      ["Are meals, transfers and facilitation included?", "No package of these services is advertised here. Discuss your requirements and confirm the exact scope of your stay before booking."],
    ],
    closingTitle: "Let’s make space for your group.",
    closingBody: "Send your intention, possible dates and group size through the host form. A clear proposal helps us understand what you need.",
    serviceName: "Private retreat venue hire at Origen Liencres",
    serviceType: "Private retreat venue hire",
    alternate: "organizar-retiro",
  },
  "espacio-retiros": {
    language: "es",
    title: "Espacio para Retiros, Práctica y Grupos Privados | Origen",
    description: "Descubre qué tipo de retiro encaja en Origen: movimiento, bienestar, creación y encuentros íntimos. Casa y shala para grupos pequeños en Liencres, Cantabria.",
    navLabel: "Formatos y prácticas",
    eyebrow: "Espacio para retiros · Grupos pequeños",
    heading: "Un espacio. Muchas formas de reunir.",
    lead: "Cada grupo trae una intención diferente. Origen ofrece una casa y un espacio de práctica para dar forma a retiros íntimos, encuentros de embodiment y residencias creativas en Cantabria.",
    facts: [["Escala", "Hasta 8 personas alojadas"], ["Espacios", "Casa · zonas comunes · shala"], ["Entorno", "Mar y bosque · Liencres"]],
    cta: "Comparte tu idea",
    introTitle: "Primero la intención. Después el formato.",
    intro: [
      "Elegir un espacio de retiros también es elegir un ritmo. Una casa pequeña permite convivir entre sesiones, encontrarse sin prisas y mantener la continuidad del grupo durante toda la estancia.",
      "La shala, las zonas compartidas y el entorno natural ofrecen contextos distintos para practicar, conversar y descansar. El programa lo aporta quien organiza; la compatibilidad de cada propuesta se revisa antes de reservar.",
    ],
    spaces: {
      eyebrow: "Qué puedes proponer", title: "Distintas maneras de habitar Origen.",
      items: [
        ["Movimiento y embodiment", "Encuentros centrados en la experiencia corporal, la danza y la presencia. Comparte las necesidades de suelo, sonido y espacio de tu práctica."],
        ["Retiros de bienestar", "Programas de yoga, descanso o atención plena para grupos pequeños. Combina práctica y tiempo libre, ajustando las actividades exteriores al clima."],
        ["Residencias creativas", "Estancias autogestionadas para escribir, investigar o crear en compañía. Consulta de antemano cualquier necesidad técnica o de taller."],
        ["Encuentros de grupo", "Conversaciones, procesos compartidos y días de convivencia para una comunidad que busca intimidad. Explica el propósito y el tamaño del encuentro."],
      ],
    },
    planning: {
      eyebrow: "Para saber si encaja", title: "El espacio acompaña. No sustituye tu propuesta.",
      items: [
        ["Una escala íntima", "La capacidad de alojamiento es de 8 personas, incluyendo a quienes facilitan y se quedan a dormir."],
        ["Tu responsabilidad como organizador", "Prepara el contenido y los cuidados que necesita tu grupo. No se ofrece un equipo de facilitación incluido por defecto."],
        ["Condiciones de la práctica", "Indica necesidades de accesibilidad, privacidad, materiales o sonido para valorar el uso del espacio."],
        ["Tiempo fuera de las sesiones", "Deja margen para el descanso y la convivencia. La playa y el bosque permiten incorporar paseos cuando las condiciones acompañen."],
      ],
    },
    questions: [
      ["¿Puedo proponer un formato distinto?", "Sí. Describe la intención, las actividades, el número de personas y las necesidades para que podamos valorar si encaja."],
      ["¿Esta página vende plazas en un retiro?", "No. Está dirigida a quienes quieren organizar su propio encuentro y consultar el uso privado del espacio."],
      ["¿Dónde encuentro la capacidad y la ubicación?", "La ficha del espacio en Cantabria reúne los datos de alojamiento, shala, entorno y acceso. Puedes abrirla en los enlaces para organizadores al final de la página."],
    ],
    closingTitle: "¿Qué quieres reunir aquí?",
    closingBody: "No necesitas un programa cerrado para empezar. Comparte el propósito, las personas y las necesidades de tu encuentro.",
    serviceName: "Espacio para retiros y encuentros de grupos privados en Origen",
    serviceType: "Alquiler de espacio para retiros y prácticas de grupo",
  },
  "organizar-retiro": {
    language: "es",
    title: "Organizar un Retiro en Cantabria: Guía para Anfitriones | Origen",
    description: "Prepara tu retiro en Origen: fechas, grupo, alojamiento, práctica y logística. Guía para facilitadores que buscan un espacio privado cerca de Santander.",
    navLabel: "Cómo organizar tu retiro",
    eyebrow: "Para facilitadores y organizadores",
    heading: "Organiza tu retiro en Origen.",
    lead: "Tú aportas la intención. Nosotros, un lugar para reunir al grupo. Empieza a preparar un retiro íntimo en Liencres, Cantabria, entre el mar y el bosque.",
    facts: [["Grupo", "Hasta 8 personas alojadas"], ["Formato", "Tu grupo · tu programa"], ["Llegada", "~25 min del aeropuerto de Santander"]],
    cta: "Organiza tu retiro",
    introTitle: "De la idea a una estancia bien pensada.",
    intro: [
      "Esta guía es para facilitadores que tienen una práctica, una comunidad o un grupo en mente. Origen reúne alojamiento, zonas compartidas y una shala abierta a la naturaleza en un mismo espacio privado.",
      "El primer paso es una consulta, no una reserva inmediata. El formulario permite revisar el encaje, las fechas y las condiciones antes de abrir la convocatoria a participantes.",
    ],
    spaces: {
      eyebrow: "El proceso", title: "Tres pasos para dar forma al retiro.",
      items: [
        ["Comparte la intención", "Explica qué facilitas, para quién es el retiro y qué ambiente buscas. Cuéntanos cómo imaginas el equilibrio entre práctica, descanso y naturaleza."],
        ["Define la estancia", "Propón fechas o un periodo flexible, número de noches y total de personas alojadas. Incluye al equipo que duerme en la casa dentro de las 8 plazas."],
        ["Revisa el encaje", "Confirma disponibilidad, distribución, uso del espacio y condiciones económicas. Espera a tener un acuerdo antes de prometer fechas al grupo."],
      ],
    },
    planning: {
      eyebrow: "Prepara tu consulta", title: "La información que ayuda a organizar.",
      items: [
        ["Las personas", "Número de participantes y equipo, preferencias de alojamiento y necesidades de accesibilidad."],
        ["La práctica", "Un esquema de horarios, materiales, sonido y características del espacio que requiere cada sesión."],
        ["La logística", "Comidas, llegadas, desplazamientos y apoyos que quieras consultar. Confirma qué servicios se incluyen y cuáles no."],
        ["El acuerdo", "Solicita precio, calendario de pagos, condiciones de cancelación y confirmación de fechas y servicios."],
      ],
    },
    questions: [
      ["¿Puedo traer mi propio programa?", "Sí. Esta consulta está pensada para organizadores que aportan su programa y su grupo. Comparte el formato para valorar su encaje en el espacio."],
      ["¿El formulario reserva las fechas?", "No. Enviarlo inicia una conversación. Las fechas, el precio y las condiciones de reserva deben confirmarse por separado."],
      ["¿Se incluyen comidas, traslados y facilitación?", "Esta página no anuncia un paquete con esos servicios. Consulta tus necesidades y confirma el alcance concreto de la estancia antes de reservar."],
    ],
    closingTitle: "Hagamos espacio para tu grupo.",
    closingBody: "Envía tu intención, las fechas posibles y el tamaño del grupo. Una propuesta clara nos ayuda a entender lo que necesitas.",
    serviceName: "Alquiler privado de espacio para retiros en Origen Liencres",
    serviceType: "Alquiler privado de espacio para retiros",
    alternate: "host-your-retreat",
  },
};

export const organizerSlugs = Object.keys(organizerPages) as OrganizerSlug[];

export function organizerLanguageAlternates(slug: OrganizerSlug) {
  const page = organizerPages[slug];
  if (!page.alternate) return undefined;
  const alternate = organizerPages[page.alternate];
  return {
    [page.language === "es" ? "es-ES" : "en"]: `${PUBLIC_SITE_URL}/${slug}`,
    [alternate.language === "es" ? "es-ES" : "en"]: `${PUBLIC_SITE_URL}/${page.alternate}`,
  };
}

export function organizerMetadata(slug: OrganizerSlug): Metadata {
  const page = organizerPages[slug];
  const url = `${PUBLIC_SITE_URL}/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url, languages: organizerLanguageAlternates(slug) ?? {} },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", url, siteName: "Origen Liencres",
      title: page.title, description: page.description,
      locale: page.language === "es" ? "es_ES" : "en_GB",
      ...(page.alternate ? { alternateLocale: [page.language === "es" ? "en_GB" : "es_ES"] } : {}),
      images: [{ url: `${PUBLIC_SITE_URL}/og.png`, width: 1536, height: 1024, alt: "Origen Liencres" }],
    },
    twitter: {
      card: "summary_large_image", title: page.title, description: page.description,
      images: [`${PUBLIC_SITE_URL}/og.png`],
    },
  };
}
