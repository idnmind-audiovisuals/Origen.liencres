import type { Language } from "./language";

export const HOSTS_CIRCLE_SCHEDULE = {
  time: "17:00",
  timeZone: "Europe/Madrid",
  durationMinutes: 90,
} as const;

type CircleCopy = {
  title: string;
  description: string;
  back: string;
  accessGranted: string;
  header: string;
  values: string;
  hero: string;
  cadence: string;
  shortTime: string;
  timeZoneLabel: string;
  heroAction: string;
  manifestoTitle: string;
  manifestoLines: readonly string[];
  manifestoBody: readonly string[];
  meetingEyebrow: string;
  meetingTitle: readonly string[];
  when: string;
  time: string;
  where: string;
  online: string;
  meetingDetails: string;
  timeNote: string;
  flowEyebrow: string;
  flowTitle: string;
  flowIntro: string;
  minutes: string;
  flow: readonly { title: string; minutes: number; body: string; prompt: string }[];
  forEyebrow: string;
  forTitle: string;
  intentions: readonly string[];
  agreementsEyebrow: string;
  agreementsTitle: string;
  agreements: readonly (readonly [string, string])[];
  prepareEyebrow: string;
  prepareTitle: string;
  prepare: readonly (readonly [string, string])[];
  joinEyebrow: string;
  joinTitle: string;
  joinBody: string;
  formPending: string;
  formNote: string;
  venueLink: string;
  venueHref: string;
};

