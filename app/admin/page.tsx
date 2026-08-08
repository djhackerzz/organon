import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getSpecimens } from '@/app/actions/specimens'
import { AdminHeader } from '@/components/admin-header'
import { SpecimenCard } from '@/components/specimen-card'
import { AddSpecimenButton } from '@/components/add-specimen-button'

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-sm border border-border bg-card px-4 py-5">
      <p className="font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1.5 font-sans text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const specimens = await getSpecimens()

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  return (
    <div className="min-h-svh bg-background">
      <AdminHeader userName={session.user.name} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <Stat value={specimens.length} label="Total specimens" />
          <Stat
            value={new Set(specimens.map((s) => s.systemCategory)).size}
            label="Body systems"
          />
          <Stat
            value={specimens.filter((s) => s.imageUrl || s.specimenPhotoUrl).length}
            label="With photos"
          />
        </div>

        {/* Header + Add button */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Specimens
              </h1>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the museum collection
            </p>
          </div>
          <AddSpecimenButton />
        </div>

        {specimens.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border py-20 text-center">
            <p className="font-display text-lg italic text-muted-foreground">
              The catalogue is empty.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first specimen above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specimens.map((specimen) => (
              <SpecimenCard
                key={specimen.id}
                specimen={specimen}
                baseUrl={baseUrl}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
