# SPEC 03 — About Page + Formulario de Contacto con Resend

**State:** Aprobado  
**Depends on:** SPEC 01, SPEC 02  
**Date:** 2026-11-14  
**Objective:** Implementar la página `/about` con sección hero + formulario de contacto que envía emails reales via Resend al hacer submit.

---

## Scope

**En scope:**
- `app/about/page.tsx` — página About (client component)
- `app/api/contact/route.ts` — Route Handler POST que llama al SDK de Resend
- `app/globals.css` — clases CSS del bloque about/contact del prototipo
- `components/Nav.tsx` — agregar link ABOUT apuntando a `/about`
- `.env.local` — variable `RESEND_API_KEY`
- Instalar paquete npm `resend`
- Componente `HighlightIcon` (3 íconos SVG pixel-art: HEART, BROWSER, PLANT)
- Sección hero: kicker, título, misión, 3 highlight cards
- Divider animado con píxeles
- Sección contact: grid 2 columnas (intro + form), tips con LEDs
- Estado de éxito: terminal retro al recibir 200 del Route Handler
- Animación shake en el form si campos vacíos o error de red

**Fuera de scope:**
- Autenticación del remitente (el email se envía sin login)
- Guardado de mensajes en base de datos
- Rate limiting en el Route Handler
- Tests automatizados
- Email template HTML enriquecido (email de texto plano es suficiente)

---

## Data model

No se introducen estructuras persistentes nuevas.

Payload enviado al Route Handler:

```ts
interface ContactPayload {
  name: string   // nombre del remitente
  email: string  // correo del remitente
  msg: string    // mensaje
}
```

Respuestas del Route Handler:
- `200 { ok: true }` — email enviado con éxito
- `400 { error: "missing_fields" }` — algún campo vacío
- `500 { error: "send_failed" }` — fallo de Resend

---

## Implementation plan

Cada paso deja el sistema compilando.

1. **Instalar Resend** — `npm install resend`. Agregar `RESEND_API_KEY=<tu_key>` a `.env.local`. El archivo `.env.local` ya debe estar en `.gitignore` (verificar).

2. **CSS del About** — Agregar al final de `app/globals.css` todas las clases del bloque about/contact de `references/templates/home-about/home-about/styles.css`:
   - `.about`, `.about-hero`, `.about-title`, `.about-mission`
   - `.highlight-row`, `.highlight`, `.highlight.cyan`, `.highlight.magenta`, `.highlight.green`, `.highlight:hover`, `.highlight .hl-icon`, `.highlight .hl-text`
   - `.about-divider`, `.div-bar`, `.div-pixels` y sus animaciones pixel
   - `.about-contact`, `.contact-grid`
   - `.contact-intro` estilos (`.kicker` dentro de contact-intro ya existe globalmente)
   - `.contact-title`, `.contact-sub`, `.contact-tips`, `.tip`, `.tip-led`, `.tip-led.y`, `.tip-led.m`
   - `.contact-form`, `.contact-form::before`, `.contact-form.shake`, `@keyframes shake`
   - Estilos de inputs/textarea dentro de `.contact-form` (label, input, textarea, focus states)
   - `.terminal-success`, `.term-bar`, `.term-bar .dot`, `.term-bar .dot.r/y/g`, `.term-title`
   - `.term-body`, `.term-body .line`, `.term-body .prompt`, `.term-body .dim`, `.term-body .success`, `.term-body .caret`
   - Media queries del about (`.highlight-row` a 1 columna en ≤820px; `.contact-grid` a 1 columna en ≤900px)
   - Nota: `.field`, `.btn`, `@keyframes blink` ya existen desde SPEC 01 — no duplicar.

3. **Route Handler** — Crear `app/api/contact/route.ts`:
   ```ts
   // POST /api/contact
   // Body: { name, email, msg }
   // Llama a Resend y envía a pabloschonwiesner@gmail.com
   // Retorna 200 { ok: true } | 400 { error } | 500 { error }
   ```
   Usar `new Resend(process.env.RESEND_API_KEY)`. Remitente: `onboarding@resend.dev` (dominio verificado por defecto de Resend). Asunto: `[Arcade Vault] Mensaje de {name}`. Cuerpo texto plano: nombre, email y mensaje.

