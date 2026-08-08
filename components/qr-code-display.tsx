'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

type QRCodeDisplayProps = {
  url: string
  specimenNumber: string
  specimenName: string
  systemCategory: string
  preservationMethod: string
}

export function QRCodeDisplay({
  url,
  specimenNumber,
  specimenName,
  systemCategory,
  preservationMethod,
}: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrError, setQrError] = useState('')

  useEffect(() => {
    let cancelled = false
    setQrDataUrl('')
    setQrError('')

    QRCode.toDataURL(url, {
      width: 800,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#201d17', light: '#ffffff' },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setQrError('The QR code could not be generated. Please refresh and try again.')
      })

    return () => {
      cancelled = true
    }
  }, [url])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `${specimenNumber || 'specimen'}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handlePrint = () => {
    if (qrDataUrl) window.print()
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div id="print-label" className="print-label w-72 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between bg-[#2c5d3d] px-4 py-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/80">Department of Anatomy</p>
            <p className="mt-0.5 font-display text-xs font-semibold text-white">Museum of Anatomy</p>
          </div>
          <span className="font-mono text-[10px] text-white/70">{specimenNumber}</span>
        </div>

        <div className="px-4 pb-2 pt-4">
          <h2 className="font-display text-lg font-semibold leading-tight">{specimenName}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#e9f0e7] px-2 py-0.5 text-[10px] font-medium text-[#2c5d3d]">{systemCategory}</span>
            <span className="rounded-full bg-[#e9f0e7] px-2 py-0.5 text-[10px] font-medium text-[#2c5d3d]">{preservationMethod}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-2">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR code for specimen information" className="h-[200px] w-[200px] rounded-md" />
          ) : (
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-md bg-muted p-4 text-center text-xs text-muted-foreground">
              {qrError || 'Creating QR code…'}
            </div>
          )}
          <p className="text-center text-[10px] text-[#2c5d3d]/70">Scan with phone camera to learn more</p>
        </div>
      </div>

      <p className="max-w-xs break-all text-center text-xs text-muted-foreground">{url}</p>
      {qrError && <p className="max-w-sm text-center text-sm text-destructive">{qrError}</p>}

      <div className="flex gap-3 print:hidden">
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!qrDataUrl} className="gap-1.5">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Download PNG
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} disabled={!qrDataUrl} className="gap-1.5">
          <Printer className="h-3.5 w-3.5" aria-hidden="true" />
          Print Label
        </Button>
      </div>

      <style>{`
        @media print {
          @page { size: auto; margin: 12mm; }
          body * { visibility: hidden !important; }
          #print-label, #print-label * { visibility: visible !important; }
          #print-label {
            position: absolute !important;
            left: 50% !important;
            top: 0 !important;
            transform: translateX(-50%) !important;
            width: 72mm !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
