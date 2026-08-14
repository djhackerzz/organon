import Link from 'next/link'
import type { Metadata } from 'next'
import {
  BadgeCheck,
  BookOpen,
  Camera,
  Download,
  FlaskConical,
  QrCode,
  Search,
  Share2,
  Star,
  Tablets,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Anatomy Museum App',
  description:
    'A digital catalogue of the preserved anatomical collection at GMERS Medical College, Godhra — built as a modern web application.',
}

const features = [
  {
    icon: Search,
    title: 'Searchable catalogue',
    body: 'Find any specimen in seconds. Filter by body system, organ, or plate number.',
  },
  {
    icon: BookOpen,
    title: 'Detailed study notes',
    body: 'Every specimen carries functions, clinical relevance, and anonymised donor context.',
  },
  {
    icon: Camera,
    title: 'High-res specimen photos',
    body: 'Zoom into preserved anatomy photographed in the dissection hall.',
  },
  {
    icon: QrCode,
    title: 'QR plates for the museum',
    body: 'Print a QR plate for each jar — visitors scan and open the entry on their phone.',
  },
  {
    icon: Tablets,
    title: 'Admin studio',
    body: 'Add, edit, and manage specimens from a clean dashboard. Bulk-ready data entry.',
  },
  {
    icon: Share2,
    title: 'Public link per specimen',
    body: 'Share a single specimen page with students or colleagues by URL.',
  },
]

const screenshots = [
  {
    src: '/demo-images/heart-photo.jpg',
    caption: 'Preserved human heart',
    note: 'Specimen photograph · ANT-CVS-001',
  },
  {
    src: '/demo-images/heart-diagram.jpg',
    caption: 'Labeled diagram view',
    note: 'Chamber anatomy for study',
  },
]

function ScreenshotCard({ src, caption, note }: (typeof screenshots)[number]) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="border-t border-border/80 px-4 py-3">
        <p className="font-display text-sm font-semibold text-foreground">
          {caption}
        </p>
        <p className="mt-0.5 font-sans text-xs text-muted-foreground">
          {note}
        </p>
      </figcaption>
    </figure>
  )
}

function IconBubble({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg border border-border bg-card px-3 py-2">
      <span className="font-display text-lg font-semibold text-foreground">
        {value}
      </span>
      <span className="font-sans text-[0.6rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <main className="min-h-svh bg-background">
      {/* Header banner */}
      <header className="border-b border-border bg-[linear-gradient(135deg,oklch(0.42_0.07_155),oklch(0.26_0.03_155))] text-primary-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-primary-foreground/70">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-primary-foreground/40">
                <span className="font-display text-[0.78rem] font-semibold italic leading-none">
                  A
                </span>
              </span>
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              Museum of Anatomy
            </span>
          </div>
          <Button
            render={<Link href="/catalogue" />}
            variant="secondary"
            size="sm"
            className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
          >
            Open the app
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* App identity — Play Store style */}
        <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-border bg-card shadow-sm">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-foreground/70">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-foreground/40">
                <span className="font-display text-xl font-semibold italic leading-none text-foreground">
                  A
                </span>
              </span>
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                Anatomy Museum
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-sans text-[0.6rem] font-semibold tracking-[0.14em] text-primary uppercase">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Digital Catalogue
              </span>
            </div>
            <p className="mt-1.5 font-sans text-sm text-muted-foreground">
              GMERS Medical College, Godhra · Department of Anatomy
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 font-sans text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <span className="text-amber-600">4.8</span>
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                <span>(Study aid)</span>
              </span>
              <span aria-hidden="true" className="text-border">·</span>
              <span>Free to use</span>
              <span aria-hidden="true" className="text-border">·</span>
              <span>Runs in any browser</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <Button render={<Link href="/catalogue" />}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Browse the collection
              </Button>
              <Button render={<Link href="/sign-in" />} variant="outline">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Study a specimen
              </Button>
              <Button render={<Link href="/admin" />} variant="ghost">
                Admin studio
              </Button>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="mt-12">
          <div className="fleuron">
            <span className="label-caps text-muted-foreground">
              Screenshots
            </span>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {screenshots.map((shot) => (
              <ScreenshotCard key={shot.src} {...shot} />
            ))}
          </div>
        </section>

        {/* What it does */}
        <section className="mt-14">
          <div className="fleuron">
            <span className="label-caps text-muted-foreground">
              About this app
            </span>
          </div>
          <div className="mt-5 rounded-lg border border-border bg-card p-6">
            <p className="dropcap max-w-3xl font-serif text-[1.05rem] leading-relaxed text-foreground/90">
              The Anatomy Museum app turns a physical collection of preserved
              specimens into a living digital catalogue. Every jar in the
              dissection hall is numbered, photographed, and annotated —
              functions, clinical relevance, and anonymised donor context all
              in one place. Students browse by body system, scan a QR plate on
              the jar, or follow a shared link straight to the entry.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <StatChip label="Body systems" value="10+" />
              <StatChip label="Per specimen" value="8 fields" />
              <StatChip label="Access" value="Any device" />
              <StatChip label="Hosting" value="College LAN / web" />
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="mt-14">
          <div className="fleuron">
            <span className="label-caps text-muted-foreground">
              Key features
            </span>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <IconBubble icon={feature.icon} />
                <h3 className="mt-3.5 font-display text-lg font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Try it */}
        <section className="mt-14 overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.06]">
          <div className="flex flex-col items-start justify-between gap-5 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Try the live app
              </h2>
              <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-muted-foreground">
                <FlaskConical className="h-4 w-4 text-primary" aria-hidden="true" />
                A fully seeded human heart specimen is ready to explore.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button render={<Link href="/catalogue" />}>Open catalogue</Button>
              <Button
                render={<Link href="/admin" />}
                variant="outline"
                className="bg-card"
              >
                Admin demo
              </Button>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <p className="font-sans text-xs text-muted-foreground">
            Anatomy Museum · GMERS Medical College, Godhra
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            Admin sign-in: admin@anatomy.edu.in / password123
          </p>
        </div>
      </footer>
    </main>
  )
}
