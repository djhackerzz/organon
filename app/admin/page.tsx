import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getSpecimens } from '@/app/actions/specimens'
import { AdminHeader } from '@/components/admin-header'
import { SpecimenCard } from '@/components/specimen-card'
import { AddSpecimenButton } from '@/components/add-specimen-button'

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-foreground">{specimens.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Specimens</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-foreground">
              {new Set(specimens.map((s) => s.systemCategory)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Body Systems</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-2xl font-bold text-foreground">
              {specimens.filter((s) => s.imageUrl).length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">With Photos</p>
          </div>
        </div>

        {/* Header + Add button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Specimens</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your museum collection
            </p>
          </div>
          <AddSpecimenButton />
        </div>

        {specimens.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground text-sm">
              No specimens yet. Add your first one above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
