import { GAMES } from "@/lib/data"
import Link from "next/link"
import { notFound } from "next/navigation"

export const instant = false

export function generateStaticParams() {
  return GAMES.map((game) => ({ id: game.id }))
}

export default async function GamePlayer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = GAMES.find((g) => g.id === id)
  if (!game) notFound()

  return (
    <div className="av-player fade-in">
      <div className="player-hud">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div className="hud-stat">
            <div className="l">Juego</div>
            <div className="v" style={{ color: "var(--ink)" }}>{game.title}</div>
          </div>
          <div className="hud-stat">
            <div className="l">Puntuación</div>
            <div className="v">000000</div>
          </div>
          <div className="hud-stat lives">
            <div className="l">Vidas</div>
            <div className="v">♥ ♥ ♥</div>
          </div>
          <div className="hud-stat level">
            <div className="l">Nivel</div>
            <div className="v">01</div>
          </div>
        </div>
        <div className="hud-actions">
          <Link href={`/games/${game.id}`} className="btn ghost">SALIR</Link>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="crt-content">
            <div>
              <div className="pixel neon-cyan" style={{ fontSize: 18, marginBottom: 20 }}>
                PRÓXIMAMENTE
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-dim)", letterSpacing: "0.16em", marginBottom: 12 }}>
                {game.title}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.14em" }}>
                INSERTAR MONEDA PARA CONTINUAR
              </div>
            </div>
          </div>
        </div>
        <div className="crt-bottom">
          <span className="led">SEÑAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>
    </div>
  )
}
