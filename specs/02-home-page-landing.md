# SPEC 02 — Home Page (Landing)

**State:** Implementado  
**Depends on:** SPEC 01  
**Date:** 2026-11-14  
**Objective:** Implementar la página de inicio como landing page principal de Arcade Vault, portando fielmente el diseño de `references/templates/home-about/home-about/home.jsx`.

---

## Scope

**En scope:**
- `app/page.tsx` como landing page (Home)
- Mover la Biblioteca actual de `app/page.tsx` a `app/biblioteca/page.tsx`
- Actualizar `components/Nav.tsx` con links a Home (`/`) y Games (`/games`)
- Sección Hero: eyebrow, título 3 líneas con gradientes, subtítulo, CTAs, scroll hint
- Componente `FloatingSilhouettes`: 8 siluetas SVG pixel-art flotantes en el hero
- Componente `FeatureIcon`: íconos pixel SVG (GAMEPAD, FREE, TROPHY, ROCKET)
- Sección Why (4 feature cards con íconos)
- Sección Games Preview: mini-rail de los primeros 6 juegos de `GAMES`
- Componente `MiniCard`: tarjeta compacta para la mini-rail
- Sección Stats: 3 bloques estadísticos con texto hardcoded
- Sección Actividad en Vivo: ticker de scores + top 5 jugadores, datos hardcoded
- Sección Pricing: una price card + FAQ de 3 ítems
- Sección Final CTA
- Hook `useReveal` para scroll-reveal con `IntersectionObserver` (threshold 0.12)
- CSS de todas las nuevas clases en `app/globals.css`

**Fuera de scope:**
- Página About/Contacto (spec separado)
- Datos en tiempo real o desde backend
- Animaciones de entrada para el hero más allá de `fade-in`
- Tests automatizados

---

## Data model

No se introducen estructuras nuevas. Esta página consume:

- `GAMES` (de `lib/data.ts`): se usan los primeros 6 — `GAMES.slice(0, 6)`
- Datos de actividad en vivo: constantes hardcoded en el componente (igual que el prototipo)

---

## Implementation plan

Cada paso deja el sistema compilando y navegable.

1. **Mover Biblioteca** — Renombrar `app/page.tsx` a `app/biblioteca/page.tsx`. Actualizar cualquier import o referencia interna que use la ruta raíz como Biblioteca.

2. **CSS de Home** — Agregar al final de `app/globals.css` todas las clases del bloque `/* ===== HOME PAGE ===== */` del archivo de referencia `styles.css`:
   - `.home`, `.home-hero`, `.home-hero-inner`, `.hero-eyebrow`, `.home-title`, `.home-sub`, `.home-ctas`, `.hero-scroll`
   - `.home-silos`, `.silo`, `.s1`–`.s8`, `@keyframes float`
   - `.home-section`, `.section-head`, `.section-title`, `.section-rule`
   - `.feature-grid`, `.feature-card`, `.ft-icon`, `.ft-title`, `.ft-desc`
   - `.mini-rail`, `.mini-card`, `.mini-cover`, `.mini-meta`, `.mini-title`, `.mini-cat`
   - `.home-stats`, `.stats-inner`, `.stat-block`, `.stat-n`, `.stat-u`, `.stat-s`
   - `.activity-grid`, `.activity-card`, `.ac-head`, `.ac-title`, `.ticker`, `.tick-row`
   - `.top-list`, `.top-row`, `.top1`/`.top2`/`.top3`, `.tp-rk`, `.tp-bar`, `.tp-fill`, `.tp-p`, `.tp-s`, `.lb-link`
   - `.pricing-grid`, `.price-card`, `.pc-label`, `.pc-name`, `.pc-amount`, `.pc-tag`, `.pc-list`, `.pc-foot`, `.pc-stamp`
   - `.pricing-faq`, `.faq-item`, `.faq-q`, `.faq-a`
   - `.home-final`, `.final-title`, `.final-cta`, `.final-tag`
   - `.reveal`, `.reveal.in`, `@keyframes bounce`
   - Media queries del Home

3. **Componentes auxiliares** — Crear `components/home/FloatingSilhouettes.tsx` con los 8 SVGs pixel-art del prototipo (s1–s8). Crear `components/home/FeatureIcon.tsx` con los 4 íconos (GAMEPAD, FREE, TROPHY, ROCKET). Ambos son server components (sin estado ni handlers).

