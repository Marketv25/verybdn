# verybdn — Project Handoff & Build Brief
### Para continuar en Antigravity (local) sin perder el trabajo hecho

> **Cómo usar este archivo:** ponlo en la raíz del proyecto (`/verybdn-handoff.md`). Es tu documento de contexto maestro. Cuando abras Antigravity, pídele que lo lea primero ("read verybdn-handoff.md before doing anything"). Contiene el estado actual, las decisiones tomadas y su razón, y el plan de trabajo. No reabras decisiones ya cerradas salvo que cambie algo de fondo.

---

## 0. Qué es verybdn (en una frase para el agente)

Plataforma de contenido de viajes de autoridad sobre **Minca** y la costa Caribe colombiana, escrita por alguien que **vive en el territorio**, diseñada para ser **la fuente citada por motores de IA** (ChatGPT, Perplexity, Gemini, Google AI Overviews) y buscadores tradicionales. La home no vende: convierte a **lectura** (citabilidad) y a **lista de correo** (único activo 100% propio). Los productos de pago y el lodge llegan en capas posteriores, después de ganar confianza.

**Autor / operador:** Honey. Vive en Minca, Sierra Nevada. Opera el lodge *Entre Río y Fuego* y publica *Turismo y Territorio* en Substack.

---

## 1. Estado actual — qué existe y qué falta

### Hecho
- **Home page v2** diseñada y construida (HTML/CSS/JS, un solo archivo, sin framework). Es el punto de partida del trabajo en local.
- **Sistema de marca** completo y documentado (ver §3).
- **Selector bilingüe EN/ES** funcionando, con persistencia en localStorage. Idioma por defecto: **inglés**.
- **Arquitectura de conversión** definida: home → lectura + captura de correo. Nada de venta agresiva.
- **Grid de territorio** honesto: Minca "Live", resto de la costa marcado "In progress / Planned".
- **Primera guía de capa 1 redactada**: "Cómo llegar a Minca" (existe como contenido, aún no integrada como página web).

### Falta (el trabajo que viene)
- Montar el proyecto en **local** y meter las **3 imágenes reales** (ver §4).
- Resolver el **problema técnico crítico de AEO**: el texto se inyecta por JavaScript y los crawlers de IA no lo ven bien (ver §5.1). **Esto es lo primero a arreglar.**
- Construir las **páginas de guía** (capa 1) con estructura Q&A apta para IA (ver §6).
- Implementar **SEO técnico, AEO y schema** (ver §5).
- Conectar el **formulario de correo** a un proveedor real (ver §7).
- Conectar los enlaces de las guías (hoy son anclas `#`).

---

## 2. Archivos entregados

| Archivo | Qué es |
|---|---|
| `verybdn-home.html` | Home v2 **limpia**, sin placeholders de imagen. Base de trabajo. |
| `verybdn-home-con-fotos-marcadas.html` | Misma home con **3 huecos de imagen etiquetados** mostrando qué foto va en cada uno. Referencia visual, no producción. |
| `verybdn-handoff.md` | Este documento. |
| `verybdn-voz.md` | Manual de voz y escritura. Léelo al generar o editar copy de cara al público (guías, captions, emails, Substack). No aplica a código. |

Trabaja sobre `verybdn-home.html`. El de fotos marcadas es solo para que veas dónde van.

---

## 3. Sistema de marca (NO modificar — está cerrado)

### Nombre
- `verybdn` **siempre en minúscula**. Nunca "VeryBDN", nunca "Verybdn".
- `bdn` va en el **acento de barro** (`#9B6B3A`). `very` en color tierra.
- **Nunca** meter "Colombia" dentro del logo. El territorio se ancla en el tagline y el contenido, no en el wordmark.

### Paleta (variables CSS ya en el archivo)
```
--tierra:    #1A1814   (texto principal, fondos oscuros)
--crema:     #F2ECE0   (fondo base)
--barro:     #9B6B3A   (acento principal — el de "bdn")
--barro-claro:#C4895A  (acento sobre fondo oscuro)
--sombra:    #7A6A52   (texto secundario)
--selva:     #3D5A3E   (verde, estados positivos)
--hueso:     #E8E0D0   (fondos de sección alternos)
--borde:     #D9D0C0   (líneas, bordes)
```

