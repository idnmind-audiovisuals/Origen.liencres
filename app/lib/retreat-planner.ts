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
  connection: "escucha",
  channel: "comunidad",
  audienceWhere: "",
  obstacle: "",
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

const themeTips: Record<string, string> = {
  conexión: "Propón un objetivo concreto: que al salir cada persona sepa con quién le gustaría seguir en contacto.",
  descanso: "Deja un bloque libre y ofrece una práctica de descanso que puedan repetir en casa.",
  creatividad: "Propón un resultado pequeño: un primer boceto que puedan retomar al volver.",
  movimiento: "Ofrece dos intensidades y haz que una práctica se pueda repetir en casa.",
};

const connectionExercises: Record<string, string> = {
  escucha: "En parejas, cada persona tiene tres minutos para contar qué le gustaría llevarse. La otra escucha y devuelve una frase de lo que entendió, sin interpretar ni aconsejar.",
  colaboración: "En tríos, dad diez minutos para crear algo juntos: un mapa de ideas, un pequeño recorrido o una solución a un reto sencillo. Cerrad con lo que aportó cada persona.",
  convivencia: "Reserva 25 minutos sin programa para comer o pasear juntos. Abre con una pregunta ligera: «¿Qué te está dando energía últimamente?». Deja que la conversación siga sola.",
};

const obstacleTips: Record<string, string> = {
  tiempo: "Explica con precisión cuándo empieza y termina, qué compromisos previos hay y cuánto tiempo necesitan reservar.",
  precio: "Desglosa lo que incluye el precio, lo que se paga aparte y las condiciones antes de pedir una señal.",
  "venir-solo": "Cuenta cómo son la bienvenida y la primera dinámica. Aclara si es normal venir sin conocer a nadie.",
  experiencia: "Di qué nivel hace falta, qué alternativas hay y qué pueden esperar en la primera actividad.",
  desplazamiento: "Incluye opciones para llegar, horarios orientativos y si se puede coordinar el trayecto entre participantes.",
};

const knownGroupTips: Record<string, string> = {
  nuevo: "Empieza en parejas; compartir con el grupo puede ser opcional.",
  mixto: "Mezcla en tríos a quienes se conocen con quienes llegan por primera vez.",
  conocido: "Cambia las parejas habituales para abrir conversaciones nuevas.",
};

const connectionTips: Record<string, string> = {
  escucha: "Alterna tres minutos de escucha en parejas, sin interrumpir ni aconsejar.",
  colaboración: "Da diez minutos para crear algo juntos en tríos.",
  convivencia: "Reserva 25 minutos para comer o pasear juntos sin programa.",
};

const outreachTips: Record<string, string> = {
  comunidad: "Invita personalmente a cinco personas antes de publicar.",
  redes: "Muestra una práctica real y enlaza a un formulario de interés.",
  alianzas: "Ofrece una sesión de muestra a dos comunidades afines.",
  correo: "Envía un correo de invitación y otro para resolver dudas.",
};

const followUpTips: Record<string, string> = {
  encuentro: "Deja agendado un encuentro opcional a las dos semanas.",
  parejas: "Invita a elegir una pareja de seguimiento y acordar dos contactos.",
  canal: "Abre un canal voluntario con un propósito y fecha de cierre.",
  individual: "Envía una práctica al día siguiente y una pregunta a las dos semanas.",
};

function filled(text: string, fallback: string) {
  return text.trim() || fallback;
}

function costPerSeat(answers: PlannerAnswers) {
  const fixed = Number(answers.fixedCosts);
  const variable = Number(answers.variableCosts);
  const minimum = Number(answers.minimum);
  const capacity = Number(answers.capacity);
  const hasCosts = Boolean(answers.fixedCosts.trim() || answers.variableCosts.trim());
  if (!hasCosts || ![fixed, variable, minimum, capacity].every(Number.isFinite)
    || fixed < 0 || variable < 0 || minimum < 1 || minimum > capacity) return null;
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(fixed / minimum + variable);
}

