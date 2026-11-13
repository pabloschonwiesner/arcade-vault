# SPEC 01 — Arcade Vault MVP Visual

**State:** Approved  
**Depends on:** —  
**Date:** 2026-11-12  
**Objective:** Migrar todas las pantallas del prototipo vanilla a Next.js App Router con navegación completa, auth/scores en localStorage y un reproductor placeholder.

---

## Scope

**En scope:**
- 5 pantallas: Biblioteca, Detalle, Reproductor (placeholder), Auth, Salón de la Fama
- Componente Nav compartido (responsive, hamburger en mobile)
- Sistema de diseño completo portado desde `styles.css` (custom properties, animaciones, fondo)
- Fuentes: Press Start 2P + JetBrains Mono via `next/font/google`
- Estado de sesión funcional con `localStorage` (`av_user`)
- Scores funcional con `localStorage` (`av_scores`) usando datos seeded
- Navegación entre pantallas sin full-page reload (Next.js `<Link>`)
- Efecto 3D tilt en las cards de juego

**Fuera de scope:**
- Implementación de juegos reales (ningún juego corre en el reproductor)
- Backend, base de datos, o API real
- Sistema de autenticación real (solo mock con localStorage)
- Tests automatizados
- SEO / metadata avanzada
- Internacionalización

---

## Data model

### `lib/data.ts`
Port directo de `references/templates/data.jsx`:

```ts
interface Game {
  id: string
  title: string
  category: string
  description: string
  thumbnail: string   // URL de imagen placeholder
  year: number
  rating: number
}

interface ScoreEntry {
  user: string
  game: string
  score: number
  date: string
}

export const GAMES: Game[]
export const CATS: string[]          // lista de categorías para el filtro
export function seededScores(): ScoreEntry[]
```

### `lib/session.ts`
Helpers para localStorage:

```ts
interface User { name: string }

export function getUser(): User | null        // lee av_user
export function setUser(u: User): void        // escribe av_user
export function clearUser(): void             // borra av_user
export function getScores(): ScoreEntry[]     // lee av_scores
export function saveScore(e: ScoreEntry): void
```

---

## Implementation plan

Cada paso deja el sistema compilando y navegable.

1. **CSS global** — Portar `references/templates/styles.css` a `app/globals.css`. Mantener todas las custom properties (`--bg`, `--cyan`, `--magenta`, etc.), keyframes (`gridScroll`, `scanMove`, `neonPulse`) y clases de utilidad. Reemplazar las directivas `@tailwind` viejas por `@import "tailwindcss"` (Tailwind v4).

2. **Layout raíz** — En `app/layout.tsx`: cargar Press Start 2P y JetBrains Mono via `next/font/google`, agregar los divs `<div className="av-bg" />` y `<div className="av-noise" />` antes de `{children}`, aplicar variables de fuente al `<body>`.

3. **Datos** — Crear `lib/data.ts` portando `GAMES`, `CATS` y `seededScores()` desde el prototipo. Usar imágenes de `https://placehold.co` como thumbnails donde el prototipo use URLs externas rotas.

4. **Session helpers** — Crear `lib/session.ts` con `getUser`, `setUser`, `clearUser`, `getScores`, `saveScore`. Wrapper de `localStorage` con guard para SSR (`typeof window !== 'undefined'`).

5. **Componente Nav** — Crear `components/Nav.tsx` (client component). Mostrar logo, links a todas las rutas, nombre de usuario si hay sesión activa, botón logout. Panel hamburger en mobile. Incluir en `app/layout.tsx`.

6. **Página Biblioteca** (`app/page.tsx` o `app/biblioteca/page.tsx`) — Grid de cards con filtro por categoría. Efecto 3D tilt via `onMouseMove` con `useRef`. Cada card navega a `/games/[id]` con `<Link>`.

7. **Página Detalle** (`app/games/[id]/page.tsx`) — Recibe `id` del segmento dinámico, busca el juego en `GAMES`. Muestra thumbnail, descripción, metadata. Botón "Jugar" navega a `/games/[id]/play`. Botón "Volver" navega a `/`.

