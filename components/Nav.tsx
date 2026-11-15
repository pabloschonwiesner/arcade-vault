"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { getUser, clearUser } from "@/lib/session"
import type { User } from "@/lib/session"

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setUser(getUser())
    const sync = () => setUser(getUser())
    window.addEventListener("av-session-change", sync)
    return () => window.removeEventListener("av-session-change", sync)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/biblioteca") return pathname === "/biblioteca" || pathname.startsWith("/games")
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleSignOut = () => {
    clearUser()
    setUser(null)
    window.dispatchEvent(new Event("av-session-change"))
    setOpen(false)
    router.push("/")
  }

  const close = () => setOpen(false)

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>

        <div className="links">
          <Link href="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link href="/biblioteca" className={isActive("/biblioteca") ? "active" : ""}>Biblioteca</Link>
          <Link href="/salon" className={isActive("/salon") ? "active" : ""}>Salón de la Fama</Link>
          <Link href="/about" className={isActive("/about") ? "active" : ""}>About</Link>
        </div>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <button className="btn ghost auth-btn" onClick={handleSignOut}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">Iniciar Sesión</Link>
        )}

        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={"av-mobile-backdrop" + (open ? " open" : "")}
        onClick={close}
      />
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>MENÚ</div>
        <Link href="/" className={isActive("/") ? "active" : ""} onClick={close}>Home</Link>
        <Link href="/biblioteca" className={isActive("/biblioteca") ? "active" : ""} onClick={close}>Biblioteca</Link>
        <Link href="/salon" className={isActive("/salon") ? "active" : ""} onClick={close}>Salón de la Fama</Link>
        <Link href="/about" className={isActive("/about") ? "active" : ""} onClick={close}>About</Link>
        <Link href="/auth" className={isActive("/auth") ? "active" : ""} onClick={close}>
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  )
}
