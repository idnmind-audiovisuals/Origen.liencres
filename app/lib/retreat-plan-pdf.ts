import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { retreatChecklist, retreatPlan, retreatToolbox, type PlannerAnswers } from "./retreat-planner";

const width = 595.28;
const height = 841.89;
const margin = 52;
const contentWidth = width - 2 * margin;
const ink = rgb(0.14, 0.13, 0.12);
const olive = rgb(0.31, 0.35, 0.18);
const gold = rgb(0.79, 0.59, 0.22);
const paper = rgb(0.985, 0.972, 0.946);
const line = rgb(0.83, 0.8, 0.73);

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const fits = (value: string) => font.widthOfTextAtSize(value, size) <= maxWidth;
  return text.split("\n").flatMap((paragraph) => {
    const words = paragraph.trim().split(/\s+/).flatMap((word) => {
      if (!word || fits(word)) return [word];
      const parts: string[] = [];
      let part = "";
      for (const char of word) {
        if (part && !fits(part + char)) {
          parts.push(part);
          part = "";
        }
        part += char;
      }
      return [...parts, part];
    });
    const result: string[] = [];
    let current = "";
    for (const word of words) {
      if (current && !fits(`${current} ${word}`)) {
        result.push(current);
        current = word;
      } else {
        current = current ? `${current} ${word}` : word;
      }
    }
    return [...result, current];
  });
}

export async function createRetreatPlanPdf(answers: PlannerAnswers, checked: readonly number[]) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const chars = new Set(regular.getCharacterSet());
  const clean = (text: string) => [...text.normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u00A0\u202F\t]/g, " ")
    .replace(/[‐‑‒–—−]/g, "-")]
    .filter((char) => char === "\n" || chars.has(char.codePointAt(0)!)).join("");
  const title = clean(answers.name.trim()).trim() || "Mi plan de retiro";

  pdf.setTitle(title);
  pdf.setAuthor("Origen Liencres");
  pdf.setSubject("Cuaderno de facilitación para organizar un retiro");
  pdf.setLanguage("es-ES");
  const pages: PDFPage[] = [];

  function newPage() {
    const next = pdf.addPage([width, height]);
    pages.push(next);
    next.drawRectangle({ x: 0, y: 0, width, height, color: paper });
    next.drawCircle({ x: margin + 4, y: height - 44, size: 4, color: gold });
    next.drawText("ORIGEN LIENCRES", { x: margin + 15, y: height - 47, font: bold, size: 9, color: olive });
    next.drawLine({ start: { x: margin, y: height - 60 }, end: { x: width - margin, y: height - 60 }, color: line, thickness: 0.7 });
    return next;
  }

  let page = newPage();
  let y = height - 84;

  function reserve(blockHeight: number) {
    if (y - blockHeight < 58) {
      page = newPage();
      y = height - 84;
    }
  }

  function textBlock(text: string, opts: { font?: PDFFont; size?: number; leading?: number; inset?: number } = {}) {
    const { font = regular, size = 11, leading = 16, inset = 0 } = opts;
    for (const row of wrap(clean(text), font, size, contentWidth - inset)) {
      reserve(leading);
      if (row) page.drawText(row, { x: margin + inset, y, size, font, color: ink });
      y -= leading;
    }
  }

  function sectionHeading(label: string) {
    reserve(75);
    y -= 8;
    page.drawLine({ start: { x: margin, y: y + 8 }, end: { x: width - margin, y: y + 8 }, color: line, thickness: 0.7 });
    y -= 14;
    textBlock(label, { font: bold, size: 13, leading: 20 });
    y -= 4;
  }

  page.drawText("CUADERNO DE FACILITACIÓN", { x: margin, y: y - 12, font: bold, size: 10, color: olive });
  y -= 53;
  textBlock(title, { font: serif, size: 39, leading: 43 });
  page.drawText("De la primera idea al último encuentro.", { x: margin, y: y + 4, font: regular, size: 12, color: olive });
  y -= 28;

  for (const { title: heading, lines } of retreatPlan(answers)) {
    sectionHeading(heading);
    for (const row of lines) {
      textBlock(row);
      y -= 5;
    }
  }

  sectionHeading("Plantillas para tu retiro");
  for (const { title: heading, text } of retreatToolbox(answers)) {
    reserve(40);
    textBlock(heading, { font: bold, size: 11, leading: 17 });
    textBlock(text);
    y -= 10;
  }

  sectionHeading("Lista de preparación");
  retreatChecklist.forEach((item, index) => {
    const size = 11;
    reserve(Math.max(21, wrap(clean(item), regular, size, contentWidth - 18).length * 16 + 5));
    page.drawRectangle({ x: margin, y: y - 1, width: 9, height: 9, borderColor: olive, borderWidth: 0.8,
      ...(checked.includes(index) ? { color: olive } : {}) });
    textBlock(item, { size, inset: 18 });
    y -= 5;
  });

  pages.forEach((sheet, index) => {
    sheet.drawLine({ start: { x: margin, y: 43 }, end: { x: width - margin, y: 43 }, color: line, thickness: 0.7 });
    sheet.drawText("ORIGENLIENCRES.COM", { x: margin, y: 28, font: regular, size: 8, color: olive });
    const number = `${index + 1} / ${pages.length}`;
    sheet.drawText(number, { x: width - margin - regular.widthOfTextAtSize(number, 9), y: 28, font: regular, size: 9, color: olive });
  });
  return pdf.save();
}
