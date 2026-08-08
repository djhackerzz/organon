'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

interface AdminHeaderProps {
  userName: string
}

function MuseumMark({ className }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-full border border-foreground/70 ${className ?? 'h-8 w-8'}`}
      aria-hidden="true"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full border border-foreground/40">
        <span className="font-display text-[0.78rem] font-semibold italic leading-none text-foreground">
          A
        </span>
      </span>
    </span>
  )
}

export function AdminHeader({ userName }: AdminHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <MuseumMark />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
              Museum of Anatomy
            </span>
            <span className="mt-1 truncate font-sans text-[0.55rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Admin Catalogue
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden pr-1 font-sans text-xs text-muted-foreground sm:inline">
            {userName}
          </span>
          <Button
            render={<Link href="/admin/settings" />}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