### Tipografía (Google Fonts, ya enlazada)
- **DM Serif Display** *italic* → titulares (h1, h2, números de archivo).
- **DM Sans** Light (300) → etiquetas, eyebrows, texto de apoyo.
- **DM Sans** Regular/Medium (400/500) → cuerpo y botones.

### Principio estético (deliberado)
- **No-postal.** Nada de cascada turquesa de stock, hamaca, atardecer filtrado. El nicho está saturado de eso. La diferenciación es textual y de honestidad, no de imagen bonita.
- Las imágenes usadas deben ser **propias, irreemplazables, imposibles de tener para un blogger remoto**.
- El fondo **topográfico** (líneas de nivel SVG en el hero) es marca, no relleno. Mantener aunque se metan fotos.

---

## 4. Imágenes — qué va dónde (decidido contra el archivo real de Honey)

Hay **3 ranuras**, asignadas a fotos que Honey **ya tiene**. Las miniaturas por guía quedan **fuera** por ahora (no hay material dirigido; meterían ruido genérico).

| Ranura | Ubicación en la home | Foto exacta | Por qué ahí |
|---|---|---|---|
| **A** | Tarjeta del hero (lado derecho, sobre el texto de credencial) | **Una vista desde Minca** (la que más diga altura/selva, no playa) | Ancla "vivo aquí" sin exigir autorretrato. Es claramente una vista que solo se tiene estando ahí. |
| **B** | Banda ancha, justo antes del grid de territorio | **El burro en medio del tráfico** (la foto épica del post) | Activo más fuerte y no replicable. Minca real, con humor, sin postal. Va en el lugar más visible. |
| **C** | Sección "cómo funciona" (capas), sobre fondo oscuro | **El horno de leña del lodge** | El más honesto de las 3 del lodge y literalmente el "fuego" de *Entre Río y Fuego*. Da rostro a la capa 3 sin venderla. |

**Otras fotos disponibles** (refugio, vista desde la terraza): reserva para las páginas internas del lodge o Substack, no para la home.

**Idea del café (Honey en una mesa del pueblo):** NO va en el hero. Sin contexto se lee como cualquier turista. Guardar para Substack/Instagram, donde el texto alrededor le da sentido.

### Implementación técnica de las imágenes
En el archivo de fotos marcadas, cada hueco es un `<div class="ph ...">`. Para producción, reemplazar por imagen real:
```html
<!-- en vez del div .ph, usar: -->
<img src="/img/burro-trafico-minca.jpg"
     alt="Un burro cruzando entre motos en la calle principal de Minca, Sierra Nevada"
     loading="lazy" width="1200" height="320"
     style="width:100%;height:320px;object-fit:cover;border-radius:4px;">
```
- **Formato:** exportar en **WebP** (o AVIF) con fallback JPG. Peso objetivo < 200 KB cada una.
- **`alt` descriptivo y con territorio** (importa para SEO y para IA). No "foto1.jpg". Describe la escena + lugar.
- **`width`/`height` explícitos** para evitar layout shift (CLS).
- **`loading="lazy"`** en B y C; el hero (A) puede ir `eager` por estar above-the-fold.
- Carpeta sugerida: `/public/img/` o `/img/`.

---

## 5. SEO + AEO — el corazón del trabajo de visibilidad

> Contexto de mercado verificado (junio 2026). Lee esto antes de implementar; algunas "mejores prácticas" viejas ya no aplican.

### 5.1 PRIORIDAD CERO — Renderizado para crawlers de IA (bug actual)

**Problema:** la home v2 inyecta TODO el texto vía JavaScript (el motor bilingüe llena los `data-en`/`data-es` al cargar). Los crawlers de IA y parte de los de búsqueda **leen el HTML que devuelve el servidor, no ejecutan JS de forma fiable**. Si el texto no está en el HTML inicial, **no te citan y no te indexan bien**. Esto anula toda la estrategia de citabilidad.

