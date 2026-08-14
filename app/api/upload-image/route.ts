import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isDemoMode } from '@/lib/demo-mode'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please choose an image file.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Use a JPG, PNG, or WebP image.' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image must be smaller than 10 MB.' }, { status: 400 })
    }

    const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
    const filename = `${crypto.randomUUID()}.${extension}`

    if (isDemoMode()) {
      await mkdir(UPLOADS_DIR, { recursive: true })
      await writeFile(join(UPLOADS_DIR, filename), Buffer.from(await file.arrayBuffer()))
      return NextResponse.json({ url: `/api/image?pathname=${filename}` })
    }

    const blob = await put(
      `specimens/${session.user.id}/${filename}`,
      file,
      { access: 'public', addRandomSuffix: false },
    )

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[upload-image] Upload failed:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
