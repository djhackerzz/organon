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
      <div id="print-label" className="print-label w-72 select-none bg-white text-neutral-900 shadow-sm">
        <div className="border-2 border-neutral-900 p-1.5">
          <div className="flex flex-col border border-neutral-900 px-4 py-3">
            {/* Institution branding */}
            <p className="text-center font-display text-[0.82rem] leading-snug font-semibold tracking-[0.12em] uppercase">
              GMERS Medical College, Godhra
            </p>
            <p className="mt-0.5 text-center font-sans text-[0.58rem] font-semibold tracking-[0.24em] uppercase text-neutral-600">
              Department of Anatomy
            </p>
            <p className="mt-0.5 text-center font-sans text-[0.5rem] tracking-[0.22em] uppercase text-neutral-500">
              Museum of Anatomy
            </p>

            <div className="my-2.5 flex items-center gap-2" aria-hidden="true">
              <span className="h-px flex-1 bg-neutral-900/70" />
              <span className="h-1 w-1 shrink-0 rotate-45 bg-neutral-900" />
              <span className="h-px flex-1 bg-neutral-900/70" />
            </div>

            {/* Plate number */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-sans text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-neutral-600">
                Specimen No.
              </span>
              <span className="font-mono text-[0.95rem] font-semibold tracking-wide">
                {specimenNumber}
              </span>
            </div>

            {/* Inner plate */}
            <div className="mt-2 flex flex-col items-center border border-neutral-900/80 px-3 py-3">
              <h2 className="text-center font-display text-lg leading-tight font-semibold italic">
                {specimenName}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
                {systemCategory && (
                  <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[0.5rem] font-semibold tracking-[0.12em] uppercase text-neutral-800">
                    {systemCategory}
                  </span>
                )}
                {preservationMethod && (
                  <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[0.5rem] font-semibold tracking-[0.12em] uppercase text-neutral-800">
                    {preservationMethod}
                  </span>
                )}
              </div>

              <div className="mt-3 flex justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR code for specimen information"
                    className="h-[168px] w-[168px] border border-neutral-400 bg-white p-1"
                  />
                ) : (
                  <div className="flex h-[168px] w-[168px] items-center justify-center border border-neutral-400 p-4 text-center text-xs text-neutral-500">
                    {qrError || 'Creating QR code…'}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-2.5 text-center font-sans text-[0.5rem] tracking-[0.16em] uppercase text-neutral-500">
              Scan with phone camera to learn more
            </p>

            <div className="mt-2.5 flex items-center gap-2" aria-hidden="true">
              <span className="h-px flex-1 bg-neutral-900/70" />
              <span className="h-1 w-1 shrink-0 rotate-45 bg-neutral-900" />
              <span className="h-px flex-1 bg-neutral-900/70" />
            </div>

            <p className="mt-2 text-center font-serif text-[0.55rem] italic text-neutral-600">
              Anatomy Museum — Catalogue of Preserved Specimens
            </p>
          </div>
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
            border: none !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}
