'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Printer, RotateCcw, QrCode, Info } from 'lucide-react'
import html2canvas from 'html2canvas'

const BODY_SYSTEMS = [
  'Cardiovascular System',
  'Respiratory System',
  'Digestive System',
  'Nervous System',
  'Musculoskeletal System',
  'Endocrine System',
  'Urinary System',
  'Reproductive System',
  'Lymphatic System',
  'Integumentary System',
]

const ORGAN_CODES: Record<string, string> = {
  Heart: 'HRT',
  Lung: 'LNG',
  Liver: 'LVR',
  Kidney: 'KDN',
  Brain: 'BRN',
  Stomach: 'STM',
  Spleen: 'SPL',
  Pancreas: 'PNC',
  Intestine: 'INT',
  Thyroid: 'THY',
  Uterus: 'UTR',
  Testis: 'TST',
  Ovary: 'OVR',
  Bladder: 'BLD',
  Eye: 'EYE',
  Ear: 'EAR',
}

const PRESERVATION_METHODS = [
  '10% Formalin',
  'Formol Saline',
  'Alcohol (70%)',
  'Glycerine',
  'Kaiserling Solution',
  'Plastination',
]

interface LabelData {
  specimenNumber: string
  organName: string
  bodySystem: string
  preservationMethod: string
  collectedYear: string
  collegeName: string
  url: string
}

const DEFAULT_DATA: LabelData = {
  specimenNumber: '',
  organName: '',
  bodySystem: '',
  preservationMethod: '',
  collectedYear: '',
  collegeName: '',
  url: '',
}

