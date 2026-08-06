import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

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

    // The connected Blob store is private, so upload with matching private access.
    // The delivery route below exposes only the intended specimen image path.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)
    const blob = await put(`specimen-images/${crypto.randomUUID()}-${safeName}`, file, {
      access: 'private',
      addRandomSuffix: false,
    })

    return NextResponse.json({
      url: `${request.nextUrl.origin}/api/image?pathname=${encodeURIComponent(blob.pathname)}`,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please check Blob storage configuration.' }, { status: 500 })
  }
}
