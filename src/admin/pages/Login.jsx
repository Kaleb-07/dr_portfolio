import { Lock, LogIn, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      navigate('/admin')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-12 text-ink">
      <section className="w-full max-w-md border border-rule bg-paper-card p-6 shadow-[0_18px_60px_rgba(13,13,13,0.06)] sm:p-8">
        <div className="mb-8 border-b border-rule pb-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-teal">Admin Access</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Sign in to CMS</h1>
          <p className="mt-3 text-sm font-light leading-relaxed text-ink-mid">
            Manage portfolio content with the same editorial tone as the public site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">Email</span>
            <span className="flex items-center gap-3 border border-rule bg-paper px-4 py-3 focus-within:border-teal">
              <Mail size={17} className="text-teal" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                placeholder="admin@example.com"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">Password</span>
            <span className="flex items-center gap-3 border border-rule bg-paper px-4 py-3 focus-within:border-teal">
              <Lock size={17} className="text-teal" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                placeholder="Enter password"
                required
              />
            </span>
          </label>

          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 bg-teal px-6 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-teal-mid disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogIn size={16} />
            {isSubmitting ? 'Signing in' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}
