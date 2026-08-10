'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Specimen } from '@/lib/db/schema'

interface SpecimenCatalogueViewProps {
  specimens: Specimen[]
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

function CatalogueEntry({ specimen }: { specimen: Specimen }) {
  const image = specimen.specimenPhotoUrl ?? specimen.imageUrl

  return (
    <Link
      href={`/specimen/${specimen.id}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="relative flex min-h-36 w-full items-center justify-center overflow-hidden bg-muted/50">
        {image ? (
          <img
            src={image}
            alt={specimen.name}
            className="h-full max-h-52 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="grid h-full min-h-36 w-full place-items-center">
            <span className="font-mono text-sm text-muted-foreground/70">
              {specimen.specimenNumber}
            </span>
          </span>
        )}
      </span>

      <span className="flex flex-col gap-1.5 border-t border-border/80 p-4">
        <span className="font-sans text-[0.6rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {specimen.systemCategory}
        </span>
        <span className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
          {specimen.name}
        </span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-xs text-muted-foreground">
          {specimen.organ && (
            <>
              <span>{specimen.organ}</span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
            </>
          )}
          <span className="font-mono">{specimen.specimenNumber}</span>
          {specimen.preservationMethod && (
            <>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span>{specimen.preservationMethod}</span>
            </>
          )}
        </span>
        {specimen.description && (
          <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {specimen.description}
          </span>
        )}
      </span>
    </Link>
  )
}

export function SpecimenCatalogueView({ specimens }: SpecimenCatalogueViewProps) {
  const [query, setQuery] = useState('')

  const normalized = query.trim().toLowerCase()
  const isSearching = normalized.length > 0

  const filtered = useMemo(() => {
    if (!isSearching) return specimens
    return specimens.filter((s) =>
      [s.name, s.organ, s.specimenNumber, s.systemCategory, s.description]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized))
    )
  }, [isSearching, normalized, specimens])

  const grouped = useMemo(() => {
    const map = new Map<string, Specimen[]>()
    for (const specimen of filtered) {
      const list = map.get(specimen.systemCategory) ?? []
      list.push(specimen)
      map.set(specimen.systemCategory, list)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  const totalCount = specimens.length

  return (
    <div className="min-h-svh bg-background">
      {/* Masthead */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <MuseumMark />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-[0.98rem] font-semibold tracking-tight text-foreground">
              Museum of Anatomy
            </span>
            <span className="mt-1 truncate font-sans text-[0.56rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Dept. of Anatomy · GMERS Medical College, Godhra
            </span>
          </div>
          <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
            <span className="font-sans text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Catalogue
            </span>
            <span className="font-mono text-xs text-foreground">
              {totalCount} specimens
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-7 px-4 pt-8 pb-8 sm:gap-8 sm:pt-10">
        {/* Catalogue title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="label-caps text-primary">Full collection</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-[2.75rem]">
            The Catalogue
          </h1>

          <p className="max-w-2xl text-[0.95rem] leading-relaxed text-foreground/90">
            Every preserved specimen in the museum, numbered and indexed. Scan
            any plate in the gallery or search the collection below to open its
            full record.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            data-icon="inline-start"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, organ, system, or plate number…"
            className="h-10 rounded-sm pl-9 pr-9"
            aria-label="Search the catalogue"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border py-16 text-center">
            <p className="font-display text-lg italic text-muted-foreground">
              No specimens match “{query.trim()}”.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different name, organ, or plate number.
            </p>
          </div>
        ) : isSearching ? (
          <section aria-label="Search results">
            <div className="flex items-center gap-3">
              <h2 className="label-caps text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </h2>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((specimen) => (
                <CatalogueEntry key={specimen.id} specimen={specimen} />
              ))}
            </div>
          </section>
        ) : (
          grouped.map(([systemCategory, list]) => (
            <section key={systemCategory} aria-label={systemCategory}>
              <div className="flex items-baseline gap-3">
                <h2 className="label-caps text-primary">{systemCategory}</h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {list.length}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((specimen) => (
                  <CatalogueEntry key={specimen.id} specimen={specimen} />
                ))}
              </div>
            </section>
          ))
        )}

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
        </footer>
      </main>
    </div>
  )
}
