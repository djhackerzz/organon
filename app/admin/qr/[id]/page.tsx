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

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const specimen = await getSpecimenById(id)
  if (!specimen) notFound()

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const publicUrl = `${protocol}://${host}/specimen/${id}`

  return (
    <div className="min-h-svh bg-background flex flex-col">
      {/* Top nav */}
      <div className="border-b border-border px-4 py-3">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            {specimen.specimenNumber}
          </p>
          <h1 className="text-xl font-bold text-foreground mt-1">
            {specimen.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            QR Label — print and laminate for the jar
          </p>
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
