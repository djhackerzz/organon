import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz'],
  style: ['normal', 'italic'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Anatomy Museum — A Catalogue of Preserved Specimens',
    template: '%s · Anatomy Museum',
  },
  description:
    'A digital catalogue of the preserved anatomical collection — scanned, labelled, and annotated for study. Each specimen carries its own plate and number.',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f0e3' },
    { media: '(prefers-color-scheme: dark)', color: '#201d17' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${inter.variable} ${fraunces.variable} ${lora.variable} antialiased`}
      >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
