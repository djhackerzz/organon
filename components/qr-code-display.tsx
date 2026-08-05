'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'

interface QRCodeDisplayProps {
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 200,
      margin: 1,
      color: { dark: '#0f2027', light: '#ffffff' },
    })
    QRCode.toDataURL(url, {
      width: 400,
      margin: 1,
      color: { dark: '#0f2027', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [url])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `${specimenNumber}-qr.png`
    a.click()
  }

  const handlePrint = () => window.print()

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Printable label */}
      <div
        id="print-label"
        className="w-72 rounded-xl overflow-hidden border border-border shadow-sm bg-white text-[#0f2027]"
      >
        {/* Header */}
        <div className="bg-[#0f4c5c] px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-white text-[10px] font-medium tracking-widest uppercase opacity-80">
              Department of Anatomy
            </p>
            <p className="text-white text-xs font-semibold mt-0.5">
              Anatomy Museum
            </p>
          </div>
          <span className="font-mono text-white/70 text-[10px]">
            {specimenNumber}
          </span>
        </div>

        {/* Organ name */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-lg font-bold leading-tight text-[#0f2027]">
            {specimenName}
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] bg-[#e8f4f8] text-[#0f4c5c] px-2 py-0.5 rounded-full font-medium">
              {systemCategory}
            </span>
            <span className="text-[10px] bg-[#e8f4f8] text-[#0f4c5c] px-2 py-0.5 rounded-full font-medium">
              {preservationMethod}
            </span>
          </div>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center px-4 pb-4 pt-2 gap-2">
          <canvas ref={canvasRef} className="rounded-md" />
          <p className="text-[10px] text-[#0f4c5c]/70 text-center">
            Scan with phone camera to learn more
          </p>
        </div>
      </div>

      {/* URL shown below label */}
      <p className="text-xs text-muted-foreground text-center max-w-xs break-all">
        {url}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download PNG
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
          <Printer className="h-3.5 w-3.5" />
          Print Label
        </Button>
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-label { display: block !important; margin: auto; }
        }
      `}</style>
    </div>
  )
}
