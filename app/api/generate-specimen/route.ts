import { generateObject, gateway } from 'ai'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const SpecimenContentSchema = z.object({
  name: z.string().describe('Full display name e.g. "Human Heart"'),
  organ: z.string().describe('Simple organ name e.g. "Heart"'),
  systemCategory: z.enum([
    'Cardiovascular System',
    'Respiratory System',
    'Digestive System',
    'Nervous System',
    'Musculoskeletal System',
    'Urinary System',
    'Reproductive System',
    'Endocrine System',
    'Lymphatic & Immune System',
    'Integumentary System',
    'Special Senses',
  ]),
  description: z
    .string()
    .describe(
      '3-5 sentence anatomical description of the preserved specimen. Describe what is visible — shape, chambers, surfaces, attachments, notable structures. Written for MBBS first year students.'
    ),
  functions: z
    .string()
    .describe(
      '4-6 key physiological functions, each on its own line starting with a bullet point (•). Concise, exam-focused.'
    ),
  clinicalRelevance: z
    .string()
    .describe(
      '4-6 clinically important points — common diseases, surgical importance, or exam-relevant facts — each on its own line starting with a bullet point (•). Relevant for MBBS surgery, medicine, and anatomy exams in India.'
    ),
  wikipediaDiagramUrl: z
    .string()
    .url()
    .describe(
      'A direct URL to a high-quality labeled anatomical diagram image of this organ from Wikimedia Commons (upload.wikimedia.org). Must be a real, publicly accessible .svg, .png, or .jpg image URL. Example format: https://upload.wikimedia.org/wikipedia/commons/thumb/.../...'
    ),
  wikipediaSource: z
    .string()
    .describe('Attribution text e.g. "Wikimedia Commons / Gray\'s Anatomy"'),
})

export async function POST(req: Request) {
  // Auth check
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const organName = body?.organName?.trim()

  if (!organName) {
    return Response.json({ error: 'organName is required' }, { status: 400 })
  }

  try {
    const result = await generateObject({
      model: gateway('google/gemini-2.5-flash'),
      schema: SpecimenContentSchema,
      prompt: `You are an anatomy professor at an Indian MBBS college helping create museum specimen labels.

Generate complete, accurate educational content for a preserved anatomy museum specimen of: "${organName}"

Requirements:
- Description: What a student sees looking at the preserved specimen in a jar — mention the organ's shape, color (in formalin), visible structures, surfaces, chambers, or attachments as applicable
- Functions: Bullet points, precise physiological functions, exam-relevant
- Clinical Relevance: Bullet points, important diseases, surgical landmarks, common exam questions in Indian MBBS (refer to Harrison's, Gray's, Robbins)
- Wikipedia Diagram URL: Provide a REAL, VALID direct image URL from upload.wikimedia.org for a labeled anatomical diagram of this organ. This must be a working URL to an actual image file.

Be accurate, concise, and educational. Target audience: first-year MBBS students in India.`,
    })

    return Response.json({ success: true, data: result.object })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err)
    const isBilling =
      message.includes('credit card') || message.includes('customer_verification')
    console.error('[generate-specimen] Error:', message)
    return Response.json(
      {
        error: isBilling
          ? 'AI Gateway requires a credit card on your Vercel account. Visit vercel.com/~ai to add one, then try again.'
          : 'Failed to generate content. Please try again.',
      },
      { status: 500 }
    )
  }
}