4. **MiniCard** — Crear `components/home/MiniCard.tsx` como client component (necesita `onClick`). Props: `game: Game`, `onClick: () => void`.

5. **Home page** — Crear `app/page.tsx` como client component (`'use client'`). Implementar el hook `useReveal` localmente. Importar `FloatingSilhouettes`, `FeatureIcon`, `MiniCard`. Usar `useRouter` de `next/navigation` para los botones CTA. Las secciones en orden: Hero → Why → Games Preview → Stats → Actividad en Vivo → Pricing → Final CTA.

6. **Actualizar Nav** — En `components/Nav.tsx`, agregar el link `HOME` apuntando a `/` y actualizar `BIBLIOTECA` para que apunte a `/biblioteca`. El link activo debe detectar el pathname con `usePathname()`.

---

## Acceptance criteria

- [ ] `/` muestra la landing page completa con todas las 7 secciones
- [ ] Las 8 siluetas pixel-art flotan en el hero con animación `float`
- [ ] El título hero muestra 3 líneas: línea 1 blanca, línea 2 con gradiente cyan, línea 3 con gradiente magenta
- [ ] El botón "EXPLORAR JUEGOS" navega a `/biblioteca`
- [ ] El botón "CREAR CUENTA" navega a `/auth`
- [ ] `/biblioteca` sigue mostrando el grid de juegos correctamente (ruta movida)
- [ ] Las 4 feature cards (Why) muestran íconos pixel SVG y efecto hover con glow del color correspondiente
- [ ] La mini-rail muestra exactamente 6 juegos (los primeros del array GAMES)
- [ ] Click en una mini-card navega a `/games/[id]`
- [ ] El botón "VER TODOS LOS JUEGOS" navega a `/biblioteca`
- [ ] La sección Stats muestra los 3 bloques con sus valores hardcoded
- [ ] La sección Actividad en Vivo muestra el ticker con 7 filas y el top-5 con estilos gold/silver/bronze
- [ ] El botón "VER SALÓN →" en la sección Actividad navega a `/salon`
- [ ] La sección Pricing muestra la price card con lista de beneficios y el FAQ de 3 preguntas
- [ ] El botón "EMPEZAR GRATIS" en Pricing navega a `/auth`
- [ ] El botón "INSERTAR MONEDA" en el Final CTA navega a `/biblioteca`
- [ ] El scroll-reveal funciona: las secciones con `.reveal` aparecen al entrar en el viewport
- [ ] El Nav muestra el link "HOME" activo cuando se está en `/` y "BIBLIOTECA" activo en `/biblioteca`
- [ ] `npm run build` pasa sin errores de TypeScript

---

## Decisions taken and discarded

| Decisión | Elegida | Descartada | Motivo |
|---|---|---|---|
| Ruta raíz | Home en `/`, Biblioteca en `/biblioteca` | Biblioteca sigue en `/`, Home en `/home` | El Home es la puerta de entrada del portal; la URL `/home` es redundante |
| Datos de actividad en vivo | Hardcoded (igual al prototipo) | Desde `seededScores()` | Son datos decorativos; alimentarlos desde el data layer agrega complejidad sin valor visual |
| About/Contacto | Spec separado | Incluido aquí | Mantiene el scope manejable; About y Home son pantallas independientes |
| FloatingSilhouettes y FeatureIcon | Componentes separados en `components/home/` | Inline en page.tsx | Mejor legibilidad; ambos son bloques de SVG sin lógica propia |
| `useReveal` | Hook local en el componente Home | Shared hook en `hooks/` | Solo lo usa el Home; extraerlo sería prematura abstracción |

---

## Identified risks

- **Rutas existentes que apuntan a `/`**: si algún `<Link href="/">` asumía que `/` era Biblioteca, ahora llevará al Home. Revisar `components/Nav.tsx` y cualquier botón "Volver" en Detalle/Reproductor.
- **`useReveal` y SSR**: el `IntersectionObserver` no existe en Node; usar `'use client'` en el componente Home evita el error, pero verificar que no haya hydration mismatch con las clases `.reveal` / `.reveal.in`.
- **Imágenes en MiniCard**: el prototipo usa clases CSS `.cover-bg .cover-X` para los covers. Las mismas clases ya existen en globals.css (portadas en SPEC 01); solo asegurarse de que el campo `cover` del `Game` esté disponible (revisar el tipo en `lib/data.ts`).
