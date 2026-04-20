import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/useAuth'

export function LoginForm() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    try {
      const fn = mode === 'signin' ? signIn : signUp
      const { error } = await fn(email.trim(), password)
      if (error) setMessage(error.message)
      else if (mode === 'signup')
        setMessage('Check your email to confirm, or sign in if already enabled.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h1 className="auth-title">Supertodos</h1>
      <p className="auth-sub">Sign in with email and password</p>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>
      {message ? <p className="auth-message">{message}</p> : null}
      <button type="submit" className="btn primary" disabled={submitting}>
        {mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>
      <button
        type="button"
        className="btn link"
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
          setMessage(null)
        }}
      >
        {mode === 'signin'
          ? 'Need an account? Sign up'
          : 'Have an account? Sign in'}
      </button>
    </form>
  )
}
