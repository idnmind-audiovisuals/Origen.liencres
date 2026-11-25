"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { plannerDefaults, plannerTips, retreatChecklist, retreatPlan, retreatToolbox, type PlannerAnswers } from "../lib/retreat-planner";

const STORAGE_KEY = "origen-retreat-planner-v1";

type Question = {
  key: keyof PlannerAnswers;
  label: string;
  required?: boolean;
  extra?: boolean;
} & (
  { kind: "text" | "textarea" } |
  { kind: "number"; min: number; max: number; increment?: number } |
  { kind: "select"; options: readonly (readonly [string, string])[] }
);

const steps: { id: keyof ReturnType<typeof plannerTips>; title: string; prompt: string; questions: Question[] }[] = [
  {
    id: "purpose",
    title: "Propósito",
    prompt: "¿Para quién es?",
    questions: [
      { key: "audience", label: "Participante ideal", kind: "textarea", required: true },
      { key: "outcome", label: "¿Con qué quieres que salga?", kind: "textarea", required: true },
      { key: "theme", label: "Tema", kind: "select", options: [["conexión", "Conexión y comunidad"], ["descanso", "Descanso y pausa"], ["creatividad", "Creatividad"], ["movimiento", "Movimiento y cuerpo"]] },
      { key: "name", label: "Nombre del retiro", kind: "text", extra: true },
    ],
  },
  {
    id: "format",
    title: "Formato",
    prompt: "¿Cómo será?",
    questions: [
      { key: "days", label: "¿Cuánto durará?", kind: "select", options: [["1", "1 día"], ["2", "2 días"], ["3", "3 días"], ["4+", "4 días o más"]] },
      { key: "capacity", label: "Máximo de participantes", kind: "number", min: 2, max: 100, required: true },
      { key: "group", label: "¿Ya se conocen?", kind: "select", options: [["nuevo", "La mayoría no se conoce"], ["mixto", "Algunas personas ya se conocen"], ["conocido", "El grupo ya se conoce"]] },
    ],
  },
  {
    id: "experience",
    title: "Experiencia",
    prompt: "¿Qué se llevan?",
    questions: [
      { key: "takeaway", label: "Un recurso para llevar a casa", kind: "textarea" },
      { key: "connection", label: "¿Cómo se conocerá el grupo?", kind: "select", options: [["escucha", "Conversaciones guiadas"], ["colaboración", "Una actividad colaborativa"], ["convivencia", "Tiempo para compartir sin programa"]] },
      { key: "practice", label: "Actividad principal", kind: "textarea", extra: true },
      { key: "adaptations", label: "Pausas y alternativas", kind: "textarea", extra: true },
    ],
  },
  {
    id: "outreach",
    title: "Convocatoria",
    prompt: "¿Cómo llenarás las plazas?",
    questions: [
      { key: "channel", label: "Primer canal", kind: "select", options: [["comunidad", "Mi comunidad o contactos"], ["redes", "Redes sociales"], ["alianzas", "Colaboraciones locales"], ["correo", "Lista de correo"]] },
      { key: "obstacle", label: "¿Qué les frenaría?", kind: "select", options: [["", "Aún no lo sé"], ["tiempo", "Tiempo o fechas"], ["precio", "Precio"], ["venir-solo", "Venir sin conocer a nadie"], ["experiencia", "No tener experiencia previa"], ["desplazamiento", "Cómo llegar"]] },
      { key: "audienceWhere", label: "¿Dónde se reúnen ya?", kind: "textarea", extra: true },
      { key: "contact", label: "Primera acción", kind: "textarea", extra: true },
    ],
  },
  {
    id: "logistics",
    title: "Logística",
    prompt: "¿Qué necesitas cubrir?",
    questions: [
      { key: "fixedCosts", label: "Gastos fijos (€)", kind: "number", min: 0, max: 100000, increment: 0.01 },
      { key: "variableCosts", label: "Gasto por persona (€)", kind: "number", min: 0, max: 10000, increment: 0.01 },
      { key: "minimum", label: "Mínimo de plazas pagadas", kind: "number", min: 1, max: 100, required: true },
      { key: "logistics", label: "Pendientes con el espacio", kind: "textarea", extra: true },
    ],
  },
  {
    id: "continuity",
    title: "Continuidad",
    prompt: "¿Qué pasa después?",
    questions: [
      { key: "followUp", label: "Seguimiento", kind: "select", options: [["encuentro", "Un reencuentro grupal"], ["parejas", "Parejas de seguimiento"], ["canal", "Un canal de comunidad"], ["individual", "Un correo y práctica individual"]] },
      { key: "commitment", label: "Un primer compromiso", kind: "textarea" },
    ],
  },
];

