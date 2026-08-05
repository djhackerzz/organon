import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getSpecimenById } from '@/app/actions/specimens'
import { QRCodeDisplay } from '@/components/qr-code-display'

interface Props {
  params: Promise<{ id: string }>
}

export default async function QRPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const { id } = await params
  const specimen = await getSpecimenById(id)
  if (!specimen) notFound()

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const publicUrl = `${protocol}://${host}/specimen/${specimen.id}`

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <QRCodeDisplay specimen={specimen} publicUrl={publicUrl} />
      </div>
    </div>
  )
}
