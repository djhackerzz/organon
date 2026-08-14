'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/tables'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

const defaultSiteSettings = {
  functionsHeading: 'Physiological Functions',
  clinicalRelevanceHeading: 'Clinical Relevance',
  specimenDetailsHeading: 'Specimen Details',
  donorInformationHeading: 'Donor Information (Anonymized)',
  additionalNotesHeading: 'Additional Notes',
  showImages: true,
  showFunctions: true,
  showClinicalRelevance: true,
  showSpecimenDetails: true,
  showDonorInformation: true,
  showAdditionalNotes: true,
  showFooter: true,
} as const

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getSiteSettings() {
  const userId = await getUserId()
  const result = await db.select().from(siteSettings).where(eq(siteSettings.userId, userId)).limit(1)
  return result[0] ?? { id: '', userId, ...defaultSiteSettings }
}

export async function getPublicSiteSettings() {
  const result = await db.select().from(siteSettings).limit(1)
  return result[0] ?? { id: '', userId: '', ...defaultSiteSettings }
}

export async function saveSiteSettings(data: {
  functionsHeading: string
  clinicalRelevanceHeading: string
  specimenDetailsHeading: string
  donorInformationHeading: string
  additionalNotesHeading: string
  showImages: boolean
  showFunctions: boolean
  showClinicalRelevance: boolean
  showSpecimenDetails: boolean
  showDonorInformation: boolean
  showAdditionalNotes: boolean
  showFooter: boolean
}) {
  const userId = await getUserId()
  const headings = [
    data.functionsHeading,
    data.clinicalRelevanceHeading,
    data.specimenDetailsHeading,
    data.donorInformationHeading,
    data.additionalNotesHeading,
  ]
  if (headings.some((value) => value.trim().length === 0 || value.trim().length > 80)) {
    throw new Error('Headings must be between 1 and 80 characters.')
  }

  const existing = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.userId, userId)).limit(1)
  if (existing[0]) {
    await db.update(siteSettings).set({ ...data, updatedAt: new Date() }).where(eq(siteSettings.userId, userId))
  } else {
    await db.insert(siteSettings).values({ id: randomUUID(), userId, ...data })
  }

  revalidatePath('/admin/settings')
  revalidatePath('/specimen/[id]', 'page')
}
