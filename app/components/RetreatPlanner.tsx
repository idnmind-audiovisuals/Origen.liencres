"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { plannerDefaults, retreatChecklist, retreatPlan, type PlannerAnswers } from "../lib/retreat-planner";

const STORAGE_KEY = "origen-retreat-planner-v1";

type Question = {
  key: keyof PlannerAnswers;
  label: string;
  hint?: string;
  required?: boolean;
} & (
  { kind: "text" | "textarea" } |
  { kind: "number"; min: number; max: number; increment?: number } |
  { kind: "select"; options: readonly (readonly [string, string])[] }
);

const steps: { title: string; prompt: string; questions: Question[] }[] = [
  {
    title: "Propósito",
    prompt: "¿Qué quieres que cambie para quienes vengan?",
    questions: [
      { key: "name", label: "¿Cómo se llama tu retiro?", kind: "text" },
      { key: "audience", label: "¿Para quién es, concretamente?", hint: "Piensa en lo que están viviendo, no solo en su edad o profesión.", kind: "textarea", required: true },
      { key: "outcome", label: "¿Con qué cambio realista quieres que salgan?", hint: "Algo que puedan hacer, sentir o aplicar al volver a casa.", kind: "textarea", required: true },
      { key: "theme", label: "¿Cuál será el eje de la experiencia?", kind: "select", options: [["conexión", "Conexión y comunidad"], ["descanso", "Descanso y pausa"], ["creatividad", "Creatividad"], ["movimiento", "Movimiento y cuerpo"]] },
    ],
  },
  {
    title: "Formato",
    prompt: "¿Qué tamaño y ritmo necesita el grupo?",
    questions: [
      { key: "days", label: "¿Cuánto durará?", kind: "select", options: [["1", "1 día"], ["2", "2 días"], ["3", "3 días"], ["4+", "4 días o más"]] },
      { key: "capacity", label: "¿Cuántas personas participarán como máximo?", hint: "Origen aloja hasta 9 huéspedes. Si el equipo también duerme allí, cuéntalo aparte de las plazas que vendes.", kind: "number", min: 2, max: 100, required: true },
      { key: "group", label: "¿En qué punto están los vínculos del grupo?", kind: "select", options: [["nuevo", "La mayoría no se conoce"], ["mixto", "Algunas personas ya se conocen"], ["conocido", "El grupo ya se conoce"]] },
    ],
  },
  {
    title: "Experiencia",
    prompt: "¿Cómo vas a entregar ese valor?",
    questions: [
      { key: "practice", label: "¿Qué práctica o actividad sostendrá el retiro?", hint: "Si aún no lo tienes claro, te proponemos un ejercicio según el eje que elegiste.", kind: "textarea" },
      { key: "takeaway", label: "¿Qué se llevarán para la vida diaria?", hint: "Por ejemplo, un ejercicio grabado, una plantilla o una decisión que puedan poner en práctica.", kind: "textarea" },
      { key: "adaptations", label: "¿Qué alternativas ofrecerás si alguien necesita una pausa o no puede participar?", kind: "textarea" },
    ],
  },
  {
    title: "Convocatoria",
    prompt: "¿Dónde vas a encontrar a las personas adecuadas?",
    questions: [
      { key: "channel", label: "¿Qué canal puedes activar primero?", kind: "select", options: [["comunidad", "Mi comunidad o contactos"], ["redes", "Redes sociales"], ["alianzas", "Colaboraciones locales"], ["correo", "Lista de correo"]] },
      { key: "contact", label: "¿Cuál es tu primera acción concreta?", hint: "Ejemplo: escribir a dos estudios de yoga, o publicar una sesión de muestra.", kind: "textarea" },
    ],
  },
  {
    title: "Logística",
    prompt: "¿Qué necesitas confirmar antes de abrir plazas?",
    questions: [
      { key: "fixedCosts", label: "¿Cuánto estimas de gastos fijos para todo el retiro (€)?", hint: "Incluye el espacio, tu tiempo y el del equipo, entre otros.", kind: "number", min: 0, max: 100000, increment: 0.01 },
      { key: "variableCosts", label: "¿Cuánto cuesta cada participante adicional (€)?", hint: "Por ejemplo, sus comidas y materiales.", kind: "number", min: 0, max: 10000, increment: 0.01 },
      { key: "minimum", label: "¿Con cuántas plazas pagadas te planteas hacerlo?", kind: "number", min: 1, max: 100, required: true },
      { key: "logistics", label: "¿Qué necesitas resolver con el espacio o con el equipo?", hint: "Piensa en llegada, habitaciones, comidas, material y plan de lluvia.", kind: "textarea" },
    ],
  },
  {
    title: "Continuidad",
    prompt: "¿Cómo sostendrás lo vivido después de volver a casa?",
    questions: [
      { key: "followUp", label: "¿Qué seguimiento encaja con tu grupo?", kind: "select", options: [["encuentro", "Un reencuentro grupal"], ["parejas", "Parejas de seguimiento"], ["canal", "Un canal de comunidad"], ["individual", "Un correo y práctica individual"]] },
      { key: "commitment", label: "¿Qué compromiso pequeño propondrás para la primera semana?", kind: "textarea" },
    ],
  },
];