4. **Componente HighlightIcon** — Crear `components/about/HighlightIcon.tsx` como server component. Props: `kind: "HEART" | "BROWSER" | "PLANT"`. Contiene los 3 SVGs pixel-art del prototipo (portarlos fielmente desde `about.jsx`).

5. **About page** — Crear `app/about/page.tsx` como client component (`'use client'`). Estado: `form { name, email, msg }`, `sent: string | null`, `shake: boolean`, `loading: boolean`. Al hacer submit:
   - Si algún campo vacío → `setShake(true)`, timeout 400ms → `setShake(false)`
   - Si todos llenos → POST a `/api/contact` con el payload
   - En `200` → `setSent(form.name)`
   - En cualquier error → `setShake(true)` con el mismo timeout
   - Mostrar `loading` state en el botón durante el fetch (opcional pero recomendado: texto "ENVIANDO…")
   - El `useReveal` del About page debe implementarse localmente (igual que en SPEC 02 — solo lo usa esta página).

6. **Actualizar Nav** — En `components/Nav.tsx`, agregar el link `ABOUT` apuntando a `/about`. Debe detectar pathname activo con `usePathname()` igual que los demás links.

---

## Acceptance criteria

- [ ] `/about` carga sin errores y muestra las dos secciones (hero + contact)
- [ ] El hero muestra el kicker `▸ ACERCA DE`, el título, la misión y las 3 highlight cards (HEART/magenta, BROWSER/cyan, PLANT/green)
- [ ] Hover sobre una highlight card → `translateY(-3px)` con `box-shadow` del color correspondiente
- [ ] El divider animado (barras + píxeles) aparece entre hero y contact
- [ ] La sección contact muestra las 3 tips con LEDs de colores (green, yellow, magenta)
- [ ] Submit con campos vacíos → animación `shake` en el form, no se envía nada
- [ ] Submit con campos completos → botón muestra "ENVIANDO…" mientras espera respuesta
- [ ] Submit exitoso → el form se reemplaza por el terminal retro con el nombre del usuario en verde
- [ ] El botón "ENVIAR OTRO MENSAJE" limpia el form y vuelve al estado inicial
- [ ] El email llega a `pabloschonwiesner@gmail.com` con el asunto `[Arcade Vault] Mensaje de {nombre}`
- [ ] Error en Resend (500) → animación `shake`, no muestra terminal
- [ ] `.reveal` funciona: las secciones aparecen al entrar en el viewport
- [ ] El Nav muestra el link `ABOUT` activo cuando se está en `/about`
- [ ] `npm run build` pasa sin errores de TypeScript

---

## Decisions taken and discarded

| Decisión | Elegida | Descartada | Motivo |
|---|---|---|---|
| Envío de email | Route Handler en `app/api/contact/route.ts` | Server Action | La API key queda en el servidor; el Route Handler es más explícito sobre errores HTTP |
| Email destino | `pabloschonwiesner@gmail.com` | Otra dirección | Email ya confirmado del usuario del proyecto |
| Remitente | `onboarding@resend.dev` | Dominio propio | Dominio propio de Resend funciona out-of-the-box sin configuración DNS adicional |
| Estado de éxito | Terminal retro fiel al prototipo | Toast / alert | El terminal es parte de la identidad visual; reemplazarlo rompe la estética |
| Validación | Client-side (campo no vacío) + server-side (misma regla) | Solo client-side | El Route Handler valida independientemente para prevenir llamadas directas a la API |
| `useReveal` | Hook local en el componente About | Shared hook en `hooks/` | Consistente con la decisión de SPEC 02; evita abstracción prematura |
| Guardado de mensajes | No (solo email) | Guardar en localStorage | Los mensajes son para el equipo, no para el usuario; localStorage no aplica |

---

## Identified risks

- **Dominio de Resend en producción**: `onboarding@resend.dev` funciona en modo test pero puede tener limitaciones en producción. Si se necesita enviar desde un dominio propio, se requiere configurar DNS en Resend (fuera de scope de este spec).
- **`RESEND_API_KEY` en Vercel/deploy**: la variable debe agregarse manualmente en las variables de entorno del hosting; `.env.local` no se sube al repo.
- **Concurrencia de submits**: el botón debe deshabilitarse durante el fetch (`loading`) para evitar doble envío — incluir esto en el paso 5.
- **CORS**: el Route Handler solo se llama desde el mismo origen (el form de Next.js), no hay riesgo de CORS cross-origin.
