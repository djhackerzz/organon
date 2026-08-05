import { Metadata } from 'next'
import { LabelMaker } from '@/components/label-maker'

export const metadata: Metadata = {
  title: 'QR Label Maker — Anatomy Museum',
  description:
    'Generate printable QR code jar labels for anatomy museum specimens. Works with any URL including Google Sites.',
}

export default function LabelMakerPage() {
  return <LabelMaker />
}