**Solución (elige una, en orden de preferencia):**
1. **Pre-render / SSG.** Mover a un framework estático (Astro es ideal aquí: genera HTML plano, JS mínimo, perfecto para contenido). Cada idioma como página real servida en HTML completo: `/en/` y `/es/` (o `verybdn.com` raíz EN + `/es/`).
2. Si se mantiene HTML plano: que el **texto por defecto (inglés) esté escrito directamente en el HTML**, no inyectado. El JS solo *cambia* a español al hacer clic, pero el contenido base ya existe sin JS.
3. Generar dos archivos HTML completos (`index.html` EN, `es/index.html` ES) con el texto ya escrito en cada uno, y el toggle como enlace entre ellos.

**Regla de oro AEO:** si desactivas JavaScript en el navegador y el texto desaparece, los motores de IA no lo ven. Pruébalo.

### 5.2 Estructura de URLs e idiomas
- Inglés es el mercado de alta intención (lo confirman los estudios del proyecto). Default EN.
- URLs limpias y descriptivas: `/minca/is-minca-worth-it/`, `/minca/how-many-days/`, etc.
- Implementar **`hreflang`** entre versiones EN/ES de cada página:
```html
<link rel="alternate" hreflang="en" href="https://verybdn.com/minca/is-minca-worth-it/">
<link rel="alternate" hreflang="es" href="https://verybdn.com/es/minca/vale-la-pena-minca/">
<link rel="alternate" hreflang="x-default" href="https://verybdn.com/minca/is-minca-worth-it/">
```

### 5.3 Schema / structured data (JSON-LD)
Estado 2026 verificado:
- **FAQPage rich result MURIÓ** (Google lo retiró el 7 mayo 2026). **No lo implementes para ganar el rich result** porque ya no existe. PERO el markup sigue siendo válido y **los crawlers de IA siguen leyendo Q&A**. Lo que mueve la citabilidad es el **contenido Q&A limpio en HTML visible**, no el schema. → Prioriza estructura Q&A en el HTML; el FAQPage JSON-LD es opcional y secundario.
- **SÍ implementa estos**, que siguen activos y útiles:
  - **`Organization`** / **`WebSite`** en la home (nombre, logo, sameAs a Substack/redes).
  - **`Article`** en cada guía (con `author` Person, `datePublished`, `dateModified`, `publisher`). Esto sí da señales reales de autoría/E-E-A-T.
  - **`BreadcrumbList`** para la navegación jerárquica.
  - **`LodgingBusiness`** o **`LocalBusiness`** para *Entre Río y Fuego* cuando tenga su página.
  - **`Person`** para Honey (autor), con bio y conexión al territorio — refuerza E-E-A-T.
- Formato: **JSON-LD** en `<script type="application/ld+json">`, no microdata.

### 5.4 AEO — cómo ganar citas de IA (lo que de verdad mueve la aguja)
1. **Contenido answer-first.** Cada guía abre respondiendo la pregunta en 1-2 frases directas, ANTES del ensayo. La IA extrae la respuesta de arriba. (Esto choca un poco con la voz ensayística: la solución es un resumen/respuesta clara arriba + el desarrollo con voz debajo. Ver §6.)
2. **Headings literales** que repitan la pregunta real: `<h2>How many days do you need in Minca?</h2>`. La IA mapea pregunta→respuesta.
3. **Datos concretos y verificables**: precios en COP, distancias, tiempos, horarios. La especificidad de campo es lo que te diferencia y lo que la IA cita.
4. **Self-contained answers**: cada sección debe poder citarse sola, sin requerir el resto de la página.
5. **E-E-A-T**: deja clarísimo que el autor vive en Minca. Bio del autor, "última actualización", primera persona con conocimiento local. El contenido con E-E-A-T alto se cita ~340% más.
6. **No escondas contenido tras JS/tabs/acordeones.** Todo el texto importante, en el HTML, visible. (Conecta con §5.1.)
7. **`llms.txt`** (opcional, bajo esfuerzo): archivo markdown en la raíz que mapea tus páginas clave para LLMs. Adopción aún marginal y disputada (algunos bots lo leen, muchos lo ignoran), pero es barato. Hazlo **al final**, no es prioridad. No inviertas mucho.

