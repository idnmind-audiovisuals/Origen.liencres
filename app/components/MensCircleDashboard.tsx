"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { GatewayBrandLink } from "./GatewayBrandLink";

type SessionEntry = {
  id: string;
  date: string;
  presence: number;
  theme: string;
  reflection: string;
};

type ListItem = { id: string; text: string; done?: boolean };

type DashboardData = {
  sessions: SessionEntry[];
  intentions: ListItem[];
  inspirations: ListItem[];
  offers: ListItem[];
  requests: ListItem[];
  generalReflection: string;
};

const STORAGE_KEY = "origen-bros-dashboard-v1";
const EMPTY_DATA: DashboardData = {
  sessions: [],
  intentions: [],
  inspirations: [],
  offers: [],
  requests: [],
  generalReflection: "",
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ListSection({
  id,
  eyebrow,
  title,
  prompt,
  items,
  onAdd,
  onRemove,
  onToggle,
}: {
  id: string;
  eyebrow: string;
  title: string;
  prompt: string;
  items: ListItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onToggle?: (id: string) => void;
}) {
  const [value, setValue] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onAdd(text);
    setValue("");
  }

  return (
    <section className="bros-dashboard-panel" id={id} aria-labelledby={`${id}-title`}>
      <p className="bros-dashboard-eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <form className="bros-dashboard-inline-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`${id}-input`}>{prompt}</label>
        <input id={`${id}-input`} value={value} onChange={(event) => setValue(event.target.value)} placeholder={prompt} />
        <button type="submit">Añadir</button>
      </form>
      {items.length ? (
        <ul className="bros-dashboard-list">
          {items.map((item) => (
            <li key={item.id} className={item.done ? "is-done" : undefined}>
              {onToggle ? <button className="bros-dashboard-check" type="button" onClick={() => onToggle(item.id)} aria-label={item.done ? "Marcar como pendiente" : "Marcar como trabajado"}>{item.done ? "✓" : "○"}</button> : null}
              <span>{item.text}</span>
              <button className="bros-dashboard-remove" type="button" onClick={() => onRemove(item.id)} aria-label={`Eliminar: ${item.text}`}>×</button>
            </li>
          ))}
        </ul>
      ) : <p className="bros-dashboard-empty">Todavía no has añadido nada aquí.</p>}
    </section>
  );
}

