'use client'

import { useRef, useState } from 'react'
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
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null)
  const panStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null)

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const openImage = (image: GalleryImage) => {
    setSelectedImage(image)
    resetView()
  }

  const closeImage = () => {
    setSelectedImage(null)
    resetView()
  }

  const updateZoom = (nextZoom: number) => {
    const clampedZoom = Math.min(4, Math.max(1, nextZoom))
    setZoom(clampedZoom)
    if (clampedZoom === 1) setOffset({ x: 0, y: 0 })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()]
      pinchStart.current = {
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        zoom,
      }
      panStart.current = null
    } else if (zoom > 1) {
      panStart.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y }
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const [first, second] = [...pointers.current.values()]
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      updateZoom(pinchStart.current.zoom * (distance / pinchStart.current.distance))
    } else if (pointers.current.size === 1 && panStart.current && zoom > 1) {
      setOffset({
        x: panStart.current.offsetX + event.clientX - panStart.current.x,
        y: panStart.current.offsetY + event.clientY - panStart.current.y,
      })
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
    if (pointers.current.size === 0) panStart.current = null
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    updateZoom(zoom - event.deltaY * 0.002)
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
                Pinch with two fingers or use the mouse wheel to zoom. Drag to pan when zoomed in.
              </DialogDescription>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              Pinch or scroll to zoom
            </span>
          </div>

          <div
            className="flex max-h-[70vh] min-h-64 items-center justify-center overflow-hidden rounded-lg bg-muted p-2 touch-none select-none sm:min-h-[50vh]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {selectedImage && (
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                draggable={false}
                className="max-h-[65vh] max-w-full origin-center object-contain will-change-transform"
                style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                crossOrigin="anonymous"
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Pinch with two fingers to zoom</span>
            <button
              type="button"
              onClick={resetView}
              disabled={zoom === 1 && offset.x === 0 && offset.y === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw data-icon="inline-start" aria-hidden="true" />
              Reset
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
