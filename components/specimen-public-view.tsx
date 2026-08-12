'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SiteSettings, Specimen } from '@/lib/db/schema'
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
  settings: SiteSettings
}

function MuseumMark() {
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/70"
      aria-hidden="true"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full border border-foreground/40">
        <span className="font-display text-[0.85rem] font-semibold italic leading-none text-foreground">
          A
        </span>
      </span>
    </span>
  )
}

function Diamond() {
  return (
    <span
      className="inline-block h-1.5 w-1.5 shrink-0 rotate-45"
      aria-hidden="true"
    />
  )
}

function BulletContent({ text }: { text: string }) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <ul className="flex flex-col gap-2.5" role="list">
      {lines.map((line, i) => {
        const clean = line.replace(/^[•\-\*]\s*/, '')
        return (
          <li
            key={i}
            className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-foreground/90"
          >
            <span className="mt-[0.52em] text-primary">
              <Diamond />
            </span>
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
      className={`rounded-sm border p-5 sm:p-6 ${
        accent
          ? 'border-primary/40 bg-primary/[0.035]'
          : 'border-border bg-card'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          className={`h-3.5 w-3.5 shrink-0 ${accent ? 'text-primary' : 'text-muted-foreground'}`}
          aria-hidden="true"
        />
        <h2
          className={`label-caps ${accent ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {title}
        </h2>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-4 py-2.5 text-sm">
      <dt className="font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
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
      <div className="flex flex-col gap-4 sm:flex-row">
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => openImage(image)}
            className="group flex flex-1 flex-col overflow-hidden rounded-sm border border-border bg-card text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Open larger view: ${image.caption}`}
          >
            <span className="relative flex min-h-48 w-full items-center justify-center overflow-hidden bg-muted/50">
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
            <span className="border-t border-border/80 px-3 py-2.5 text-center text-xs italic text-muted-foreground">
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
          className="flex max-h-[calc(100svh-1rem)] max-w-5xl flex-col gap-3 overflow-hidden bg-background/95 p-3 sm:p-4"
        >
          <div className="flex items-center justify-between gap-3 pr-10">
            <div className="min-w-0">
              <DialogTitle className="truncate font-display text-base font-semibold">
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
            className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-sm bg-muted p-2 touch-none select-none sm:min-h-[50vh]"
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
                className="max-h-full max-w-full origin-center object-contain will-change-transform"
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
              className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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

export function SpecimenPublicView({ specimen, settings }: SpecimenPublicViewProps) {
  return (
    <div className="min-h-svh bg-background">
      {/* Masthead */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <MuseumMark />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-[0.98rem] font-semibold tracking-tight text-foreground">
              Museum of Anatomy
            </span>
            <span className="mt-1 truncate font-sans text-[0.56rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Dept. of Anatomy · GMERS Medical College, Godhra
            </span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Link
              href="/catalogue"
              className="font-sans text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Catalogue
            </Link>
            <div className="flex shrink-0 flex-col items-end gap-1 border-l border-border pl-3">
              <span className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Plate
              </span>
              <span className="font-mono text-xs text-foreground">
                {specimen.specimenNumber}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-7 px-4 pt-7 pb-6 sm:gap-8 sm:pt-9">
        {/* Plate title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="label-caps text-primary">
              {specimen.systemCategory}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-[2.75rem]">
            {specimen.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-xs text-muted-foreground">
            {specimen.organ && (
              <>
                <span>{specimen.organ}</span>
                <span className="text-border" aria-hidden="true">
                  ·
                </span>
              </>
            )}
            <span className="font-mono">{specimen.specimenNumber}</span>
            {specimen.preservationMethod && (
              <>
                <span className="text-border" aria-hidden="true">
                  ·
                </span>
                <span>{specimen.preservationMethod}</span>
              </>
            )}
          </div>

          <p className="text-[0.95rem] leading-relaxed text-foreground/90">
            {specimen.description}
          </p>
        </div>

        {/* Images */}
        {settings.showImages && (specimen.specimenPhotoUrl || specimen.imageUrl) && (
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

        {settings.showFunctions && (
          <SectionCard icon={BookOpen} title={settings.functionsHeading}>
            <BulletContent text={specimen.functions} />
          </SectionCard>
        )}

        {settings.showClinicalRelevance && (
          <SectionCard
            icon={Stethoscope}
            title={settings.clinicalRelevanceHeading}
            accent
          >
            <BulletContent text={specimen.clinicalRelevance} />
          </SectionCard>
        )}

        {settings.showSpecimenDetails && (
          <SectionCard icon={Info} title={settings.specimenDetailsHeading}>
            <dl className="divide-y divide-border/80">
              <InfoRow label="Organ" value={specimen.organ} />
              <InfoRow label="Body system" value={specimen.systemCategory} />
              <InfoRow label="Specimen no." value={specimen.specimenNumber} />
              <InfoRow label="Preservation" value={specimen.preservationMethod} />
              <InfoRow label="Jar size" value={specimen.jarSize} />
              <InfoRow label="Collected" value={specimen.collectionDate} />
            </dl>
          </SectionCard>
        )}

        {settings.showDonorInformation && (specimen.sex || specimen.age || specimen.donorInfo) && (
          <SectionCard icon={Info} title={settings.donorInformationHeading}>
            <dl className="divide-y divide-border/80">
              <InfoRow label="Sex" value={specimen.sex} />
              <InfoRow label="Age at death" value={specimen.age} />
              <InfoRow label="Notes" value={specimen.donorInfo} />
            </dl>
          </SectionCard>
        )}

        {settings.showAdditionalNotes && specimen.additionalNotes && (
          <SectionCard icon={BookOpen} title={settings.additionalNotesHeading}>
            <p className="dropcap text-[0.95rem] leading-relaxed whitespace-pre-wrap text-foreground/90">
              {specimen.additionalNotes}
            </p>
          </SectionCard>
        )}

        {settings.showFooter && (
          <footer className="flex flex-col items-center gap-2.5 border-t border-border pt-6 pb-2 text-center">
            <div className="fleuron">
              <span className="text-primary">
                <Diamond />
              </span>
            </div>
            <p className="label-caps text-muted-foreground">
              Department of Anatomy, GMERS Medical College, Godhra — Museum
              Specimen Catalogue
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {specimen.specimenNumber}
            </p>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground/80">
              Photographs of the preserved collection are the property of the
              department. Diagrams sourced from Wikimedia Commons (CC licensed)
              where applicable.
            </p>
          </footer>
        )}
      </main>
    </div>
  )
}
