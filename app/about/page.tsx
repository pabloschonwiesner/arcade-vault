'use client'

import { useEffect, useState } from 'react'
import HighlightIcon from '@/components/about/HighlightIcon'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const HIGHLIGHTS = [
  { kind: 'HEART',   text: 'HECHO CON ❤️ PARA JUGADORES',                       color: 'magenta' },
  { kind: 'BROWSER', text: 'JUEGOS EN HTML — CORREN EN CUALQUIER NAVEGADOR',     color: 'cyan'    },
  { kind: 'PLANT',   text: 'PROYECTO EN CONSTANTE CRECIMIENTO',                  color: 'green'   },
] as const

export default function AboutPage() {
  useReveal()

  const [form, setForm] = useState({ name: '', email: '', msg: '' })
  const [sent, setSent] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.msg.trim()) {
      triggerShake()
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), msg: form.msg.trim() }),
      })
      if (res.ok) {
        setSent(form.name.trim())
      } else {
        triggerShake()
      }
    } catch {
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="about fade-in">

      {/* HERO */}
      <section className="about-hero">
        <div className="kicker pixel neon-yellow">▸ ACERCA DE</div>
        <h1 className="about-title">ACERCA DE ARCADE VAULT</h1>
        <p className="about-mission">
          ARCADE VAULT nació del amor por los videojuegos clásicos. Nuestra misión es preservar y celebrar
          los arcades que definieron una generación, haciéndolos accesibles para todos, en cualquier lugar
          y sin costo.
        </p>

        <div className="highlight-row">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.kind}
              className={`highlight ${h.color}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <HighlightIcon kind={h.kind} />
              <div className="hl-text pixel">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="about-divider reveal" aria-hidden="true">
        <div className="div-bar" />
        <div className="div-pixels">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <div className="div-bar" />
      </div>

      {/* CONTACT */}
      <section className="about-contact reveal">
        <div className="contact-grid">

          <div className="contact-intro">
            <div className="kicker pixel neon-cyan">▸ CONTACTO</div>
            <h2 className="contact-title">CONTÁCTANOS</h2>
            <p className="contact-sub">
              ¿Tienes alguna sugerencia, quieres proponer un juego, o simplemente quieres saludar?
              Escríbenos.
            </p>
            <div className="contact-tips">
              <div className="tip"><span className="tip-led" />RESPUESTA EN 24-48H</div>
              <div className="tip"><span className="tip-led y" />SUGERENCIAS BIENVENIDAS</div>
              <div className="tip"><span className="tip-led m" />SIN SPAM, JAMÁS</div>
            </div>
          </div>

          <form className={`contact-form${shake ? ' shake' : ''}`} onSubmit={onSubmit}>
            {!sent ? (
              <>
                <div className="field">
                  <label>NOMBRE</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="px_kai"
                    disabled={loading}
                  />
                </div>
                <div className="field">
                  <label>CORREO ELECTRÓNICO</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jugador@vault.gg"
                    disabled={loading}
                  />
                </div>
                <div className="field">
                  <label>MENSAJE</label>
                  <textarea
                    rows={5}
                    value={form.msg}
                    onChange={(e) => setForm({ ...form, msg: e.target.value })}
                    placeholder="Cuéntanos qué tienes en mente…"
                    disabled={loading}
                  />
                </div>
                <button
                  className="btn xl press"
                  type="submit"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'ENVIANDO…' : '▶  ENVIAR MENSAJE'}
                </button>
              </>
            ) : (
              <div className="terminal-success">
                <div className="term-bar">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="term-title">VAULT-OS // TERMINAL</span>
                </div>
                <div className="term-body">
                  <div className="line"><span className="prompt">vault@arcade:~$</span> ./send_message --to=team</div>
                  <div className="line dim">[OK] Conectando con servidor…</div>
                  <div className="line dim">[OK] Validando contenido…</div>
                  <div className="line dim">[OK] Transmitiendo paquete…</div>
                  <div className="line success">
                    &gt; MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, {sent.toUpperCase()}.<span className="caret">_</span>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => { setSent(null); setForm({ name: '', email: '', msg: '' }) }}
                    >
                      ENVIAR OTRO MENSAJE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

        </div>
      </section>

    </div>
  )
}