export function LabelMaker() {
  const [data, setData] = useState<LabelData>(DEFAULT_DATA)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const labelRef = useRef<HTMLDivElement>(null)

  // Debounced QR generation
  useEffect(() => {
    if (!data.url.trim()) {
      setQrDataUrl('')
      return
    }
    const timer = setTimeout(() => {
      QRCode.toDataURL(data.url.trim(), {
        width: 300,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(''))
    }, 400)
    return () => clearTimeout(timer)
  }, [data.url])

  const set = useCallback(
    (key: keyof LabelData) => (val: string) =>
      setData((prev) => ({ ...prev, [key]: val })),
    []
  )

  const autoNumber = () => {
    if (!data.organName) return
    const code =
      ORGAN_CODES[data.organName] ??
      data.organName.slice(0, 3).toUpperCase()
    const num = String(Math.floor(Math.random() * 900) + 100)
    set('specimenNumber')(`ANT-${code}-${num}`)
  }

  const handleDownload = async () => {
    if (!labelRef.current) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(labelRef.current, {
        scale: 4,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `Label_${data.specimenNumber || data.organName || 'specimen'}.png`
      a.click()
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = () => window.print()

  const isReady = data.organName && data.specimenNumber && qrDataUrl

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" aria-hidden="true" />
            <h1 className="font-semibold text-foreground">QR Label Maker</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              — Anatomy Museum
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData(DEFAULT_DATA)}
              className="gap-1.5 print:hidden"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!isReady || generating}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {generating ? 'Saving...' : 'Download PNG'}
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              disabled={!isReady}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 print:p-0">
        {/* ── LEFT: Form ── */}
        <aside className="lg:w-80 shrink-0 flex flex-col gap-5 print:hidden">
          {/* Info callout */}
          <div className="flex gap-2.5 bg-accent/40 border border-accent rounded-lg p-3.5 text-sm">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-muted-foreground leading-relaxed">
              Paste your{' '}
              <strong className="text-foreground">Google Sites page URL</strong>{' '}
              below. The QR code will point directly to that page — no
              middleman, free forever.
            </p>
          </div>

          {/* URL field — most important */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url" className="font-medium">
              Google Sites URL{' '}
              <span className="text-destructive" aria-hidden="true">*</span>
            </Label>
            <Input
              id="url"
              placeholder="https://sites.google.com/view/..."
              value={data.url}
              onChange={(e) => set('url')(e.target.value)}
              className="font-mono text-xs"
            />
            {data.url && !qrDataUrl && (
              <p className="text-xs text-destructive">Generating QR...</p>
            )}
            {qrDataUrl && (
              <p className="text-xs text-primary">QR code ready</p>
            )}
          </div>

          <hr className="border-border" />

          {/* Organ name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organName" className="font-medium">
              Organ Name{' '}
              <span className="text-destructive" aria-hidden="true">*</span>
            </Label>
            <Input
              id="organName"
              placeholder="e.g. Human Heart"
              value={data.organName}
              onChange={(e) => set('organName')(e.target.value)}
            />
          </div>

          {/* Specimen number */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="specNum" className="font-medium">
              Specimen Number{' '}
              <span className="text-destructive" aria-hidden="true">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="specNum"
                placeholder="ANT-HRT-001"
                value={data.specimenNumber}
                onChange={(e) => set('specimenNumber')(e.target.value)}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={autoNumber}
                className="shrink-0 px-3"
                title="Auto-generate number"
              >
                Auto
              </Button>
            </div>
          </div>

          {/* Body system */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-medium">Body System</Label>
            <Select value={data.bodySystem} onValueChange={set('bodySystem')}>
              <SelectTrigger>
                <SelectValue placeholder="Select system..." />
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

          {/* Preservation */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-medium">Preservation Method</Label>
            <Select
              value={data.preservationMethod}
              onValueChange={set('preservationMethod')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method..." />
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

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="year" className="font-medium">
              Year Collected
            </Label>
            <Input
              id="year"
              placeholder="2024"
              maxLength={4}
              value={data.collectedYear}
              onChange={(e) => set('collectedYear')(e.target.value)}
            />
          </div>

          {/* College */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="college" className="font-medium">
              College / Institution Name
            </Label>
            <Input
              id="college"
              placeholder="e.g. SVNMC & Hospital"
              value={data.collegeName}
              onChange={(e) => set('collegeName')(e.target.value)}
            />
          </div>

          {!isReady && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Fill URL, Organ Name and Specimen Number to enable print/download.
            </p>
          )}
        </aside>

        {/* ── RIGHT: Live label preview ── */}
        <main className="flex-1 flex flex-col items-center gap-6 print:gap-0">
          {/* Screen-only heading */}
          <p className="text-xs text-muted-foreground uppercase tracking-widest print:hidden self-start">
            Label Preview — actual print size is 9 × 12 cm
          </p>

          {/* THE LABEL — this is what gets printed */}
          <div
            ref={labelRef}
            id="print-label"
            style={{
              width: '340px',
              minHeight: '440px',
              fontFamily: "'Inter', 'Arial', sans-serif",
              backgroundColor: '#ffffff',
              color: '#0a0a0a',
              border: '2.5px solid #0a0a0a',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Label top bar */}
            <div
              style={{
                backgroundColor: '#1a3a4a',
                color: '#ffffff',
                padding: '10px 14px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
              }}
            >
              <p
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                  margin: 0,
                }}
              >
                Department of Anatomy
              </p>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  margin: 0,
                  opacity: 0.95,
                }}
              >
                {data.collegeName || 'College / Institution Name'}
              </p>
            </div>

            {/* Body */}
            <div
              style={{
                padding: '14px 14px 12px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Specimen number + name */}
              <div>
                <p
                  style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: '#666',
                    margin: '0 0 3px 0',
                    letterSpacing: '0.05em',
                  }}
                >
                  {data.specimenNumber || 'ANT-XXX-000'}
                </p>
                <p
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#0a0a0a',
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {data.organName || 'Organ Name'}
                </p>
                {data.bodySystem && (
                  <p
                    style={{
                      fontSize: '10px',
                      color: '#1a3a4a',
                      fontWeight: 500,
                      margin: '3px 0 0 0',
                    }}
                  >
                    {data.bodySystem}
                  </p>
                )}
              </div>

              {/* Details row */}
              {(data.preservationMethod || data.collectedYear) && (
                <div
                  style={{
                    backgroundColor: '#f0f4f6',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                  }}
                >
                  {data.preservationMethod && (
                    <div style={{ display: 'flex', gap: '6px', fontSize: '9px' }}>
                      <span style={{ color: '#555', width: '68px', flexShrink: 0 }}>
                        Preservation
                      </span>
                      <span style={{ color: '#0a0a0a', fontWeight: 500 }}>
                        {data.preservationMethod}
                      </span>
                    </div>
                  )}
                  {data.collectedYear && (
                    <div style={{ display: 'flex', gap: '6px', fontSize: '9px' }}>
                      <span style={{ color: '#555', width: '68px', flexShrink: 0 }}>
                        Collected
                      </span>
                      <span style={{ color: '#0a0a0a', fontWeight: 500 }}>
                        {data.collectedYear}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* QR code + instruction */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: 'auto',
                  paddingTop: '4px',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    border: '1.5px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  }}
                >
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="QR code"
                      width={140}
                      height={140}
                      style={{ display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 140,
                        height: 140,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#999',
                        textAlign: 'center',
                        padding: '8px',
                      }}
                    >
                      Enter URL to generate QR code
                    </div>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '8.5px',
                    color: '#555',
                    textAlign: 'center',
                    margin: 0,
                    letterSpacing: '0.02em',
                  }}
                >
                  Scan with phone camera for full information
                </p>
              </div>
            </div>

            {/* Bottom border strip */}
            <div
              style={{
                backgroundColor: '#1a3a4a',
                height: '5px',
              }}
            />
          </div>

          {/* Print tips — hidden on print */}
          <div className="print:hidden bg-muted/60 border border-border rounded-lg p-4 text-xs text-muted-foreground max-w-sm w-full">
            <p className="font-medium text-foreground mb-2">Printing tips</p>
            <ul className="flex flex-col gap-1.5 list-disc list-inside">
              <li>Use <strong>Chrome</strong> or <strong>Edge</strong> for best results</li>
              <li>Set paper size to <strong>A4</strong>, orientation <strong>Portrait</strong></li>
              <li>Set margins to <strong>None / Minimum</strong></li>
              <li>Enable <strong>&quot;Background graphics&quot;</strong> in print settings</li>
              <li>Print at <strong>100% scale</strong> — do not &quot;fit to page&quot;</li>
              <li>After printing, <strong>laminate</strong> the label before placing on jar</li>
            </ul>
          </div>
        </main>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-label, #print-label * { visibility: visible; }
          #print-label {
            position: fixed;
            top: 20mm;
            left: 50%;
            transform: translateX(-50%);
            width: 90mm !important;
            border-radius: 4mm !important;
          }
        }
      `}</style>
    </div>
  )
}
