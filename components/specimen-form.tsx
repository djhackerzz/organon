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
import { ImageUploadField } from '@/components/image-upload-field'
import { findOrganContent } from '@/lib/organ-content'
import { Sparkles } from 'lucide-react'

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

export function SpecimenForm({ specimen, onSuccess }: SpecimenFormProps) {
  const router = useRouter()
  const isEdit = !!specimen

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    specimenNumber: specimen?.specimenNumber ?? '',
    name: specimen?.name ?? '',
    organ: specimen?.organ ?? '',
    systemCategory: specimen?.systemCategory ?? '',
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
    specimenPhotoUrl: specimen?.specimenPhotoUrl ?? '',
    additionalNotes: specimen?.additionalNotes ?? '',
  })

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const quickFill = findOrganContent(form.organ)

  const handleQuickFill = () => {
    if (!quickFill) return
    setForm((f) => ({
      ...f,
      name: f.name || quickFill.name,
      systemCategory: f.systemCategory || quickFill.systemCategory,
      preservationMethod: f.preservationMethod || quickFill.preservationMethod,
      description: f.description || quickFill.description,
      functions: f.functions || quickFill.functions,
      clinicalRelevance: f.clinicalRelevance || quickFill.clinicalRelevance,
      imageUrl: f.imageUrl || quickFill.imageUrl || '',
    }))
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
          specimenPhotoUrl: form.specimenPhotoUrl || undefined,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Identification */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
            <Label htmlFor="organ">Organ *</Label>
            <Input
              id="organ"
              value={form.organ}
              onChange={(e) => set('organ')(e.target.value)}
              required
              placeholder="e.g. Heart"
            />
            {quickFill && (
              <button
                type="button"
                onClick={handleQuickFill}
                className="mt-0.5 inline-flex items-center gap-1.5 self-start rounded-sm border border-primary/40 bg-primary/5 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Quick-fill {quickFill.name} content
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="systemCategory">Body System *</Label>
            <Select
              value={form.systemCategory}
              onValueChange={(value) => set('systemCategory')(value ?? '')}
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

      {/* Preservation */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Preservation Details
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="preservationMethod">Method *</Label>
            <Select
              value={form.preservationMethod}
              onValueChange={(value) => set('preservationMethod')(value ?? '')}
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

      {/* Donor Details */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Donor Details <span className="normal-case font-normal tracking-normal">(optional)</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={form.sex} onValueChange={(value) => set('sex')(value ?? '')}>
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
              placeholder="Anonymized info"
            />
          </div>
        </div>
      </section>

      {/* Academic Content */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Academic Content
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Tip: Use ChatGPT — prompt it with &ldquo;Write a 3-sentence MBBS-level description of the [organ] for an anatomy museum specimen card&rdquo; and paste the result here.
        </p>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => set('description')(e.target.value)}
            required
            rows={3}
            placeholder="Brief anatomical description of the specimen as seen in the jar…"
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
            placeholder="Key physiological functions. Each on a new line for bullet points."
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
            placeholder="Important diseases, surgical relevance, exam high-yield points…"
          />
        </div>

        {/* Specimen Photo — taken by you */}
        <ImageUploadField
          id="specimenPhotoUrl"
          label={
            <>
              Specimen Photo{' '}
              <span className="text-muted-foreground font-normal">(your actual jar photo)</span>
            </>
          }
          value={form.specimenPhotoUrl}
          onChange={set('specimenPhotoUrl')}
          hint="Take a photo of the jar with any phone and upload it directly from your device."
        />

        {/* Labeled Diagram — from textbook / Wikimedia */}
        <ImageUploadField
          id="imageUrl"
          label={
            <>
              Labeled Diagram{' '}
              <span className="text-muted-foreground font-normal">(from textbook / Wikimedia)</span>
            </>
          }
          value={form.imageUrl}
          onChange={set('imageUrl')}
          hint="Upload a labeled anatomical diagram saved from your textbook or downloaded from Wikimedia Commons."
        />

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
      </section>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-end pt-1">
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Specimen'}
        </Button>
      </div>
    </form>
  )
}
