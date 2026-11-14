"use client"

import type { Game } from "@/lib/data"

export default function MiniCard({ game, onClick }: { game: Game; onClick: () => void }) {
  return (
    <div className="mini-card" onClick={onClick}>
      <div className="mini-cover">
        <div className={"cover-bg " + game.cover} />
      </div>
      <div className="mini-meta">
        <div className="mini-title">{game.title}</div>
        <div className="mini-cat">{game.category}</div>
      </div>
    </div>
  )
}