export function plannerTips(answers: PlannerAnswers) {
  const cost = costPerSeat(answers);
  return {
    purpose: themeTips[answers.theme] ?? themeTips.conexión,
    format: Number(answers.capacity) > 12
      ? "En grupos de más de 12, divide en grupos pequeños y asigna un apoyo a cada uno."
      : knownGroupTips[answers.group] ?? knownGroupTips.nuevo,
    experience: `${connectionTips[answers.connection] ?? connectionTips.escucha} ${answers.takeaway.trim() ? "Probad el recurso antes de la despedida." : ""}`.trim(),
    outreach: obstacleTips[answers.obstacle] ?? outreachTips[answers.channel] ?? outreachTips.comunidad,
    logistics: Number(answers.minimum) > Number(answers.capacity)
      ? "El mínimo de plazas pagadas no puede ser mayor que el aforo."
      : cost
        ? `${cost} por plaza para cubrir gastos, sin margen ni impuestos.`
        : "Fija una fecha para decidir si hay suficientes plazas confirmadas.",
    continuity: followUpTips[answers.followUp] ?? followUpTips.encuentro,
  };
}

export function retreatToolbox(answers: PlannerAnswers) {
  const name = filled(answers.name, "[nombre del retiro]");
  const audience = filled(answers.audience, "[a quién va dirigido]");
  const outcome = filled(answers.outcome, "[resultado que quieres facilitar]");
  const invitation = [
    name,
    `Para quién: ${audience}`,
    `Qué podrás practicar o llevarte: ${outcome}`,
    "Cuándo y dónde: [fechas y lugar]",
    "Precio y qué incluye: [importe, alojamiento, comidas y materiales]",
  ];
  const invitationByChannel: Record<string, string[]> = {
    comunidad: ["Hola, [nombre]. Me acordé de ti mientras preparaba este retiro.", ...invitation, "Si te interesa, responde a este mensaje y te envío el programa."],
    redes: [`${name} · Próximas fechas`, ...invitation.slice(1), "Si te encaja, deja tu interés aquí: [enlace]."],
    alianzas: ["Hola, [nombre]. Busco una comunidad a la que le pueda servir esta propuesta. ¿Te encaja compartirla?", ...invitation, "Si quieres conocer la práctica antes, podemos preparar una sesión breve de muestra."],
    correo: [`Asunto: ${name} · fechas y programa`, ...invitation, "Responde con tus dudas o consulta los detalles en [enlace]."],
  };
  return [
    { id: "invitation", title: "Invitación para tu canal", text: (invitationByChannel[answers.channel] ?? invitationByChannel.comunidad).join("\n") },
    { id: "welcome", title: "Mensaje de bienvenida", text: [
      `Hola, [nombre]. Nos vemos en ${name}. La llegada es a [hora] en [lugar]. Trae [material] y reserva [hora de salida].`,
      "Antes de llegar: ¿qué haría que este retiro mereciera la pena para ti? Si necesitas alguna adaptación, cuéntamelo por privado en [contacto]. Puedes elegir cómo participar en cada práctica.",
    ].join("\n\n") },
    { id: "connection", title: "Guion para crear vínculo", text: [
      "Acuerdo de entrada: escuchamos sin interrumpir, hablamos en primera persona y respetamos lo que cada quien decida no compartir.",
      `Rompehielos: ${openingExercises[answers.group] ?? openingExercises.nuevo}`,
      `Dinámica de conexión: ${connectionExercises[answers.connection] ?? connectionExercises.escucha}`,
      "Cierre: «¿Qué te ayudó a sentirte parte del grupo y qué harías distinto mañana?»",
    ].join("\n\n") },
    { id: "follow-up", title: "Seguimiento después del retiro", text: [
      `Gracias por compartir ${name}. Estos días trabajamos en: ${outcome}.`,
      `Para retomarlo en casa: ${filled(answers.takeaway, "[recurso o práctica del retiro]")}.`,
      `Primer compromiso: ${filled(answers.commitment, "Elige una acción de 15 minutos y ponle día y hora")}.`,
      "¿Qué te sirvió más y qué cambiarías?",
      `Para organizar el seguimiento: ${continuity[answers.followUp] ?? continuity.encuentro}`,
    ].join("\n\n") },
  ];
}

