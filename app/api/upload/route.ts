import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/demo-mode'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, WebP, and GIF images are allowed' },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size must be under 10 MB' }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)
    const filename = `${crypto.randomUUID()}-${safeName}`

    if (isDemoMode()) {
      await mkdir(UPLOADS_DIR, { recursive: true })
      await writeFile(join(UPLOADS_DIR, filename), Buffer.from(await file.arrayBuffer()))
      return NextResponse.json({ url: `/api/image?pathname=${filename}` })
    }

    const blob = await put(`specimen-images/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please check storage configuration.' }, { status: 500 })
  }
}