export function MensCircleDashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"loading" | "saved" | "error">("loading");
  const [sessionDate, setSessionDate] = useState("");
  const [presence, setPresence] = useState(3);
  const [theme, setTheme] = useState("");
  const [reflection, setReflection] = useState("");
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setData({ ...EMPTY_DATA, ...JSON.parse(stored) });
    } catch {
      setData(EMPTY_DATA);
    }
    setSessionDate(new Date().toISOString().slice(0, 10));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [data, ready]);

  const averagePresence = useMemo(() => {
    if (!data.sessions.length) return "—";
    return (data.sessions.reduce((sum, session) => sum + session.presence, 0) / data.sessions.length).toFixed(1);
  }, [data.sessions]);

  function addSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sessionDate) {
      setSessionError("Elige una fecha para guardar la sesión.");
      return;
    }
    if (!theme.trim() && !reflection.trim()) {
      setSessionError("Añade un tema o una reflexión antes de guardar.");
      return;
    }
    setSessionError("");
    setData((current) => ({
      ...current,
      sessions: [{ id: createId(), date: sessionDate, presence, theme: theme.trim(), reflection: reflection.trim() }, ...current.sessions],
    }));
    setTheme("");
    setReflection("");
    setPresence(3);
  }

  function updateList(key: "intentions" | "inspirations" | "offers" | "requests", action: "add" | "remove" | "toggle", value: string) {
    setData((current) => ({
      ...current,
      [key]: action === "add"
        ? [...current[key], { id: createId(), text: value, done: false }]
        : action === "remove"
          ? current[key].filter((item) => item.id !== value)
          : current[key].map((item) => item.id === value ? { ...item, done: !item.done } : item),
    }));
  }

  return (
    <main className="bros-dashboard-page">
      <header className="bros-dashboard-header">
        <GatewayBrandLink className="bros-dashboard-brand" label="Origen Bros" />
        <div><span>Espacio personal</span><Link href="/circulo-de-hombres-cantabria">Salir del dashboard</Link></div>
      </header>

      <section className="bros-dashboard-hero" aria-labelledby="dashboard-title">
        <div><p className="bros-dashboard-eyebrow">Origen Bros · Seguimiento personal</p><h1 id="dashboard-title">Tu proceso,<br />semana a semana.</h1></div>
        <p>Un lugar privado para registrar lo vivido, reconocer patrones y pedir el apoyo que necesitas. La información se guarda únicamente en este dispositivo.</p>
      </section>

      <nav className="bros-dashboard-nav" id="dashboard-menu" aria-label="Secciones del dashboard">
        <a href="#sesiones">Sesiones</a><a href="#intenciones">Intenciones</a><a href="#reflexiones">Reflexiones</a><a href="#inspiraciones">Inspiraciones</a><a href="#apoyo">Apoyo</a><Link className="bros-dashboard-nav-exit" href="/circulo-de-hombres-cantabria">Salir</Link>
      </nav>

      <section className="bros-dashboard-stats" aria-label="Resumen del proceso">
        <div><strong>{data.sessions.length}</strong><span>Sesiones registradas</span></div>
        <div><strong>{averagePresence}</strong><span>Presencia media · 5</span></div>
        <div><strong>{data.intentions.filter((item) => !item.done).length}</strong><span>Intenciones activas</span></div>
      </section>

      <section className="bros-dashboard-panel bros-dashboard-sessions" id="sesiones" aria-labelledby="sessions-title">
        <p className="bros-dashboard-eyebrow">Evolución de cada encuentro</p><h2 id="sessions-title">Registro de sesiones.</h2>
        <form className="bros-dashboard-session-form" onSubmit={addSession} aria-describedby={sessionError ? "session-form-error" : undefined}>
          <label>Fecha<input type="date" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} required /></label>
          <label>Presencia<select value={presence} onChange={(event) => setPresence(Number(event.target.value))}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>
          <label className="is-wide">Tema principal<input value={theme} onChange={(event) => setTheme(event.target.value)} placeholder="¿Qué estuvo vivo esta semana?" /></label>
          <label className="is-wide">Reflexión<textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="¿Qué viste, sentiste o comprendiste?" rows={4} /></label>
          {sessionError ? <p className="bros-dashboard-form-error" id="session-form-error" role="alert">{sessionError}</p> : null}
          <button type="submit">Guardar sesión</button>
        </form>
        <div className="bros-dashboard-session-list">
          {data.sessions.map((session) => <article key={session.id}><header><time dateTime={session.date}>{new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${session.date}T12:00:00`))}</time><span>Presencia {session.presence}/5</span></header>{session.theme ? <h3>{session.theme}</h3> : null}{session.reflection ? <p>{session.reflection}</p> : null}<button type="button" onClick={() => setData((current) => ({ ...current, sessions: current.sessions.filter((item) => item.id !== session.id) }))}>Eliminar</button></article>)}
          {!data.sessions.length ? <p className="bros-dashboard-empty">Tu evolución aparecerá aquí cuando guardes la primera sesión.</p> : null}
        </div>
      </section>

      <ListSection id="intenciones" eyebrow="Dirección" title="Intenciones y temas a trabajar." prompt="Añade una intención o tema" items={data.intentions} onAdd={(value) => updateList("intentions", "add", value)} onRemove={(id) => updateList("intentions", "remove", id)} onToggle={(id) => updateList("intentions", "toggle", id)} />

      <section className="bros-dashboard-panel" id="reflexiones" aria-labelledby="reflections-title">
        <p className="bros-dashboard-eyebrow">Mirada amplia</p><h2 id="reflections-title">Reflexiones generales.</h2>
        <label className="bros-dashboard-journal"><span>¿Qué estás aprendiendo sobre ti, tus relaciones y tu forma de vivir?</span><textarea rows={10} value={data.generalReflection} onChange={(event) => setData((current) => ({ ...current, generalReflection: event.target.value }))} placeholder="Escribe sin prisa. Se guarda automáticamente en este dispositivo." /></label>
        <p className={`bros-dashboard-save-note is-${saveStatus}`} role="status">{saveStatus === "saved" ? "Guardado automáticamente en este dispositivo." : saveStatus === "error" ? "No se ha podido guardar en este dispositivo." : "Preparando tu espacio…"}</p>
      </section>

      <ListSection id="inspiraciones" eyebrow="Lo que te mueve" title="Inspiraciones." prompt="Idea, frase, libro, persona o práctica" items={data.inspirations} onAdd={(value) => updateList("inspirations", "add", value)} onRemove={(id) => updateList("inspirations", "remove", id)} />

      <div className="bros-dashboard-support-grid" id="apoyo">
        <ListSection id="ofrecer-apoyo" eyebrow="Servicio" title="Lo que puedo ofrecer." prompt="¿Cómo puedes apoyar a otro hombre?" items={data.offers} onAdd={(value) => updateList("offers", "add", value)} onRemove={(id) => updateList("offers", "remove", id)} />
        <ListSection id="pedir-apoyo" eyebrow="Vulnerabilidad" title="El apoyo que necesito." prompt="¿En qué te gustaría recibir apoyo?" items={data.requests} onAdd={(value) => updateList("requests", "add", value)} onRemove={(id) => updateList("requests", "remove", id)} />
      </div>

      <a className="bros-dashboard-back-to-menu" href="#dashboard-menu"><span aria-hidden="true">↑</span> Volver al menú</a>

      <footer className="bros-dashboard-footer"><p>Origen Bros · Liencres</p><p>{ready ? "Guardado localmente" : "Cargando tu espacio"}</p></footer>
    </main>
  );
}
