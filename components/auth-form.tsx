'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

async function isAdminAfterLogin(): Promise<boolean> {
  // Retry up to 3 times with a short delay to allow the session cookie to be committed
  for (let i = 0; i < 3; i++) {
    try {
      if (i > 0) await new Promise((r) => setTimeout(r, 300))
      const res = await fetch('/api/auth/session/role', { cache: 'no-store' })
      if (!res.ok) continue
      const payload = await res.json()
      if (payload?.isAdmin) return true
      if (payload?.role) return false // got a valid response, not admin
    } catch {
      // retry
    }
  }
  return false
}

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let { data, error } = isSignUp
      ? await authClient.signUp.email({ email, password, name: name || email.split('@')[0] })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Invalid email or password credentials.')
      return
    }

    // Fresh session is the authoritative source for role-based redirects, but
    // we also consult the role table-backed admin check because the stored role
    // may already be normalized by the server before the client lander runs.
    const sessionRes = await authClient.getSession()
    const role = String((sessionRes.data?.user as any)?.role || (data?.user as any)?.role || '').toLowerCase()
    const adminBySession = role === 'admin' || role === 'super-admin'
    // Always do the server-side role lookup — it's the authoritative check
    const adminByServerRoleLookup = await isAdminAfterLogin()

    if (adminBySession || adminByServerRoleLookup) {
      router.push('/admin')
      router.refresh()
      return
    }

    const next = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null
    router.push(next || '/account')
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6 shadow-xl border-border">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp
              ? 'Sign up to track orders, save addresses and request quotes'
              : 'Sign in to your Global Spec Solutions account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
                placeholder="Your full name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="off"
                className="pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-destructive font-medium bg-red-500/10 p-2.5 rounded-lg border border-red-500/20" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold">
            {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign in'}
          </Button>

          {!isSignUp && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                <span>Quick Demo Access</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/ensure-admin', { method: 'POST' })
                  } catch {}
                  setEmail('admin@globalspecsolutions.com')
                  setPassword('Admin@123456!')
                  setError(null)
                }}
                className="w-full py-1.5 px-2.5 text-xs text-left font-medium bg-white dark:bg-slate-800 hover:bg-primary/5 hover:border-primary/40 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-bold text-foreground">Admin Portal Demo</div>
                  <div className="text-[10px] text-muted-foreground">admin@globalspecsolutions.com</div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">Auto-fill →</span>
              </button>
            </div>
          )}
        </form>

        <div className="mt-4 pt-3 border-t border-border text-center text-xs text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </>
          )}
        </div>
      </Card>
    </main>
  )
}