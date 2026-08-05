'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { LogOut, FlaskConical, QrCode } from 'lucide-react'

interface AdminHeaderProps {
  userName: string
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FlaskConical className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="font-semibold text-foreground text-sm">
            Anatomy Museum
          </span>
          <span className="text-muted-foreground text-sm hidden sm:inline">
            — Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/label-maker">
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
              QR Label Maker
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground hidden sm:inline pl-1">
            {userName}
          </span>
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
