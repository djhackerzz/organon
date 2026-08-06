import { get } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')

  if (!pathname || !pathname.startsWith('specimen-images/')) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    })

    if (!result) return new NextResponse('Not found', { status: 404 })

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        ETag: result.blob.etag,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[v0] Image delivery error:', error)
    return new NextResponse('Image unavailable', { status: 404 })
  }
}