export const HOSTS_CIRCLE_COPY = {
  en: {
    title: "Retreat Organisers Circle — Origen Hosts",
    description: "A monthly online circle for retreat venue organisers to share challenges, celebrate successes and support one another. First Tuesday of every month, 5pm mainland Spain time.",
    back: "Origen — return to the gateway",
    accessGranted: "Access granted. Welcome to Origen Hosts.",
    header: "Retreat organisers · Online",
    values: "Connection · Support · Service",
    hero: "A circle for the people who bring others together.",
    cadence: "First Tuesday of every month",
    shortTime: "5pm",
    timeZoneLabel: "Mainland Spain time",
    heroAction: "About joining",
    manifestoTitle: "Who holds space for you?",
    manifestoLines: ["Bring what is working.", "Bring what is difficult.", "You don’t have to hold it all alone."],
    manifestoBody: [
      "Running a retreat space can be deeply meaningful — and demanding. Behind each gathering are decisions, responsibilities and questions that are easier to carry with people who understand.",
      "Origen Hosts is a monthly online meeting for retreat venue owners and organisers to exchange honestly, celebrate successes and support one another. A place to reconnect with why we do this work, and how we can create a more positive impact together.",
    ],
    meetingEyebrow: "A regular place to return to",
    meetingTitle: ["Once a month.", "Together."],
    when: "When",
    time: "Time",
    where: "Where",
    online: "Online",
    meetingDetails: "Meeting link to be shared",
    timeNote: "The meeting stays at 5pm in mainland Spain throughout the year, following the local daylight-saving changes. If you are joining from elsewhere, check the time difference for that date.",
    flowEyebrow: "A suggested 90-minute structure",
    flowTitle: "The monthly circle",
    flowIntro: "A familiar rhythm, with room for what is alive in the group. Time to listen, learn, ask and offer.",
    minutes: "minutes",
    flow: [
      {
        title: "Arrive & check in", minutes: 10,
        body: "A moment to land, put the day down and say how you are arriving. We begin with the person, not the business update.",
        prompt: "How are you, really?",
      },
      {
        title: "Share what is working", minutes: 15,
        body: "Celebrate a success, however small, and the lesson behind it. A thoughtful guest experience, a healthier team rhythm or something you finally made possible.",
        prompt: "What worked, and what did it teach you?",
      },
      {
        title: "Bring the real challenge", minutes: 30,
        body: "One or two people bring a current struggle for deeper attention. We rotate this space across meetings and listen before responding: uncertainty, workload, guest care or the responsibility of holding a venue.",
        prompt: "Where could you use another perspective?",
      },
      {
        title: "Offer support & serve", minutes: 25,
        body: "Ask what kind of support would help, then share relevant experience, a resource or an introduction with consent. Explore one way our work can better serve our guests, teams and local communities.",
        prompt: "What do you need, and what can you offer?",
      },
      {
        title: "Close with one next step", minutes: 10,
        body: "Name one realistic action or intention to carry into the month. Close with appreciation and return next time with what you learned.",
        prompt: "What will you take into practice?",
      },
    ],
    forEyebrow: "For the people behind the spaces",
    forTitle: "A place to be supported.",
    intentions: [
      "For venue owners and organisers who want meaningful connection with peers.",
      "For sharing the difficult parts as openly as the successful ones.",
      "For learning from experience, without pretending to have everything figured out.",
      "For supporting healthier ways to work, welcome guests and care for our teams.",
      "For giving something back, and serving our communities with greater intention.",
    ],
    agreementsEyebrow: "How we hold the space",
    agreementsTitle: "Our agreements",
    agreements: [
      ["Confidentiality", "Keep personal stories within the circle. No recordings or screenshots; remove identifying details when discussing guests or team members."],
      ["Listening before advice", "Ask whether someone wants listening, reflection or practical ideas. Speak from your own experience, without assuming you have their answer."],
      ["Equal space", "Share the time, respect each person’s boundaries and allow the option to pass. We can be honest without needing to prove ourselves."],
      ["Contribution", "Come ready to receive and to offer. Share useful experience generously; ask permission before following up or making an introduction."],
      ["Presence", "Join on time from a quiet place when possible. Put other tasks aside and give the people in the room your attention."],
      ["Care over promotion", "This is a peer-support circle, not a sales pitch. Let trust, respect and the wish to serve guide how we meet."],
    ],
    prepareEyebrow: "No presentation needed",
    prepareTitle: "Bring three things.",
    prepare: [
      ["One win.", "Something worth celebrating or a lesson worth passing on."],
      ["One challenge.", "A question you don’t need to hold on your own."],
      ["One offer.", "Some experience, encouragement or support you can give."],
    ],
    joinEyebrow: "Come as you are",
    joinTitle: "Let’s hold space for each other.",
    joinBody: "You don’t need a perfect venue, a polished story or all the answers. Come with a willingness to be honest, listen and contribute.",
    formPending: "Joining form coming soon",
    formNote: "Registration is not open yet. The form and participation details will be added here.",
    venueLink: "Discover the Origen venue",
    venueHref: "/retreat-venue-spain",
  },
  es: {
    title: "Círculo de organizadores de retiros — Origen Hosts",
    description: "Un círculo online mensual para compartir desafíos, celebrar logros y apoyarnos entre quienes gestionamos espacios de retiros. Primer martes de cada mes, a las 17:00, hora peninsular española.",
    back: "Origen — volver a la entrada",
    accessGranted: "Acceso concedido. Te damos la bienvenida a Origen Hosts.",
    header: "Organizadores de retiros · Online",
    values: "Conexión · Apoyo · Servicio",
    hero: "Un círculo para quienes crean espacios de encuentro.",
    cadence: "Primer martes de cada mes",
    shortTime: "17:00",
    timeZoneLabel: "Hora peninsular española",
    heroAction: "Cómo participar",
    manifestoTitle: "¿Quién sostiene tu espacio?",
    manifestoLines: ["Trae lo que está funcionando.", "Trae lo que está siendo difícil.", "No tienes que sostenerlo todo a solas."],
    manifestoBody: [
      "Gestionar un espacio de retiros puede ser profundamente significativo, y también exigente. Detrás de cada encuentro hay decisiones, responsabilidades y preguntas que se llevan mejor con personas que comprenden lo que implica.",
      "Origen Hosts es un encuentro online mensual para quienes gestionan espacios y organizan retiros: un lugar para compartir con honestidad, celebrar los logros y apoyarnos. Para reconectar con el sentido de lo que hacemos y explorar cómo generar un impacto más positivo juntos.",
    ],
    meetingEyebrow: "Un lugar al que volver",
    meetingTitle: ["Una vez al mes.", "En compañía."],
    when: "Cuándo",
    time: "Hora",
    where: "Dónde",
    online: "Online",
    meetingDetails: "Enlace del encuentro pendiente",
    timeNote: "El encuentro se mantiene a las 17:00, hora peninsular española, durante todo el año, siguiendo los cambios locales de horario de verano e invierno. Si te conectas desde otro lugar, comprueba la diferencia horaria para esa fecha.",
    flowEyebrow: "Una propuesta de 90 minutos",
    flowTitle: "El círculo mensual",
    flowIntro: "Un ritmo familiar, con espacio para lo que esté vivo en el grupo. Tiempo para escuchar, aprender, pedir y ofrecer.",
    minutes: "minutos",
    flow: [
      {
        title: "Llegar y conectar", minutes: 10,
        body: "Un momento para aterrizar, dejar el día atrás y compartir cómo llegamos. Empezamos por la persona, no por las novedades del negocio.",
        prompt: "¿Cómo estás, de verdad?",
      },
      {
        title: "Compartir lo que funciona", minutes: 15,
        body: "Celebrar un logro, por pequeño que sea, y lo aprendido en el proceso. Una experiencia cuidada para los huéspedes, un ritmo de equipo más saludable o algo que por fin has hecho posible.",
        prompt: "¿Qué ha funcionado y qué te ha enseñado?",
      },
      {
        title: "Dar espacio al desafío", minutes: 30,
        body: "Una o dos personas comparten una dificultad actual para recibir una atención más profunda. Rotamos este espacio entre encuentros y escuchamos antes de responder: incertidumbre, carga de trabajo, cuidado de los huéspedes o la responsabilidad de sostener un espacio.",
        prompt: "¿Dónde te ayudaría otra perspectiva?",
      },
      {
        title: "Ofrecer apoyo y servir", minutes: 25,
        body: "Preguntar qué tipo de apoyo sería útil y, con permiso, compartir una experiencia, un recurso o un contacto. Explorar una forma de servir mejor a nuestros huéspedes, equipos y comunidades locales.",
        prompt: "¿Qué necesitas y qué puedes ofrecer?",
      },
      {
        title: "Cerrar con un siguiente paso", minutes: 10,
        body: "Nombrar una acción o intención realista para el mes. Cerrar con agradecimiento y volver al siguiente encuentro con lo aprendido.",
        prompt: "¿Qué vas a llevar a la práctica?",
      },
    ],
    forEyebrow: "Para las personas detrás de los espacios",
    forTitle: "Un lugar donde recibir apoyo.",
    intentions: [
      "Para quienes gestionan espacios y organizan retiros y desean conectar de verdad con otras personas del sector.",
      "Para compartir las dificultades con la misma apertura que los logros.",
      "Para aprender de la experiencia, sin aparentar que lo tenemos todo resuelto.",
      "Para encontrar formas más saludables de trabajar, acoger a los huéspedes y cuidar a nuestros equipos.",
      "Para aportar y servir a nuestras comunidades con mayor intención.",
    ],
    agreementsEyebrow: "Cómo cuidamos el espacio",
    agreementsTitle: "Nuestros acuerdos",
    agreements: [
      ["Confidencialidad", "Las historias personales se quedan en el círculo. Sin grabaciones ni capturas; evitamos datos que identifiquen a huéspedes o miembros del equipo."],
      ["Escuchar antes de aconsejar", "Preguntamos si la otra persona necesita escucha, reflexión o ideas prácticas. Hablamos desde nuestra experiencia, sin asumir que tenemos su respuesta."],
      ["Espacio para cada persona", "Compartimos el tiempo, respetamos los límites y la posibilidad de no intervenir. Podemos ser honestos sin tener que demostrar nada."],
      ["Contribución", "Venimos dispuestos a recibir y a ofrecer. Compartimos nuestra experiencia con generosidad y pedimos permiso antes de contactar después o presentar a alguien."],
      ["Presencia", "Llegamos a tiempo y, cuando es posible, desde un lugar tranquilo. Dejamos otras tareas a un lado para ofrecer nuestra atención al grupo."],
      ["Cuidado antes que promoción", "Este es un círculo de apoyo entre profesionales, no un espacio de venta. Nos encontramos desde la confianza, el respeto y el deseo de servir."],
    ],
    prepareEyebrow: "Sin preparar una presentación",
    prepareTitle: "Trae tres cosas.",
    prepare: [
      ["Un logro.", "Algo que merezca celebrarse o un aprendizaje que compartir."],
      ["Un desafío.", "Una pregunta que no necesitas sostener a solas."],
      ["Un ofrecimiento.", "Una experiencia, unas palabras de ánimo o un apoyo que puedas dar."],
    ],
    joinEyebrow: "Ven tal como estás",
    joinTitle: "Sostengamos este espacio juntos.",
    joinBody: "No necesitas un espacio perfecto, una historia impecable ni todas las respuestas. Solo la disposición de compartir con honestidad, escuchar y contribuir.",
    formPending: "Formulario de participación próximamente",
    formNote: "Las inscripciones aún no están abiertas. Aquí añadiremos el formulario y los detalles de participación.",
    venueLink: "Conoce el espacio Origen",
    venueHref: "/espacio-retiros-cantabria",
  },
} as const satisfies Record<Language, CircleCopy>;
