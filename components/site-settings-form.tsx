'use client'

import { useState, useTransition } from 'react'
import { saveSiteSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SiteSettings } from '@/lib/db/schema'
import { Check, Loader2 } from 'lucide-react'

const headingFields = [
  ['functionsHeading', 'Functions section', 'Physiological Functions'],
  ['clinicalRelevanceHeading', 'Clinical relevance section', 'Clinical Relevance'],
  ['specimenDetailsHeading', 'Specimen details section', 'Specimen Details'],
  ['donorInformationHeading', 'Donor information section', 'Donor Information (Anonymized)'],
  ['additionalNotesHeading', 'Additional notes section', 'Additional Notes'],
] as const

const visibilityFields = [
  ['showImages', 'Images', 'Show specimen photos and diagrams'],
  ['showFunctions', 'Functions', 'Show the physiological functions section'],
  ['showClinicalRelevance', 'Clinical relevance', 'Show the clinical relevance section'],
  ['showSpecimenDetails', 'Specimen details', 'Show the specimen details section'],
  ['showDonorInformation', 'Donor information', 'Show anonymized donor information when available'],
  ['showAdditionalNotes', 'Additional notes', 'Show additional notes when available'],
  ['showFooter', 'Footer', 'Show the catalog footer'],
] as const

type FormData = Omit<SiteSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

export function SiteSettingsForm({ initialSettings }: { initialSettings: FormData }) {
  const [form, setForm] = useState<FormData>(initialSettings)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setMessage(null)
    setError(null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startTransition(async () => {
      try {
        await saveSiteSettings(form)
        setMessage('Settings saved. Public specimen pages are updated.')
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to save settings.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="font-semibold text-foreground">Public page headings</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Rename the section labels shown on every public specimen page.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {headingFields.map(([key, label, placeholder]) => (
            <div key={key} className="flex flex-col gap-2">
              <Label htmlFor={key}>{label}</Label>
              <Input id={key} value={form[key]} placeholder={placeholder} maxLength={80} onChange={(event) => update(key, event.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="font-semibold text-foreground">Visible sections</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Choose which optional sections visitors can see. Changes apply globally.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {visibilityFields.map(([key, label, description]) => (
            <label key={key} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
              <input type="checkbox" checked={form[key]} onChange={(event) => update(key, event.target.checked)} className="mt-0.5 size-4 accent-primary" />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Check data-icon="inline-start" />}
          {isPending ? 'Saving…' : 'Save settings'}
        </Button>
        {message && <p className="text-sm text-primary" role="status">{message}</p>}
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      </div>
    </form>
  )
}
