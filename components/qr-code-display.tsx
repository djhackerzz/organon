'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Specimen } from '@/lib/db/schema'
import { ArrowLeft, Download, Printer } from 'lucide-react'

interface QRCodeDisplayProps {
  specimen: Specimen
  publicUrl: string
}

export function QRCodeDisplay({ specimen, publicUrl }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0d1117',
        light: '#ffffff',
      },
    })
    QRCode.toDataURL(publicUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#0d1117', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [publicUrl])

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `QR_${specimen.specimenNumber}.png`
    a.click()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      {/* Main print-friendly card */}
      <Card className="p-8 flex flex-col items-center gap-6 print:shadow-none print:border-0">
        {/* Museum header */}
        <div className="text-center w-full border-b border-border pb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Department of Anatomy
          </p>
          <p className="text-xs text-muted-foreground">Museum Specimen Label</p>
        </div>

        {/* Specimen info */}
        <div className="text-center">
          <p className="text-xs font-mono text-muted-foreground">
            {specimen.specimenNumber}
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-1">
            {specimen.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {specimen.systemCategory}
          </p>
          {specimen.preservationMethod && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Preserved in: {specimen.preservationMethod}
            </p>
          )}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
            <canvas ref={canvasRef} aria-label="QR code for this specimen" />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-[200px]">
            Scan with any camera or QR reader to view full specimen details
          </p>
        </div>

        {/* URL for reference */}
        <p className="text-xs font-mono text-muted-foreground break-all text-center bg-muted px-3 py-2 rounded-md">
          {publicUrl}
        </p>
      </Card>

      {/* Action buttons — hidden on print */}
      <div className="flex gap-3 print:hidden">
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex-1 gap-2"
          disabled={!qrDataUrl}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download PNG
        </Button>
        <Button onClick={handlePrint} className="flex-1 gap-2">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print Label
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center print:hidden">
        Tip: Use your browser&apos;s Print function (Ctrl+P) for best results.
        Set margins to &quot;None&quot; for a clean label.
      </p>
    </div>
  )
}