export const retreatChecklist = [
  "Confirma el espacio, las fechas y el número total de personas, incluido el equipo.",
  "Define qué incluye la estancia, el precio y las condiciones de pago y cancelación.",
  "Prepara la página o formulario de interés y deja clara la forma de confirmar plaza.",
  "Acuerda con el espacio las necesidades de accesibilidad, comida, montaje y llegada.",
  "Prepara un plan interior para mal tiempo y un protocolo de contacto para imprevistos.",
  "Explica al grupo qué es opcional, qué se comparte y cómo se harán las fotos, si las hay.",
  "Reserva tiempo para pedir feedback y dar seguimiento durante las dos semanas siguientes.",
  "Fija una fecha para decidir si hay suficientes plazas confirmadas y avisa al equipo.",
  "Prueba la dinámica de bienvenida y el recurso que quieres entregar antes del retiro.",
];

export function retreatPlan(answers: PlannerAnswers) {
  const value = filled;
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

  const minimum = Number(answers.minimum);
  const capacity = Number(answers.capacity);
  const hasCosts = Boolean(answers.fixedCosts.trim() || answers.variableCosts.trim());
  const cost = costPerSeat(answers);
  const costLine = cost
    ? `Coste estimado: ${cost} por plaza con ${minimum} plazas pagadas. Es el coste de cubrir gastos, antes de margen e impuestos.`
    : hasCosts
      ? "Revisa los gastos y el mínimo de plazas pagadas: los importes no pueden ser negativos y las plazas deben caber en el aforo."
      : "Antes de poner precio, suma alquiler, facilitación, comidas, material, seguros y un margen para imprevistos. Calcula con el mínimo de plazas pagadas, no con el aforo completo.";

  return [
    { title: "Propósito y valor", lines: [`Para: ${audience}.`, `Al terminar: ${outcome}.`, `Lo que se llevan: ${takeaway}. Antes del encuentro, pregunta: «¿Qué haría que este retiro valiera la pena para ti?». Contrasta esa respuesta con lo que propones.`] },
    { title: "Programa y rompehielos", lines: [agenda, `Primera dinámica: ${openingExercises[answers.group] ?? openingExercises.nuevo}`, `Práctica central: ${practice}`, `Adaptaciones: ${value(answers.adaptations, "Ofrece pausas, una opción de observar y una forma de compartir necesidades en privado")}. Nadie tiene que contar algo personal ni participar en una práctica que no quiere hacer.`] },
    { title: "Vínculos y comunidad", lines: [connectionExercises[answers.connection] ?? connectionExercises.escucha, "Antes: pregunta por expectativas y explica qué es opcional. Durante: alterna parejas y pequeños grupos. Al salir: ofrece una forma voluntaria de mantener el contacto."] },
    { title: "Encuentra a tus participantes", lines: [outreach[answers.channel] ?? outreach.comunidad, `Dónde encontrarlos: ${value(answers.audienceWhere, "Identifica dos comunidades reales donde el perfil que describiste ya participe")}.`, obstacleTips[answers.obstacle] ?? "Comprueba qué duda se repite antes de escribir la convocatoria.", `Primer contacto: ${value(answers.contact, "Anota tres personas o comunidades a las que puedas escribir esta semana")}.`, "Una semana después, comparte una muestra de la experiencia, responde las dudas que hayan surgido e indica cuándo se cierran las plazas."] },
    { title: "Números y logística", lines: [costLine, capacity > 9 ? "Origen aloja hasta 9 huéspedes. Si tu grupo duerme en la casa, incluye al equipo en ese total y consulta alternativas antes de confirmar." : "Si organizas en Origen, confirma con el espacio cuántas personas dormirán en la casa, incluido el equipo.", `Pendiente de resolver: ${value(answers.logistics, "Llegadas, comidas, materiales y plan alternativo si llueve")}.`] },
    { title: "Crea continuidad", lines: [continuity[answers.followUp] ?? continuity.encuentro, `Compromiso de salida: ${value(answers.commitment, "Que cada persona elija una acción de 15 minutos para su primera semana")}.`, "Pide feedback con dos preguntas: «¿Qué te sirvió más?» y «¿Qué cambiarías?». Usa las respuestas para tu siguiente edición."] },
  ];
}