function PlannerField({ question, value, onChange }: { question: Question; value: string; onChange: (value: string) => void }) {
  const id = `planner-${question.key}`;
  const common = {
    id,
    value,
    required: question.required,
    "aria-describedby": question.hint ? `${id}-hint` : undefined,
  };
  return (
    <div className="retreat-planner-field">
      <label htmlFor={id}>{question.label}</label>
      {question.hint ? <p id={`${id}-hint`}>{question.hint}</p> : null}
      {question.kind === "select" ? (
        <select {...common} onChange={(event) => onChange(event.target.value)}>
          {question.options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}
        </select>
      ) : question.kind === "textarea" ? (
        <textarea {...common} rows={3} maxLength={480} onChange={(event) => onChange(event.target.value)} />
      ) : question.kind === "number" ? (
        <input {...common} type="number" min={question.min} max={question.max} step={question.increment ?? 1} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input {...common} type="text" maxLength={120} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

export function RetreatPlanner() {
  const [answers, setAnswers] = useState(plannerDefaults);
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [storage, setStorage] = useState<"loading" | "ready" | "unavailable">("loading");
  const heading = useRef<HTMLHeadingElement>(null);
  const focusOnMove = useRef(false);
  const activeStep = steps[step];

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      setAnswers(Object.fromEntries(
        Object.entries(plannerDefaults).map(([key, fallback]) => [
          key, typeof stored.answers?.[key] === "string" ? stored.answers[key] : fallback,
        ]),
      ) as PlannerAnswers);
      if (Number.isInteger(stored.step) && stored.step >= 0 && stored.step <= steps.length) setStep(stored.step);
      if (Array.isArray(stored.checked)) setChecked(stored.checked.filter((index: unknown) =>
        typeof index === "number" && Number.isInteger(index) && index >= 0 && index < retreatChecklist.length,
      ));
      setStorage("ready");
    } catch {
      setStorage("unavailable");
    }
  }, []);

  useEffect(() => {
    if (storage !== "ready") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step, checked }));
    } catch {
      setStorage("unavailable");
    }
  }, [answers, step, checked, storage]);

  useEffect(() => {
    if (!focusOnMove.current) return;
    heading.current?.focus();
    focusOnMove.current = false;
  }, [step]);

  function goTo(index: number) {
    focusOnMove.current = true;
    setStep(index);
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goTo(Math.min(step + 1, steps.length));
  }

  function exportPlan() {
    const title = answers.name.trim() || "Mi retiro";
    const text = [
      `# ${title}`,
      ...retreatPlan(answers).flatMap(({ title: section, lines }) => [`## ${section}`, ...lines]),
      "## Lista de preparación",
      ...retreatChecklist.map((item, index) => `- [${checked.includes(index) ? "x" : " "}] ${item}`),
    ].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-plan-de-retiro.md";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="retreat-planner-workspace" aria-label="Preguntas para organizar tu retiro">
      <div className="retreat-planner-progress">
        <p>{activeStep ? `Paso ${step + 1} de ${steps.length} · ${activeStep.title}` : "Plan listo para revisar"}</p>
        <progress max={steps.length} value={activeStep ? step : steps.length} aria-label="Pasos completados" />
      </div>
      {activeStep ? (
        <form key={step} onSubmit={next}>
          <h2 ref={heading} tabIndex={-1}>{activeStep.prompt}</h2>
          {activeStep.questions.map((question) => (
            <PlannerField key={question.key} question={question} value={answers[question.key]} onChange={(value) =>
              setAnswers((current) => ({ ...current, [question.key]: value }))
            } />
          ))}
          <div className="retreat-planner-actions">
            {step > 0 ? <button type="button" onClick={() => goTo(step - 1)}>Anterior</button> : null}
            <button type="submit" className="retreat-planner-primary">
              {step === steps.length - 1 ? "Ver mi plan" : "Siguiente"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2 ref={heading} tabIndex={-1}>{answers.name.trim() || "Tu plan de retiro"}</h2>
          <div className="retreat-planner-actions">
            <button type="button" onClick={exportPlan} className="retreat-planner-primary">Descargar mi plan</button>
            <button type="button" onClick={() => goTo(0)}>Editar respuestas</button>
          </div>
          <div className="retreat-planner-results">
            {retreatPlan(answers).map(({ title, lines }) => (
              <article key={title}><h3>{title}</h3>{lines.map((line) => <p key={line}>{line}</p>)}</article>
            ))}
          </div>
          <fieldset className="retreat-planner-checklist">
            <legend>Lista de preparación</legend>
            {retreatChecklist.map((item, index) => (
              <label key={item}>
                <input type="checkbox" checked={checked.includes(index)} onChange={(event) =>
                  setChecked((current) => event.target.checked ? [...current, index] : current.filter((key) => key !== index))
                } />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          <Link href="/retiros#reservar">Consultar disponibilidad de Origen</Link>
        </div>
      )}
      <p className="retreat-planner-storage">
        {storage === "unavailable" ? "El navegador no puede guardar el borrador. Descarga el plan antes de salir." : "El borrador se guarda solo en este navegador. No incluyas datos de tus participantes."}
      </p>
    </section>
  );
}