function PlannerField({ question, value, onChange }: { question: Question; value: string; onChange: (value: string) => void }) {
  const id = `planner-${question.key}`;
  const common = {
    id,
    value,
    required: question.required,
  };
  return (
    <div className="retreat-planner-field">
      <label htmlFor={id}>{question.label}</label>
      {question.kind === "select" ? (
        <select {...common} onChange={(event) => onChange(event.target.value)}>
          {question.options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}
        </select>
      ) : question.kind === "textarea" ? (
        <textarea {...common} rows={2} maxLength={480} onChange={(event) => onChange(event.target.value)} />
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
  const [copyStatus, setCopyStatus] = useState("");
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "loading" | "error">("idle");
  const heading = useRef<HTMLHeadingElement>(null);
  const focusOnMove = useRef(false);
  const activeStep = steps[step];
  const toolbox = activeStep ? [] : retreatToolbox(answers);

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
    setCopyStatus("");
    setStep(index);
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goTo(Math.min(step + 1, steps.length));
  }

  async function exportPlan() {
    setDownloadStatus("loading");
    try {
      const { createRetreatPlanPdf } = await import("../lib/retreat-plan-pdf");
      const bytes = await createRetreatPlanPdf(answers, checked);
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "origen-mi-plan-de-retiro.pdf";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadStatus("idle");
    } catch {
      setDownloadStatus("error");
    }
  }

  function renderField(question: Question) {
    return (
      <PlannerField key={question.key} question={question} value={answers[question.key]} onChange={(value) =>
        setAnswers((current) => ({ ...current, [question.key]: value }))
      } />
    );
  }

  async function copyTool(title: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${title}: texto copiado.`);
    } catch {
      setCopyStatus("No se pudo copiar. Puedes seleccionar el texto o descargar el plan.");
    }
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
          {activeStep.questions.filter((question) => !question.extra).map(renderField)}
          {activeStep.questions.some((question) => question.extra) ? (
            <details className="retreat-planner-extra">
              <summary>Añadir detalles</summary>
              {activeStep.questions.filter((question) => question.extra).map(renderField)}
            </details>
          ) : null}
          <aside className="retreat-planner-tip" aria-labelledby="planner-tip-heading">
            <h3 id="planner-tip-heading">Tu consejo</h3>
            <p aria-live="polite">{plannerTips(answers)[activeStep.id]}</p>
          </aside>
          <div className="retreat-planner-actions">
            {step > 0 ? <button type="button" onClick={() => goTo(step - 1)}>Atrás</button> : null}
            <button type="submit" className="retreat-planner-primary">
              {step === steps.length - 1 ? "Ver mi plan" : "Siguiente"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2 ref={heading} tabIndex={-1}>{answers.name.trim() || "Tu plan de retiro"}</h2>
          <div className="retreat-planner-actions">
            <button type="button" onClick={() => void exportPlan()} disabled={downloadStatus === "loading"} className="retreat-planner-primary">
              {downloadStatus === "loading" ? "Preparando PDF…" : "Descargar mi plan (PDF)"}
            </button>
            <button type="button" onClick={() => goTo(0)}>Editar</button>
          </div>
          {downloadStatus === "error" ? <p className="retreat-planner-copy-status" role="status">No se pudo descargar. Vuelve a intentarlo.</p> : null}
          <div className="retreat-planner-results">
            {retreatPlan(answers).map(({ title, lines }, index) => (
              <details key={title} className="retreat-planner-result" open={index === 0}>
                <summary>{title}</summary>
                {lines.map((line) => <p key={line}>{line}</p>)}
              </details>
            ))}
          </div>
          <section className="retreat-planner-tools" aria-labelledby="planner-tools-title">
            <h3 id="planner-tools-title">Plantillas para tu retiro</h3>
            {toolbox.map((tool) => (
              <details key={tool.id} className="retreat-planner-tool">
                <summary>{tool.title}</summary>
                <p>{tool.text}</p>
                <button type="button" aria-label={`Copiar: ${tool.title}`} onClick={() => void copyTool(tool.title, tool.text)}>Copiar texto</button>
              </details>
            ))}
            <p className="retreat-planner-copy-status" role="status">{copyStatus}</p>
          </section>
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
        {storage === "unavailable" ? "El borrador no se guarda. Descarga el PDF antes de salir." : "Borrador guardado solo en este navegador."}
      </p>
    </section>
  );
}
