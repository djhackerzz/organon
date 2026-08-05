'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createSpecimen, updateSpecimen } from '@/app/actions/specimens'
import type { Specimen } from '@/lib/db/schema'
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'

const BODY_SYSTEMS = [
  'Cardiovascular System',
  'Respiratory System',
  'Digestive System',
  'Nervous System',
  'Musculoskeletal System',
  'Urinary System',
  'Reproductive System',
  'Endocrine System',
  'Lymphatic & Immune System',
  'Integumentary System',
  'Special Senses',
]

const PRESERVATION_METHODS = [
  '10% Formalin',
  'Alcohol (70%)',
  'Glycerine',
  'Kaiserling Method',
  'Thiel Method',
  'Dry Preservation',
]

interface SpecimenFormProps {
  specimen?: Specimen
  onSuccess?: () => void
}

type AIStatus = 'idle' | 'loading' | 'success' | 'error'

export function SpecimenForm({ specimen, onSuccess }: SpecimenFormProps) {
  const router = useRouter()
  const isEdit = !!specimen

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle')
  const [aiError, setAiError] = useState<string | null>(null)
  const [diagramAttribution, setDiagramAttribution] = useState<string | null>(
    specimen ? null : null
  )

  const [form, setForm] = useState({
    name: specimen?.name ?? '',
    systemCategory: specimen?.systemCategory ?? '',
    specimenNumber: specimen?.specimenNumber ?? '',
    organ: specimen?.organ ?? '',
    sex: specimen?.sex ?? '',
    age: specimen?.age ?? '',
    preservationMethod: specimen?.preservationMethod ?? '',
    jarSize: specimen?.jarSize ?? '',
    collectionDate: specimen?.collectionDate ?? '',
    donorInfo: specimen?.donorInfo ?? '',
    description: specimen?.description ?? '',
    functions: specimen?.functions ?? '',
    clinicalRelevance: specimen?.clinicalRelevance ?? '',
    imageUrl: specimen?.imageUrl ?? '',
    additionalNotes: specimen?.additionalNotes ?? '',
  })

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleAIGenerate = async () => {
    const organName = form.organ.trim() || form.name.trim()
    if (!organName) {
      setAiError('Please enter the Organ or Display Name first.')
      setAiStatus('error')
      return
    }
    setAiStatus('loading')
    setAiError(null)
    try {
      const res = await fetch('/api/generate-specimen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organName }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Unknown error')

      const d = json.data
      setForm((f) => ({
        ...f,
        name: f.name || d.name,
        organ: f.organ || d.organ,
        systemCategory: d.systemCategory,
        description: d.description,
        functions: d.functions,
        clinicalRelevance: d.clinicalRelevance,
        // Only set diagram URL if no custom image already set
        imageUrl: f.imageUrl || d.wikipediaDiagramUrl || '',
      }))
      if (d.wikipediaSource) setDiagramAttribution(d.wikipediaSource)
      setAiStatus('success')
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate')
      setAiStatus('error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isEdit && specimen) {
        await updateSpecimen(specimen.id, form)
      } else {
        await createSpecimen({
          ...form,
          sex: form.sex || undefined,
          age: form.age || undefined,
          jarSize: form.jarSize || undefined,
          collectionDate: form.collectionDate || undefined,
          donorInfo: form.donorInfo || undefined,
          imageUrl: form.imageUrl || undefined,
          additionalNotes: form.additionalNotes || undefined,
        })
      }
      onSuccess?.()
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ── AI Generate Banner ── */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">AI Auto-Fill</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type the organ name below, then click &ldquo;Generate&rdquo; — AI will fill description, functions, clinical relevance, and fetch a labeled diagram from Wikipedia automatically.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter organ name first (e.g. Kidney, Liver, Brain…)"
            value={form.organ}
            onChange={(e) => set('organ')(e.target.value)}
            className="flex-1 text-sm"
          />
          <Button
            type="button"
            onClick={handleAIGenerate}
            disabled={aiStatus === 'loading'}
            className="shrink-0 gap-1.5"
          >
            {aiStatus === 'loading' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Generate
              </>
            )}
          </Button>
        </div>

        {aiStatus === 'success' && (
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Fields filled successfully. Review and edit anything before saving.</span>
          </div>
        )}
        {aiStatus === 'error' && aiError && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{aiError}</span>
          </div>
        )}
      </div>

      {/* ── Identification ── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Identification
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="specimenNumber">Specimen Number *</Label>
            <Input
              id="specimenNumber"
              value={form.specimenNumber}
              onChange={(e) => set('specimenNumber')(e.target.value)}
              required
              placeholder="e.g. ANT-HRT-001"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
              required
              placeholder="e.g. Human Heart"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="systemCategory">Body System *</Label>
            <Select
              value={form.systemCategory}
              onValueChange={set('systemCategory')}
              required
            >
              <SelectTrigger id="systemCategory">
                <SelectValue placeholder="Select system" />
              </SelectTrigger>
              <SelectContent>
                {BODY_SYSTEMS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ── Donor Details ── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Donor Details (optional)
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={form.sex} onValueChange={set('sex')}>
              <SelectTrigger id="sex">
                <SelectValue placeholder="Unknown" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={form.age}
              onChange={(e) => set('age')(e.target.value)}
              placeholder="e.g. 45 years"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="donorInfo">Cause / Notes</Label>
            <Input
              id="donorInfo"
              value={form.donorInfo}
              onChange={(e) => set('donorInfo')(e.target.value)}
              placeholder="Anonymized"
            />
          </div>
        </div>
      </section>

      {/* ── Preservation ── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Preservation
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="preservationMethod">Method *</Label>
            <Select
              value={form.preservationMethod}
              onValueChange={set('preservationMethod')}
              required
            >
              <SelectTrigger id="preservationMethod">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {PRESERVATION_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="jarSize">Jar Size</Label>
            <Input
              id="jarSize"
              value={form.jarSize}
              onChange={(e) => set('jarSize')(e.target.value)}
              placeholder="e.g. 30x20x15 cm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="collectionDate">Collection Year</Label>
            <Input
              id="collectionDate"
              value={form.collectionDate}
              onChange={(e) => set('collectionDate')(e.target.value)}
              placeholder="e.g. 2023"
            />
          </div>
        </div>
      </section>

      {/* ── Academic Content ── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Academic Content
          {aiStatus === 'loading' && (
            <span className="ml-2 text-primary normal-case font-normal tracking-normal">
              — AI is writing this…
            </span>
          )}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set('description')(e.target.value)}
              required
              rows={3}
              placeholder={
                aiStatus === 'loading'
                  ? 'AI is generating…'
                  : 'Brief anatomical description of the specimen…'
              }
              className={aiStatus === 'loading' ? 'opacity-60 animate-pulse' : ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="functions">Functions *</Label>
            <Textarea
              id="functions"
              value={form.functions}
              onChange={(e) => set('functions')(e.target.value)}
              required
              rows={3}
              placeholder={
                aiStatus === 'loading'
                  ? 'AI is generating…'
                  : 'Key physiological functions of this organ…'
              }
              className={aiStatus === 'loading' ? 'opacity-60 animate-pulse' : ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="clinicalRelevance">Clinical Relevance *</Label>
            <Textarea
              id="clinicalRelevance"
              value={form.clinicalRelevance}
              onChange={(e) => set('clinicalRelevance')(e.target.value)}
              required
              rows={3}
              placeholder={
                aiStatus === 'loading'
                  ? 'AI is generating…'
                  : 'Important diseases, surgical points, exam relevance…'
              }
              className={aiStatus === 'loading' ? 'opacity-60 animate-pulse' : ''}
            />
          </div>

          {/* Image / Diagram */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="imageUrl">
                Labeled Diagram / Image URL
              </Label>
              {diagramAttribution && (
                <span className="text-xs text-muted-foreground">
                  Source: {diagramAttribution}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => set('imageUrl')(e.target.value)}
                placeholder="AI fills this from Wikipedia, or paste your own URL"
                type="url"
                className="flex-1"
              />
              {form.imageUrl && (
                <a
                  href={form.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                  title="Preview image"
                >
                  <Button type="button" variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Preview image</span>
                  </Button>
                </a>
              )}
            </div>
            {form.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border bg-muted h-40 mt-1">
                <img
                  src={form.imageUrl}
                  alt="Diagram preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Click &ldquo;Generate&rdquo; above to auto-fetch a labeled Wikipedia diagram. You can also paste a URL to your own specimen photo.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={form.additionalNotes}
              onChange={(e) => set('additionalNotes')(e.target.value)}
              rows={2}
              placeholder="Any extra notes for students…"
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-end pt-2">
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || aiStatus === 'loading'}>
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Specimen'}
        </Button>
      </div>
    </form>
  )
}
