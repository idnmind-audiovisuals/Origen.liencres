"""Rebuild the downloadable guide with Python and ReportLab."""

from pathlib import Path

import reportlab
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "guia-para-organizar-tu-retiro.pdf"
W, H = A4
M = 52
CW = W - M * 2
PAPER = colors.HexColor("#FAF6ED")
INK = colors.HexColor("#24231F")
OLIVE = colors.HexColor("#505632")
GOLD = colors.HexColor("#D2A54B")
RULE = colors.HexColor("#D9D0C1")
PANEL = colors.HexColor("#EEEDDF")
CREAM = colors.HexColor("#FFF8EB")

FONTS = Path(reportlab.__file__).parent / "fonts"
pdfmetrics.registerFont(TTFont("OrigenSans", str(FONTS / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("OrigenSansBold", str(FONTS / "VeraBd.ttf")))
pdfmetrics.registerFontFamily("OrigenSans", normal="OrigenSans", bold="OrigenSansBold")

BODY = ParagraphStyle("Body", fontName="OrigenSans", fontSize=10, leading=15, textColor=INK)
SMALL = ParagraphStyle("Small", parent=BODY, fontSize=8.5, leading=12.6)
LEAD = ParagraphStyle("Lead", parent=BODY, fontSize=12, leading=18, textColor=OLIVE)
INVERSE = ParagraphStyle("Inverse", parent=BODY, textColor=CREAM)
TITLE = ParagraphStyle("Title", fontName="Times-Roman", fontSize=43, leading=43, textColor=INK)

CONTENTS = [
    ("Propósito", "Guía para organizar tu retiro"),
    ("Experiencia", "Diseña una experiencia memorable"),
    ("El lugar", "Elige el sitio adecuado"),
    ("Precio", "Pon un precio sostenible"),
    ("Convocatoria", "Encuentra a tus participantes"),
    ("Continuidad", "Da valor antes y después"),
]


class Guide:
    def __init__(self, path):
        self.c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1, invariant=1, lang="es-ES")
        self.c.setTitle("Guía para organizar tu retiro")
        self.c.setAuthor("Origen Liencres")
        self.c.setCreator("Origen Liencres")
        self.c.setSubject("Cuaderno práctico para diseñar, convocar y facilitar un retiro")
        self.c.showOutline()
        self.y = H

    def page(self, number, lead):
        section, title = CONTENTS[number - 1]
        self.c.bookmarkPage(f"p{number}")
        self.c.addOutlineEntry(title, f"p{number}")
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, W, H, stroke=0, fill=1)
        self.c.setFillColor(GOLD)
        self.c.circle(M + 4, H - 42, 3.7, stroke=0, fill=1)
        self.label("ORIGEN LIENCRES", M + 15, H - 45)
        self.line(H - 58)
        self.line(48)
        self.label("ORIGENLIENCRES.COM", M, 31)
        self.c.linkURL("https://www.origenliencres.com/", (M, 28, M + 115, 42), relative=0)
        self.c.setFont("OrigenSans", 9)
        self.c.drawRightString(W - M, 31, f"{number} / {len(CONTENTS)}")
        self.y = H - 85
        self.label(f"{number:02d}  /  {section.upper()}", M, self.y)
        self.y -= 15
        self.p(title, TITLE, after=12)
        self.p(lead, LEAD, after=24)

    def label(self, text, x, y, color=OLIVE):
        self.c.setFillColor(color)
        self.c.setFont("OrigenSansBold", 8.5)
        self.c.drawString(x, y, text)

    def line(self, y, x0=M, x1=W - M):
        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(0.65)
        self.c.line(x0, y, x1, y)

    def reserve(self, depth):
        if self.y - depth < 62:
            raise ValueError(f"Content overflows page {self.c.getPageNumber()}")

    def p(self, text, style=BODY, *, after=8):
        p = Paragraph(text, style)
        _, depth = p.wrap(CW, H)
        self.reserve(depth)
        p.drawOn(self.c, M, self.y - depth)
        self.y -= depth + after

    def section(self, title):
        self.reserve(40)
        self.line(self.y)
        self.y -= 17
        self.label(title.upper(), M, self.y)
        self.y -= 9

    def items(self, *entries):
        for title, body in entries:
            self.p(f"<b>{title}</b> {body}", after=9)
        self.y -= 5

    def box(self, label, text, *, dark=False):
        p = Paragraph(text, INVERSE if dark else BODY)
        _, inner = p.wrap(CW - 36, H)
        depth = inner + 47
        self.reserve(depth)
        self.c.setFillColor(OLIVE if dark else PANEL)
        self.c.rect(M, self.y - depth, CW, depth, stroke=0, fill=1)
        self.label(label.upper(), M + 18, self.y - 19, GOLD if dark else OLIVE)
        p.drawOn(self.c, M + 18, self.y - 31 - inner)
        self.y -= depth + 17

    def table(self, headers, rows, widths):
        cells = [[Paragraph(f"<b>{s}</b>", SMALL) for s in headers]]
        cells += [[Paragraph(s, SMALL) for s in row] for row in rows]
        table = Table(cells, colWidths=widths, hAlign="LEFT")
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), PANEL),
            ("LINEBELOW", (0, 0), (-1, -1), 0.55, RULE),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        _, depth = table.wrap(CW, H)
        self.reserve(depth)
        table.drawOn(self.c, M, self.y - depth)
        self.y -= depth + 13

    def note(self, prompt, lines=2):
        self.reserve(22 * lines + 18)
        self.label(prompt.upper(), M, self.y)
        for i in range(lines):
            self.line(self.y - (i + 1) * 22)
        self.y -= lines * 22 + 16

    def finish(self):
        self.c.showPage()


