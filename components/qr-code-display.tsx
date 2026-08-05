'use client'

import { useEffect, useRef, useState } from 'react'
// canvasRef kept for potential future use but not rendered
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

  const handlePrint = () => {
    if (!qrDataUrl) return
    const win = window.open('', '_blank', 'width=400,height=600')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${specimenNumber} — ${specimenName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: sans-serif; background: #fff; display: flex; justify-content: center; align-items: flex-start; padding: 20px; }
            .label { width: 288px; border: 1px solid #ccc; border-radius: 12px; overflow: hidden; background: #fff; color: #0f2027; }
            .header { background: #0f4c5c; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
            .header-left p:first-child { color: rgba(255,255,255,0.7); font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; }
            .header-left p:last-child { color: #fff; font-size: 11px; font-weight: 600; margin-top: 2px; }
            .header-right { color: rgba(255,255,255,0.6); font-size: 9px; font-family: monospace; }
            .body { padding: 14px 16px 8px; }
            .name { font-size: 17px; font-weight: 700; color: #0f2027; line-height: 1.2; }
            .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
            .chip { font-size: 9px; background: #e8f4f8; color: #0f4c5c; padding: 2px 8px; border-radius: 999px; font-weight: 500; }
            .qr { display: flex; flex-direction: column; align-items: center; padding: 10px 16px 16px; gap: 8px; }
            .qr img { width: 180px; height: 180px; border-radius: 6px; }
            .qr p { font-size: 9px; color: rgba(15,76,92,0.6); text-align: center; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">
              <div class="header-left">
                <p>Department of Anatomy</p>
                <p>Anatomy Museum</p>
              </div>
              <div class="header-right">${specimenNumber}</div>
            </div>
            <div class="body">
              <div class="name">${specimenName}</div>
              <div class="chips">
                <span class="chip">${systemCategory}</span>
                <span class="chip">${preservationMethod}</span>
              </div>
            </div>
            <div class="qr">
              <img src="${qrDataUrl}" alt="QR Code" />
              <p>Scan with phone camera to learn more</p>
            </div>
          </div>
          <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Printable label preview */}
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
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="w-[200px] h-[200px] rounded-md" />
          )}
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
        <Button variant="outline" size="sm" onClick={handlePrint} disabled={!qrDataUrl} className="gap-1.5">
          <Printer className="h-3.5 w-3.5" />
          Print Label
        </Button>
      </div>
    </div>
  )
}
