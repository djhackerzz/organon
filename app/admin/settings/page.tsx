import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getSiteSettings } from '@/app/actions/settings'
import { AdminHeader } from '@/components/admin-header'
import { SiteSettingsForm } from '@/components/site-settings-form'

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const settings = await getSiteSettings()
  const { id, userId, createdAt, updatedAt, ...formSettings } = settings

  return (
    <div className="min-h-svh bg-background">
      <AdminHeader userName={session.user.name} />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Configuration</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">Public page settings</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Control the headings and visible sections shared by every public specimen page.</p>
        </div>
        <SiteSettingsForm initialSettings={formSettings} />
      </main>
    </div>
  )
}
