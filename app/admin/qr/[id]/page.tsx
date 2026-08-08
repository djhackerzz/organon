import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getSpecimenById } from '@/app/actions/specimens'
import { QRCodeDisplay } from '@/components/qr-code-display'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function QRPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session?.user) redirect('/sign-in')

  const specimen = await getSpecimenById(id)
  if (!specimen) notFound()

  // Always encode the QR with the real published app URL, not the v0 preview/chat host.
  // BETTER_AUTH_URL is set to the custom production domain in deployment settings.
  const configuredBaseUrl = process.env.BETTER_AUTH_URL?.replace(/\/$/, '')
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'localhost:3000'
  const forwardedProto = requestHeaders.get('x-forwarded-proto')
  const protocol = forwardedProto ?? (host.includes('localhost') ? 'http' : 'https')
  const runtimeBaseUrl = `${protocol}://${host}`
  const publicBaseUrl = configuredBaseUrl || runtimeBaseUrl
  const publicUrl = `${publicBaseUrl}/specimen/${encodeURIComponent(id)}`

  return (
    <div className="min-h-svh bg-background">
      <div className="border-b border-border px-4 py-3 print:hidden">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <main className="flex min-h-[calc(100svh-57px)] flex-col items-center justify-center px-4 py-10 print:min-h-0 print:px-0 print:py-0">
        <div className="mb-6 text-center print:hidden">
          <p className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{specimen.specimenNumber}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{specimen.name}</h1>
          <p className="mt-1 font-sans text-xs text-muted-foreground">QR Label — print and laminate for the jar</p>
        </div>

        <QRCodeDisplay
          url={publicUrl}
          specimenNumber={specimen.specimenNumber}
          specimenName={specimen.name}
          systemCategory={specimen.systemCategory}
          preservationMethod={specimen.preservationMethod}
        />
      </main>
    </div>
  )
}