### 5.5 SEO técnico (checklist)
- **`robots.txt`**: permitir explícitamente bots de IA: `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`, `Bingbot`. **Si usas Cloudflare, revisa que no esté bloqueando bots de IA por defecto** (cambió su config para bloquearlos).
- **`sitemap.xml`**: generado automáticamente, enviado a Google Search Console y Bing Webmaster Tools.
- **Meta tags por página**: `title` único (50-60 car.), `meta description` única (150-160 car.) con territorio + keyword. Ya hay un buen `title`/`description` en la home v2 como modelo.
- **Open Graph + Twitter Card**: para compartir en redes (imagen, título, descripción). Usa el burro o una vista de Minca como `og:image`.
- **Core Web Vitals**: imágenes optimizadas (WebP, lazy, dimensiones), CSS crítico inline, fuentes con `font-display:swap` (ya está vía Google Fonts). Apunta a LCP < 2.5s.
- **Canonical tags** en cada página.
- **HTTPS**, dominio único (decidir www vs no-www y redirigir el otro).

### 5.6 Keywords ancla (de los estudios del proyecto)
Las guías de Minca atacan estas búsquedas reales de alta intención (inglés primero):
- "is Minca worth it" / "is Minca worth visiting"
- "how many days in Minca"
- "Minca vs Tayrona" / "Minca or Tayrona"
- "where to stay in Minca"
- "how to get to Minca" (la guía ya redactada)
- "things to do in Minca"
- "best time to visit Minca"

Títulos: **literal en el `<title>`/`<h1>` para SEO, voz de marca en el subtítulo.** Nunca "Best Things to Do in Minca 2026" como copy visible principal — eso te iguala a los blogs genéricos. El H-tag lleva la keyword, el subtítulo diferencia.

---

## 6. Páginas de guía (capa 1) — cómo construirlas

La home ya muestra 4 preguntas. Cada una necesita su **página real**. Plantilla:

```
[H1: la pregunta, literal]  ← keyword exacta
[Subtítulo: con voz de marca]
[RESPUESTA DIRECTA en 1-2 frases]  ← lo que la IA cita; answer-first
[Desarrollo con voz, datos de campo, precios COP, tiempos, opinión clara]
[H2/H3 que repitan sub-preguntas reales]
[Bloque afiliado discreto SI responde una necesidad real del viajero — ver §8]
[CTA suave a la lista de correo]
```

**Tensión voz vs IA (resuelta):** la home y las guías tienen trabajos distintos. La home es editorial, atmosférica — es tu diferenciador. Las guías llevan **hueso de estructura** (respuesta arriba, headings literales, datos, quizá una tabla comparativa) PERO conservan la voz en el desarrollo. No aplanes la voz; añade estructura alrededor de ella. La respuesta directa arriba sirve a la IA; el ensayo abajo sirve al lector y a la marca.

> **La voz completa está en `verybdn-voz.md`.** Léelo antes de escribir cualquier guía. Resumen mínimo: entrar siempre por una escena sensorial concreta, nunca por una tesis; no nombrar la emoción, contenerla; nunca más de dos frases cortas seguidas sin una larga que dé respiración; no usar em dashes; no cerrar con moño; no usar "regenerativo/sostenible/consciente" como credencial. La especificidad de campo (precios COP, tiempos, correcciones a mitos) ES la voz, no su enemigo.

**Primera guía lista para integrar:** "Cómo llegar a Minca" (ya redactada con correcciones de campo de Honey: Cootrasminca, oficina de Mamatoco, salidas ~cada 30 min, Efecty y Mincaexpress para efectivo, lectores Bold con comisión hasta 10%, sección de propinas). Es la pieza donde va el bloque afiliado de seguro de viaje (discreto, al final, con disclosure).

**Decisión abierta:** si la guía de itinerario se **vende** (Layer 2) o se **regala como lead magnet**. No resuelta. No la fuerces; pregúntale a Honey cuando llegue el momento.

---

## 7. Conversión y distribución

### Formulario de correo (lista = único activo propio)
- Hoy solo valida y muestra confirmación; **no envía nada**. Conectar a un proveedor real.
- Opciones: **MailerLite** o **Substack** (Honey ya usa Substack para *Turismo y Territorio* — lo más simple es capturar directo a Substack). Evaluar ConvertKit/Kit si quiere automatizaciones.
- La promesa de la lista es: "primera mano, ocasional, sin venta, cancelable". **Respetar eso** — nada de spam ni secuencias agresivas.

