'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from '../login/page.module.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(
        error.message === 'User already registered'
          ? 'Diese E-Mail-Adresse ist bereits registriert.'
          : error.message
      )
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>N</span>
              <span className={styles.logoText}>Navia.</span>
            </Link>
          </div>
          <h1 className={styles.title}>E-Mail bestätigen</h1>
          <p className={styles.subtitle}>
            Wir haben Ihnen eine Bestätigungsmail an <strong>{email}</strong> gesendet.
            Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
          </p>
          <p className={styles.footer}>
            <Link href="/login" className={styles.link}>
              Zur Anmeldung
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>N</span>
            <span className={styles.logoText}>Navia.</span>
          </Link>
        </div>

        <h1 className={styles.title}>Konto erstellen</h1>
        <p className={styles.subtitle}>Kostenlos registrieren und loslegen</p>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>E-Mail-Adresse</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@beispiel.ch"
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              className={styles.input}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm" className={styles.label}>Passwort bestätigen</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Wird registriert…' : 'Kostenlos registrieren'}
          </button>
        </form>

        <p className={styles.footer}>
          Bereits ein Konto?{' '}
          <Link href="/login" className={styles.link}>
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  )
}
