export const plannerDefaults = {
  name: "",
  audience: "",
  outcome: "",
  theme: "conexión",
  days: "3",
  group: "nuevo",
  capacity: "8",
  practice: "",
  takeaway: "",
  adaptations: "",
  channel: "comunidad",
  contact: "",
  fixedCosts: "",
  variableCosts: "",
  minimum: "6",
  logistics: "",
  followUp: "encuentro",
  commitment: "",
};

export type PlannerAnswers = typeof plannerDefaults;

const openingExercises: Record<string, string> = {
  nuevo: "Dos minutos por persona en parejas: «¿Qué me trae aquí y qué me ayudaría a estar a gusto?». Después, cada quien comparte solo lo que quiera con el grupo.",
  mixto: "Forma tríos mezclando a quienes ya se conocen con quienes llegan por primera vez. En seis minutos, encontrad algo que compartís y algo que os hace distintos.",
  conocido: "Ronda breve: «¿Qué ha cambiado desde la última vez que nos vimos y qué necesito del grupo hoy?». Hablad en primera persona, sin dar consejos.",
};

const themeExercises: Record<string, string> = {
  conexión: "En parejas, dedica cinco minutos a escuchar sin interrumpir. Antes de cambiar de turno, pregunta: «¿Quieres que te escuche o que te ofrezca una idea?».",
  descanso: "Propón un paseo tranquilo y opcional. Al volver, pide que cada persona identifique una forma concreta de hacer más espacio en su semana.",
  creatividad: "Haz una ronda de ideas de diez minutos sin evaluar. Cada persona elige una idea pequeña para probar y comparte qué aprendió, no qué salió perfecto.",
  movimiento: "Empieza con movilidad suave y una alternativa sentada o de observación. Que cada persona elija su intensidad antes de aumentar el ritmo.",
};

const outreach: Record<string, string> = {
  comunidad: "Empieza por tu comunidad: invita personalmente a 10 personas para las que el propósito sea relevante y pide a dos personas de confianza que compartan la convocatoria.",
  redes: "Publica un ejemplo concreto de lo que se vivirá: una práctica, un resultado realista y el tamaño del grupo. Vincúlalo a un formulario breve de interés y responde por mensaje.",
  alianzas: "Elige tres estudios, asociaciones o comunidades afines. Ofréceles una sesión de muestra o una charla breve y dales un texto listo para compartir.",
  correo: "Envía un primer correo contando para quién es y qué se lleva. Una semana después, resuelve las dudas sobre programa, precio y alojamiento en un segundo correo.",
};

const continuity: Record<string, string> = {
  encuentro: "Envía un resumen al día siguiente y ofrece un encuentro opcional a las dos semanas para compartir qué han puesto en práctica.",
  parejas: "Deja que cada persona elija si quiere una pareja de seguimiento. Acordad una pregunta y dos fechas de contacto, sin obligar a nadie a compartir su número.",
  canal: "Invita a un canal voluntario con un propósito claro: compartir avances y recursos. Explica quién lo modera y cuándo dejará de estar activo.",
  individual: "Envía un correo con la práctica acordada al día siguiente y una pregunta de seguimiento a las dos semanas. No hace falta abrir un grupo.",
};

export const retreatChecklist = [
  "Confirma el espacio, las fechas y el número total de personas, incluido el equipo.",
  "Define qué incluye la estancia, el precio y las condiciones de pago y cancelación.",
  "Prepara la página o formulario de interés y deja clara la forma de confirmar plaza.",
  "Acuerda con el espacio las necesidades de accesibilidad, comida, montaje y llegada.",
  "Prepara un plan interior para mal tiempo y un protocolo de contacto para imprevistos.",
  "Explica al grupo qué es opcional, qué se comparte y cómo se harán las fotos, si las hay.",
  "Reserva tiempo para pedir feedback y dar seguimiento durante las dos semanas siguientes.",
];