### Pipeline de productos (capas 2 y 3, futuro)
- **Gumroad** (internacional) / **Hotmart o Payhip** (COP).
- **WhatsApp** = canal de conversión de experiencias de alto valor (lodge).
- Productos digitales de bajo precio: venta automática por link. Alto valor: WhatsApp.

### Sistema de 3 capas (recordatorio estratégico)
1. **Capa 1 — contenido libre** (guías): genera citabilidad + crece la lista. Gratis siempre.
2. **Capa 2 — productos de pago** (guía completa, itinerario): cuando la capa 1 ya dio confianza.
3. **Capa 3 — lodge y experiencias** (*Entre Río y Fuego*): conversión de mayor valor, vía WhatsApp.

El tráfico precede al ingreso por afiliados. Sin tráfico, los afiliados rinden casi nada — las palancas cercanas reales son capa 2 y capa 3.

---

## 8. Afiliados (Travelpayouts) — como infraestructura, no como motivo

- Honey tiene suscripción **Travelpayouts** (incluye widget Aviasales para vuelos).
- **Regla:** el enlace afiliado responde una pregunta real del viajero; nunca es la razón por la que existe el contenido. La guía gana su autoridad primero.
- Colocación **discreta, claramente etiquetada, con disclosure de comisión**, al final de la pieza, **fuera del cuerpo editorial**.
- El **widget de vuelos (Aviasales)** pertenece a la futura guía de "vuelos a Santa Marta", no a la home ni a las guías de Minca.
- Seguro de viaje: encaja en "Cómo llegar a Minca" (bloque al final).
- La colocación de afiliados **no debe** socavar el posicionamiento de fuente editorial independiente y citable.

---

## 9. Orden de trabajo recomendado en Antigravity

> Pídele a Antigravity un plan/artefacto antes de ejecutar cada bloque, y revísalo. Una entrega por sesión; no mezcles tareas no relacionadas.

1. **Montar el proyecto en local.** Decide stack: recomendación fuerte = **Astro** (estático, HTML plano, multiidioma nativo, perfecto para AEO). Migrar la home v2 a Astro o servir el HTML directo arreglando §5.1.
2. **Arreglar el renderizado para IA (§5.1).** Texto base en HTML, no solo inyectado por JS. Verificar con JS desactivado.
3. **Meter las 3 imágenes reales (§4)** con `alt` descriptivo, WebP, dimensiones, lazy.
4. **SEO técnico base (§5.5):** robots.txt con bots de IA permitidos, sitemap, meta por página, OG tags, canonical, hreflang.
5. **Schema JSON-LD (§5.3):** Organization + WebSite en home; Person (Honey) como autor.
6. **Integrar la primera guía** ("Cómo llegar a Minca") como página real con plantilla §6 + su schema Article.
7. **Conectar el formulario** a Substack/MailerLite (§7).
8. **Construir las otras 3 guías** de Minca (answer-first + voz).
9. **Open Graph, Core Web Vitals, pulido.**
10. **Opcional al final:** `llms.txt`.

---

## 10. Reglas que el agente NO debe romper

- No vender en la home. Convertir solo a lectura y a lista.
- No meter imágenes de stock ni postales del nicho. Solo las 3 fotos propias asignadas.
- No tocar el sistema de marca (§3): minúsculas, `bdn` en barro, fuentes, paleta.
- No aplanar la voz editorial para "optimizar". La estructura va alrededor de la voz, no en su lugar.
- No esconder texto tras JavaScript, tabs o acordeones (mata el AEO).
- No prometer destinos de la costa que aún no existen como contenido. Minca primero, el resto "in progress/planned" con honestidad.
- Afiliados solo como infraestructura discreta que responde una necesidad real, nunca en el cuerpo editorial.
- Default inglés, español vía toggle/`/es/`.

---

## 11. Contexto que el agente puede pedirle a Honey si lo necesita

- Las 3 fotos finales exportadas (vista de Minca, burro, horno de leña).
- Credenciales/decisión del proveedor de correo (Substack vs MailerLite).
- El texto final de la guía "Cómo llegar a Minca" para integrarla.
- Dominio definitivo y configuración DNS/hosting.
- Decisión sobre el itinerario: ¿se vende o es lead magnet?

---

*Fin del handoff. Mantén este archivo actualizado a medida que avances: es la memoria del proyecto.*
