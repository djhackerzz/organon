'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

function MuseumMark() {
  return (
    <span
      className="grid h-14 w-14 place-items-center rounded-full border border-foreground/70"
      aria-hidden="true"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-foreground/40">
        <span className="font-display text-2xl font-semibold italic leading-none text-foreground">
          A
        </span>
      </span>
    </span>
  )
}

function Ornament() {
  return (
    <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary" aria-hidden="true" />
  )
}

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center justify-center">
            <MuseumMark />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Museum of Anatomy
          </h1>
          <div className="fleuron mt-4">
            <span className="text-primary">
              <Ornament />
            </span>
          </div>
          <p className="mt-3 font-sans text-xs tracking-[0.22em] text-muted-foreground uppercase">
            Admin Portal
          </p>
        </div>

        <Card className="rounded-sm p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {isSignUp ? 'Register a keeper' : 'Sign in'}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {isSignUp
                ? 'Set up the account that manages this collection'
                : 'Enter the catalogue to manage the collection'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Dr. Ramesh Kumar"
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
                autoComplete="email"
                placeholder="you@college.edu.in"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="Min. 8 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-1 w-full">
              {loading
                ? 'Please wait...'
                : isSignUp
                  ? 'Create account'
                  : 'Sign in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already a keeper? ' : "Not a keeper yet? "}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center font-sans text-[0.65rem] tracking-[0.2em] text-muted-foreground/80 uppercase">
          Curated collection of the teaching museum
        </p>
      </div>
    </main>
  )
}
