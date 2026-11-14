import type { ScoreEntry } from "./data"

export interface User {
  name: string
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("av_user")
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function setUser(u: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("av_user", JSON.stringify(u))
}

export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("av_user")
}

export function getScores(): ScoreEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("av_scores")
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : []
  } catch {
    return []
  }
}

export function saveScore(e: ScoreEntry): void {
  if (typeof window === "undefined") return
  const scores = getScores()
  scores.push(e)
  localStorage.setItem("av_scores", JSON.stringify(scores))
}
