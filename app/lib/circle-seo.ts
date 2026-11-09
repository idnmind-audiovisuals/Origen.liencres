export type CircleFaq = {
  question: string;
  answer: string;
};

export const MEN_CIRCLE_TITLE =
  "Círculo de hombres en Cantabria | Origen Bros";
export const MEN_CIRCLE_DESCRIPTION =
  "Círculo semanal de hombres en Origen Liencres, Cantabria: honestidad, responsabilidad, apoyo y accountability. Consulta el horario y solicita acceso.";

export const WOMEN_CIRCLE_TITLE =
  "Círculo de mujeres en Cantabria | Origen Liencres";
export const WOMEN_CIRCLE_DESCRIPTION =
  "Círculo semanal de mujeres en Origen Liencres, Cantabria. Cada martes de 18:00 a 20:00: presencia, escucha, cuidado y comunidad.";

export const MEN_CIRCLE_FAQS: readonly CircleFaq[] = [
  {
    question: "¿Qué es el círculo de hombres de Origen?",
    answer:
      "Es un grupo semanal de hombres en Liencres para hablar con honestidad, asumir responsabilidad y construir relaciones más profundas desde el respeto y la presencia.",
  },
  {
    question: "¿Dónde se reúne el círculo?",
    answer:
      "Nos encontramos en Origen, en Liencres, Cantabria, cerca de Santander y de la costa de Costa Quebrada.",
  },
  {
    question: "¿Cuándo son los encuentros?",
    answer:
      "El grupo se reúne cada semana. El encuentro de accountability es los martes a las 7:30; el horario exacto del círculo se confirma dentro del grupo.",
  },
  {
    question: "¿Necesito experiencia previa?",
    answer:
      "No necesitas experiencia previa en círculos de hombres. Solo disposición para presentarte con honestidad, escuchar y participar con respeto.",
  },
] as const;

export const WOMEN_CIRCLE_FAQS: readonly CircleFaq[] = [
  {
    question: "¿Qué es el círculo de mujeres de Origen?",
    answer:
      "Es un encuentro semanal entre mujeres para volver al cuerpo, compartir con honestidad y crear vínculos desde la presencia, el cuidado y la escucha.",
  },
  {
    question: "¿Dónde y cuándo nos encontramos?",
    answer:
      "Cada martes de 18:00 a 20:00 en Origen, en Liencres, Cantabria, cerca de Santander y de Costa Quebrada.",
  },
  {
    question: "¿Qué hacemos durante el círculo?",
    answer:
      "Comenzamos con respiración y presencia corporal, abrimos un espacio de palabra y escucha sin juicio y cerramos con una intención para la semana.",
  },
  {
    question: "¿Cómo puedo participar?",
    answer:
      "Puedes acceder al grupo de WhatsApp desde el botón Quiero participar para conocer los próximos encuentros y hablar con la persona que sostiene el círculo.",
  },
] as const;