def build(path):
    g = Guide(path)

    g.page(1, "Seis decisiones para convertir una buena idea en un retiro que la gente recuerde y pueda llevarse a su vida.")
    g.section("Empieza por una promesa pequeña")
    g.items(
        ("¿Quién vendrá?", "Describe qué está viviendo esa persona y qué busca ahora. «Personas que quieren retomar la escritura y no encuentran un ritmo» es más útil que «gente creativa»."),
        ("¿Qué podrá hacer al volver?", "Elige un cambio concreto que puedas facilitar sin prometer resultados. Un próximo paso practicable vale más que una transformación vaga."),
        ("¿Cómo sabrás si funcionó?", "Define una evidencia sencilla: una práctica probada, una decisión escrita o una fecha que la persona haya elegido."),
    )
    g.box("Ejemplo que seguiremos", "<b>Escritura junto al mar.</b> Dos días para personas que quieren volver a escribir. Cada participante sale con un primer borrador, una práctica de 15 minutos y una cita consigo para la semana siguiente.", dark=True)
    g.section("Usa la guía en este orden")
    g.table(("Diseña", "Comprueba", "Convoca y acompaña"), [
        ("Propósito y experiencia", "Lugar y números", "Invitación, seguimiento y aprendizaje"),
    ], [CW / 3] * 3)
    g.note("Mi retiro es para… y al volver podrán…")
    g.finish()

    g.page(2, "Un buen programa tiene ritmo: crea confianza, deja espacio para practicar y reserva tiempo para aterrizar lo vivido.")
    g.section("Un programa de dos días")
    g.table(("Momento", "Ejemplo: Escritura junto al mar"), [
        ("Día 1 · Llegada", "30 min para instalarse y conocer los acuerdos. Dinámica breve en parejas; nadie tiene que compartir algo íntimo."),
        ("Día 1 · Práctica", "75 min para escribir un borrador. Después, pausa y tiempo libre. Cierra preguntando qué desbloqueó la práctica."),
        ("Día 2 · Aplicación", "60 min para revisar lo escrito y pedir un tipo de feedback. Alternativa: revisar a solas."),
        ("Día 2 · Cierre", "30 min para probar la práctica de 15 min, anotar el siguiente paso y despedirse sin prisas."),
    ], [125, CW - 125])
    g.section("Un rompehielos de 15 minutos")
    g.items(
        ("2 min · Acuerda el marco.", "Se puede pasar, escuchar o pedir una pausa. No damos consejos sin preguntar."),
        ("6 min · Escucha por parejas.", "Tres minutos cada persona: «¿Qué me trae aquí y qué me ayudaría a estar a gusto?»."),
        ("4 min · Conecta con el grupo.", "Cada pareja comparte una afinidad o una idea, con permiso de ambas personas."),
        ("3 min · Cierra e integra.", "Cada quien escribe una intención para el primer bloque. No hace falta leerla en voz alta."),
    )
    g.box("Regla de diseño", "Por cada bloque intenso, deja un margen real para comer, descansar o estar a solas. Si el grupo llega cansado, quita una actividad antes de quitar la pausa.")
    g.finish()

    g.page(3, "Antes de comparar fotos, define tus imprescindibles. Después compara opciones con el mismo formato y pide el coste total.")
    g.section("Primero, comprueba que encaja")
    g.items(
        ("Capacidad y privacidad.", "Cuenta a participantes y equipo que dormirán allí. Pide el reparto de camas y baños y confirma qué espacios serán exclusivos."),
        ("La práctica real.", "Pide un plano o vídeo del espacio en uso, con medidas, suelo, acústica, luz y un plan interior si cambia el tiempo."),
        ("Llegada y cuidado.", "Verifica el acceso, los transportes, la alimentación y las adaptaciones que puedas confirmar de verdad."),
    )
    g.section("Puntúa tres alternativas de 1 a 5")
    g.table(("Criterio", "Peso", "A", "B", "C"), [
        ("Encaje para la práctica", "30 %", "", "", ""),
        ("Capacidad y accesibilidad", "25 %", "", "", ""),
        ("Coste total y condiciones", "20 %", "", "", ""),
        ("Privacidad y plan de lluvia", "15 %", "", "", ""),
        ("Llegada y logística", "10 %", "", "", ""),
    ], [CW - 190, 60, 43, 43, 44])
    g.p("Multiplica cada nota por su peso y suma. Descarta un lugar si falla un imprescindible, aunque gane en puntuación.", SMALL, after=15)
    g.box("Qué preguntar antes de reservar", "«¿Qué incluye el presupuesto? ¿Cuándo vence la opción de fechas? ¿Qué pasa si cambian el aforo, la fecha o el tiempo? ¿Qué necesitamos llevar o contratar aparte?». Pide la respuesta por escrito.")
    g.finish()

    g.page(4, "Calcula con el mínimo de plazas con el que harías el retiro. Tu precio no debería depender de llenar todas las camas.")
    g.section("Separa dos tipos de gasto")
    g.items(
        ("Fijos.", "Espacio, preparación, facilitación, transporte del equipo y una reserva para imprevistos."),
        ("Por persona.", "Comidas, material individual y otros costes que suben al confirmar una plaza más."),
    )
    g.box("Dos cálculos antes de poner precio",
          "<b>Coste por plaza = gastos fijos ÷ plazas mínimas + gasto por persona.</b><br/>"
          "Si margen y comisión son porcentajes sobre la venta: <b>precio antes de impuestos = coste por plaza ÷ (1 - margen - comisión).</b>", dark=True)
    g.section("Ejemplo ilustrativo, no una tarifa de mercado")
    g.p("Con <b>1.500 € fijos</b>, <b>70 € por persona</b> y <b>6 plazas mínimas</b>, el coste estimado es de <b>320 € por plaza</b>. Con 20 % de margen objetivo y 3 % de comisión, 320 ÷ 0,77 = 415,58 €. Redondeamos a <b>416 €</b>.")
    g.table(("Plazas", "Ingresos", "Costes + comisión", "Resultado"), [
        ("4", "1.664 €", "1.829,92 €", "-165,92 €"),
        ("6", "2.496 €", "1.994,88 €", "501,12 €"),
        ("8", "3.328 €", "2.159,84 €", "1.168,16 €"),
    ], [74, 110, 162, CW - 346])
    g.p("Cifras antes de impuestos. Comprueba cómo se aplican los impuestos y comisiones de tu caso antes de publicar el precio final.", SMALL, after=13)
    g.note("Mi mínimo de plazas y mi fecha para decidir", lines=1)
    g.finish()

    g.page(5, "No empieces intentando llegar a todo el mundo. Encuentra un lugar donde tu participante ideal ya confíe en alguien.")
    g.section("Tres semanas de convocatoria")
    g.table(("Cuándo", "Qué hacer"), [
        ("Semana 1", "Habla con cinco personas del perfil elegido. Pregunta qué quieren conseguir y qué las frenaría. Invita primero a tu comunidad."),
        ("Semana 2", "Muestra algo real: una práctica de 10 minutos, una foto del espacio o un ejemplo de lo que se llevarán. Pide a dos aliados relevantes que compartan la propuesta."),
        ("Semana 3", "Responde dudas sobre venir solo, acceso, precio y horario. Comparte una fecha real de cierre y confirma las plazas pagadas."),
    ], [112, CW - 112])
    g.box("Una invitación que puedes adaptar",
          "«Si quieres retomar la escritura y te cuesta hacerle espacio, en <b>Escritura junto al mar</b> practicaremos dos días en un grupo pequeño. Te llevarás un primer borrador y una práctica de 15 minutos. Te paso fechas, qué incluye y precio. ¿Te encaja?»")
    g.section("Distingue interés de reserva")
    g.items(
        ("Lleva un registro simple.", "Anota canal, consultas, plazas pagadas y la duda más repetida. Usa esa duda para mejorar la siguiente invitación."),
        ("Facilita la decisión.", "En un solo enlace, explica para quién es, qué se hará, fechas, precio total, alojamiento, condiciones y cómo confirmar."),
    )
    g.note("Mis dos primeras comunidades o alianzas", lines=1)
    g.finish()

    g.page(6, "El mejor extra ayuda a que lo vivido dure. Elige uno que tu grupo pueda utilizar de verdad, no una bolsa llena de cosas.")
    g.section("Tres momentos para dar valor")
    g.items(
        ("Antes · Quita fricción.", "Envía una página con llegada, horarios y qué traer. Pregunta «¿qué haría que valiera la pena?» y permite plantear necesidades en privado."),
        ("Durante · Prueba el recurso.", "Entrega una guía, audio o plantilla corta y dedica tiempo a usarla. Para el ejemplo: una consigna, 15 minutos de práctica y una hoja para repetirla."),
        ("Después · Invita a continuar.", "Al día siguiente comparte el recurso. A los siete días pregunta qué pudieron probar. A las dos semanas ofrece un encuentro voluntario o una pareja de seguimiento."),
    )
    g.box("Dos preguntas que mejoran tu próxima edición",
          "¿Qué parte te ayudó a hacer algo distinto en tu día a día? ¿Qué quitarías o cambiarías? Pide permiso aparte si quieres usar alguna frase como testimonio.")
    g.section("Antes de abrir plazas")
    g.items(
        ("Programa.", "Propósito claro, práctica principal, tiempo libre y cierre."),
        ("Operación.", "Lugar confirmado, costes revisados, mínimos y plan alternativo."),
        ("Convocatoria.", "Invitación clara, condiciones visibles y seguimiento definido."),
    )
    g.p('<link href="https://www.origenliencres.com/retiros" color="#505632"><u>Conoce el espacio de Origen Liencres</u></link> si quieres valorar la casa para tu próximo grupo.', SMALL, after=0)
    g.finish()
    g.c.save()


if __name__ == "__main__":
    build(OUTPUT)