export function retreatPlan(answers: PlannerAnswers) {
  const value = (text: string, fallback: string) => text.trim() || fallback;
  const audience = value(answers.audience, "el grupo al que quieres acompañar");
  const outcome = value(answers.outcome, "un cambio concreto que puedan llevar a casa");
  const takeaway = value(answers.takeaway, "una práctica breve que puedan repetir sin ayuda");
  const practice = value(answers.practice, themeExercises[answers.theme] ?? themeExercises.conexión);
  const agenda = answers.days === "1"
    ? "Inicio: 30 min para llegar, acordar cómo participar y romper el hielo. Bloque central: práctica de 60–90 min con pausa. Cierre: cada persona elige un próximo paso y recibe el recurso para repetirlo."
    : answers.days === "2"
      ? "Día 1: llegada, presentación en pequeño grupo y práctica central. Día 2: recuperación, segunda práctica aplicada y cierre con un compromiso concreto."
      : answers.days === "4+"
        ? "Día 1: llegada y acuerdos. Días intermedios: un bloque central cada mañana, tiempo libre y prácticas opcionales. Último día: recogida de aprendizajes y próximos pasos."
        : "Día 1: llegar y crear confianza, sin sobrecargar el programa. Día 2: práctica central, descanso y una actividad de conexión. Día 3: aplicar lo aprendido, compartir próximos pasos y despedirse.";

  const fixed = Number(answers.fixedCosts);
  const variable = Number(answers.variableCosts);
  const minimum = Number(answers.minimum);
  const capacity = Number(answers.capacity);
  const hasCosts = Boolean(answers.fixedCosts.trim() || answers.variableCosts.trim());
  const costLine = hasCosts && [fixed, variable, minimum].every(Number.isFinite) && minimum > 0 && minimum <= capacity
    ? `Coste estimado: ${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(fixed / minimum + variable)} por plaza con ${minimum} plazas pagadas. Es el coste de cubrir gastos, antes de margen e impuestos.`
    : hasCosts
      ? "Revisa el mínimo de plazas pagadas: debe ser mayor que cero y no superar el tamaño del grupo."
      : "Antes de poner precio, suma alquiler, facilitación, comidas, material, seguros y un margen para imprevistos. Calcula con el mínimo de plazas pagadas, no con el aforo completo.";

  return [
    { title: "Propósito y valor", lines: [`Para: ${audience}.`, `Al terminar: ${outcome}.`, `Lo que se llevan: ${takeaway}. Antes del encuentro, pregunta: «¿Qué haría que este retiro valiera la pena para ti?». Contrasta esa respuesta con lo que propones.`] },
    { title: "Programa y rompehielos", lines: [agenda, `Primera dinámica: ${openingExercises[answers.group] ?? openingExercises.nuevo}`, `Práctica central: ${practice}`, `Adaptaciones: ${value(answers.adaptations, "Ofrece pausas, una opción de observar y una forma de compartir necesidades en privado")}. Nadie tiene que contar algo personal ni participar en una práctica que no quiere hacer.`] },
    { title: "Encuentra a tus participantes", lines: [outreach[answers.channel] ?? outreach.comunidad, `Primer contacto: ${value(answers.contact, "Anota tres personas o comunidades a las que puedas escribir esta semana")}.`, `Borrador de invitación: «${value(answers.name, "Este retiro")} es para ${audience}. Queremos ayudarte a lograr ${outcome}. Será un grupo de hasta ${answers.capacity} personas. ¿Te gustaría recibir el programa, las fechas y el precio?»`] },
    { title: "Números y logística", lines: [costLine, capacity > 9 ? "Origen aloja hasta 9 huéspedes. Si tu grupo duerme en la casa, incluye al equipo en ese total y consulta alternativas antes de confirmar." : "Si organizas en Origen, confirma con el espacio cuántas personas dormirán en la casa, incluido el equipo.", `Pendiente de resolver: ${value(answers.logistics, "Llegadas, comidas, materiales y plan alternativo si llueve")}.`] },
    { title: "Crea continuidad", lines: [continuity[answers.followUp] ?? continuity.encuentro, `Compromiso de salida: ${value(answers.commitment, "Que cada persona elija una acción de 15 minutos para su primera semana")}.`, "Pide feedback con dos preguntas: «¿Qué te sirvió más?» y «¿Qué cambiarías?». Usa las respuestas para tu siguiente edición."] },
  ];
}
