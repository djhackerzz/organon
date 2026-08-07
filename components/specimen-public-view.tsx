'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Specimen } from '@/lib/db/schema'
import {
  FlaskConical,
  BookOpen,
  Stethoscope,
  Info,
  Minus,
  Plus,
  RotateCcw,
  ZoomIn,
} from 'lucide-react'

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

type GalleryImage = {
  src: string
  alt: string
  caption: string
  fit: 'cover' | 'contain'
}

function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [zoom, setZoom] = useState(1)

  const openImage = (image: GalleryImage) => {
    setSelectedImage(image)
    setZoom(1)
  }

  const closeImage = () => {
    setSelectedImage(null)
    setZoom(1)
  }

  const adjustZoom = (amount: number) => {
    setZoom((currentZoom) =>
      Math.min(3, Math.max(1, Number((currentZoom + amount).toFixed(1))))
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => openImage(image)}
            className="group flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-muted text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Open larger view: ${image.caption}`}
          >
            <span className="relative flex min-h-48 w-full items-center justify-center overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full max-h-64 transition-transform duration-200 group-hover:scale-[1.02] ${image.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                crossOrigin="anonymous"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/0 text-foreground opacity-0 transition-opacity group-hover:bg-background/20 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-2 text-xs font-medium shadow-sm">
                  <ZoomIn data-icon="inline-start" aria-hidden="true" />
                  Zoom image
                </span>
              </span>
            </span>
            <span className="border-t border-border px-3 py-2 text-center text-xs text-muted-foreground">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={selectedImage !== null}
        onOpenChange={(open) => {
          if (!open) closeImage()
        }}
      >
        <DialogContent
          showCloseButton
          className="max-w-5xl gap-3 overflow-hidden bg-background/95 p-3 sm:p-4"
        >
          <div className="flex items-center justify-between gap-3 pr-10">
            <div className="min-w-0">
              <DialogTitle className="truncate text-sm">
                {selectedImage?.caption}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Use the controls to zoom this specimen image.
              </DialogDescription>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex max-h-[70vh] min-h-64 items-center justify-center overflow-auto rounded-lg bg-muted p-2 sm:min-h-[50vh]">
            {selectedImage && (
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[65vh] max-w-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                crossOrigin="anonymous"
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => adjustZoom(-0.25)}
              disabled={zoom <= 1}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              aria-label="Zoom out"
            >
              <Minus aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              disabled={zoom === 1}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw data-icon="inline-start" aria-hidden="true" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => adjustZoom(0.25)}
              disabled={zoom >= 3}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              aria-label="Zoom in"
            >
              <Plus aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
          <ImageGallery
            images={[
              ...(specimen.specimenPhotoUrl
                ? [
                    {
                      src: specimen.specimenPhotoUrl,
                      alt: `Preserved specimen of ${specimen.name} in jar`,
                      caption: `Museum specimen — ${specimen.name}`,
                      fit: 'cover' as const,
                    },
                  ]
                : []),
              ...(specimen.imageUrl
                ? [
                    {
                      src: specimen.imageUrl,
                      alt: `Labeled anatomical diagram of ${specimen.name}`,
                      caption: `Labeled diagram — ${specimen.name}`,
                      fit: 'contain' as const,
                    },
                  ]
                : []),
            ]}
          />
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