8. **Página Reproductor** (`app/games/[id]/play/page.tsx`) — Muestra el título del juego y los controles de la UI (igual que el prototipo), pero el área central del juego muestra un placeholder con texto "PRÓXIMAMENTE" en estilo retro (Press Start 2P, efecto neon).

9. **Página Auth** (`app/auth/page.tsx`) — Tabs Login / Registro. Login: lee `av_user`, si coincide nombre → setUser → redirect a `/`. Registro: escribe nuevo user en `av_user` → redirect a `/`. Usar `useRouter` para redirect. Validación básica: campo no vacío.

10. **Página Salón de la Fama** (`app/salon/page.tsx`) — Tabla con top scores de `seededScores()`. Columnas: posición, usuario, juego, score, fecha. Estilo con colores `--gold`, `--silver`, `--bronze` para los tres primeros puestos.

---

## Acceptance criteria

- [ ] `npm run dev` arranca sin errores y todas las rutas responden 200
- [ ] `/` muestra el grid de juegos con thumbnails y categorías
- [ ] El filtro de categorías en Biblioteca muestra/oculta cards correctamente
- [ ] El efecto 3D tilt se activa al hacer hover sobre una card
- [ ] Click en una card navega a `/games/[id]` mostrando los datos correctos de ese juego
- [ ] `/games/[id]/play` muestra el layout del reproductor con placeholder "PRÓXIMAMENTE", no una pantalla en blanco
- [ ] `/auth` permite registrarse: ingresando nombre → guarda `av_user` en localStorage → redirige a `/`
- [ ] `/auth` permite login: ingresando nombre existente → guarda sesión → redirige a `/`
- [ ] El Nav muestra el nombre del usuario logueado cuando hay sesión activa
- [ ] Logout borra `av_user` de localStorage y el Nav vuelve a mostrar el link de login
- [ ] `/salon` muestra tabla de scores con al menos 10 entradas de `seededScores()`
- [ ] Los tres primeros del Salón tienen estilos gold/silver/bronze
- [ ] El fondo animado (grid perspectiva + scanlines) se ve en todas las páginas
- [ ] El Nav en mobile muestra el botón hamburger y el panel se abre/cierra correctamente
- [ ] Los colores y fuentes coinciden visualmente con el prototipo (`references/templates/Arcade Vault.html`)

---

## Decisions taken and discarded

| Decisión | Elegida | Descartada | Motivo |
|---|---|---|---|
| Carga de fuentes | `next/font/google` | `<link>` directo | Mejor performance, sin FOUT, alineado con las convenciones del proyecto |
| Persistencia de sesión | `localStorage` | Server session / cookies | No hay backend en scope; el prototipo usa localStorage |
| Juegos en reproductor | Placeholder "Próximamente" | iframe vacío / excluir ruta | Mantiene la navegación completa y la UX coherente del MVP |
| Routing | App Router con segmentos dinámicos | Pages Router | El proyecto ya está configurado con App Router |
| Estado global | React state local + localStorage | Context API / Zustand | La app es simple; el prototipo no usa estado global complejo |
| Validación en Auth | Solo campo no vacío | Validación completa | MVP visual; sin backend no hay validación real posible |

---

## Identified risks

- **`next/font/google` y Press Start 2P**: verificar que la fuente esté disponible en el catálogo de Google Fonts via `next/font`. Si no, usar `localFont` con un archivo descargado.
- **Efecto 3D tilt**: requiere `useRef` y event handlers del mouse → el componente de cards debe ser `'use client'`. Verificar que no rompa SSR.
- **`localStorage` en SSR**: todos los accesos a `localStorage` deben estar guardados por `typeof window !== 'undefined'` o dentro de `useEffect` para evitar errores en el servidor.
- **IDs de juegos**: el prototipo usa los IDs del array `GAMES`. Asegurarse de que el segmento `[id]` coincida exactamente con los IDs del data layer portado.
