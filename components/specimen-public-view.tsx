import { Badge } from '@/components/ui/badge'
import type { Specimen } from '@/lib/db/schema'
import { FlaskConical } from 'lucide-react'

interface SpecimenPublicViewProps {
  specimen: Specimen
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
        {title}
      </h2>
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

export function SpecimenPublicView({ specimen }: SpecimenPublicViewProps) {
  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            Department of Anatomy — Museum Catalog
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Hero */}
        {specimen.imageUrl && (
          <div className="rounded-xl overflow-hidden h-56 bg-muted">
            <img
              src={specimen.imageUrl}
              alt={`Photo of ${specimen.name} specimen`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title block */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{specimen.systemCategory}</Badge>
            <span className="text-xs font-mono text-muted-foreground">
              {specimen.specimenNumber}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            {specimen.name}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {specimen.description}
          </p>
        </div>

        {/* Divider */}
        <hr className="border-border" />

        {/* Functions */}
        <Section title="Physiological Functions">
          <p className="whitespace-pre-wrap">{specimen.functions}</p>
        </Section>

        {/* Clinical Relevance */}
        <div className="bg-accent/40 border border-accent rounded-xl p-5">
          <Section title="Clinical Relevance">
            <p className="whitespace-pre-wrap">{specimen.clinicalRelevance}</p>
          </Section>
        </div>

        {/* Specimen Details */}
        <Section title="Specimen Details">
          <div className="flex flex-col gap-2 text-sm">
            <InfoRow label="Organ" value={specimen.organ} />
            <InfoRow label="Body System" value={specimen.systemCategory} />
            <InfoRow label="Preservation" value={specimen.preservationMethod} />
            <InfoRow label="Jar Size" value={specimen.jarSize} />
            <InfoRow label="Collection" value={specimen.collectionDate} />
          </div>
        </Section>

        {/* Donor info (if available) */}
        {(specimen.sex || specimen.age || specimen.donorInfo) && (
          <Section title="Donor Information">
            <div className="flex flex-col gap-2 text-sm">
              <InfoRow label="Sex" value={specimen.sex} />
              <InfoRow label="Age at death" value={specimen.age} />
              <InfoRow label="Notes" value={specimen.donorInfo} />
            </div>
          </Section>
        )}

        {/* Additional Notes */}
        {specimen.additionalNotes && (
          <Section title="Additional Notes">
            <p className="whitespace-pre-wrap">{specimen.additionalNotes}</p>
          </Section>
        )}

        {/* Footer */}
        <footer className="border-t border-border pt-6 text-xs text-muted-foreground text-center">
          <p>Department of Anatomy — Specimen Catalog</p>
          <p className="mt-1 font-mono">{specimen.specimenNumber}</p>
        </footer>
      </main>
    </div>
  )
}
