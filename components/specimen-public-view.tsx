import { Badge } from '@/components/ui/badge'
import type { Specimen } from '@/lib/db/schema'
import { FlaskConical, BookOpen, Stethoscope, Info } from 'lucide-react'

interface SpecimenPublicViewProps {
  specimen: Specimen
}

function BulletContent({ text }: { text: string }) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <ul className="flex flex-col gap-2" role="list">
      {lines.map((line, i) => {
        const clean = line.replace(/^[•\-\*]\s*/, '')
        return (
          <li key={i} className="flex gap-2.5 items-start text-sm leading-relaxed">
            <span
              className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
              aria-hidden="true"
            />
            <span>{clean}</span>
          </li>
        )
      })}
    </ul>
  )
}

function SectionCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ElementType
  title: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      className={`rounded-xl border p-5 flex flex-col gap-3 ${
        accent
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 shrink-0 ${accent ? 'text-primary' : 'text-muted-foreground'}`}
          aria-hidden="true"
        />
        <h2
          className={`text-xs font-semibold uppercase tracking-widest ${
            accent ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

export function SpecimenPublicView({ specimen }: SpecimenPublicViewProps) {
  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground truncate">
            Anatomy Museum — Specimen Catalog
          </span>
          <span className="ml-auto font-mono text-xs text-muted-foreground shrink-0">
            {specimen.specimenNumber}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── Title block ── */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {specimen.systemCategory}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance leading-tight">
            {specimen.name}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {specimen.description}
          </p>
        </div>

        {/* ── Images ── */}
        {(specimen.specimenPhotoUrl || specimen.imageUrl) && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {specimen.specimenPhotoUrl && (
              <div className="flex-1 rounded-xl overflow-hidden border border-border bg-muted flex flex-col">
                <img
                  src={specimen.specimenPhotoUrl}
                  alt={`Preserved specimen of ${specimen.name} in jar`}
                  className="w-full object-cover max-h-64"
                  crossOrigin="anonymous"
                />
                <p className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border">
                  Museum specimen — {specimen.name}
                </p>
              </div>
            )}
            {specimen.imageUrl && (
              <div className="flex-1 rounded-xl overflow-hidden border border-border bg-muted flex flex-col">
                <img
                  src={specimen.imageUrl}
                  alt={`Labeled anatomical diagram of ${specimen.name}`}
                  className="w-full object-contain max-h-64"
                  crossOrigin="anonymous"
                />
                <p className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border">
                  Labeled diagram — {specimen.name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Functions ── */}
        <SectionCard icon={BookOpen} title="Physiological Functions">
          <BulletContent text={specimen.functions} />
        </SectionCard>

        {/* ── Clinical Relevance ── */}
        <SectionCard icon={Stethoscope} title="Clinical Relevance" accent>
          <BulletContent text={specimen.clinicalRelevance} />
        </SectionCard>

        {/* ── Specimen Details ── */}
        <SectionCard icon={Info} title="Specimen Details">
          <div className="flex flex-col gap-2">
            <InfoRow label="Organ" value={specimen.organ} />
            <InfoRow label="Body System" value={specimen.systemCategory} />
            <InfoRow label="Specimen No." value={specimen.specimenNumber} />
            <InfoRow label="Preservation" value={specimen.preservationMethod} />
            <InfoRow label="Jar Size" value={specimen.jarSize} />
            <InfoRow label="Collected" value={specimen.collectionDate} />
          </div>
        </SectionCard>

        {/* ── Donor info (if available) ── */}
        {(specimen.sex || specimen.age || specimen.donorInfo) && (
          <SectionCard icon={Info} title="Donor Information (Anonymized)">
            <div className="flex flex-col gap-2">
              <InfoRow label="Sex" value={specimen.sex} />
              <InfoRow label="Age at death" value={specimen.age} />
              <InfoRow label="Notes" value={specimen.donorInfo} />
            </div>
          </SectionCard>
        )}

        {/* ── Additional Notes ── */}
        {specimen.additionalNotes && (
          <SectionCard icon={BookOpen} title="Additional Notes">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {specimen.additionalNotes}
            </p>
          </SectionCard>
        )}

        {/* ── Footer ── */}
        <footer className="border-t border-border pt-5 text-xs text-muted-foreground text-center flex flex-col gap-1 pb-8">
          <p>Department of Anatomy — Museum Specimen Catalog</p>
          <p className="font-mono">{specimen.specimenNumber}</p>
          <p className="mt-1">
            Diagram sourced from Wikimedia Commons (CC licensed) where applicable.
          </p>
        </footer>
      </main>
    </div>
  )
}
