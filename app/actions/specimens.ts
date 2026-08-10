'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { specimens } from '@/lib/db/schema'
import { and, asc, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getSpecimens() {
  const userId = await getUserId()
  return db
    .select()
    .from(specimens)
    .where(eq(specimens.userId, userId))
    .orderBy(desc(specimens.createdAt))
}

export async function getPublicSpecimens() {
  return db
    .select()
    .from(specimens)
    .orderBy(asc(specimens.specimenNumber))
}

export async function getSpecimenById(id: string) {
  const result = await db
    .select()
    .from(specimens)
    .where(eq(specimens.id, id))
    .limit(1)
  return result[0] ?? null
}

export async function getSpecimenByNumber(specimenNumber: string) {
  const result = await db
    .select()
    .from(specimens)
    .where(eq(specimens.specimenNumber, specimenNumber))
    .limit(1)
  return result[0] ?? null
}

export async function createSpecimen(data: {
  name: string
  systemCategory: string
  specimenNumber: string
  organ: string
  sex?: string
  age?: string
  preservationMethod: string
  jarSize?: string
  collectionDate?: string
  donorInfo?: string
  description: string
  functions: string
  clinicalRelevance: string
  imageUrl?: string
  specimenPhotoUrl?: string
  additionalNotes?: string
}) {
  const userId = await getUserId()
  const id = randomUUID()
  await db.insert(specimens).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/admin')
  return id
}

export async function updateSpecimen(
  id: string,
  data: {
    name?: string
    systemCategory?: string
    specimenNumber?: string
    organ?: string
    sex?: string
    age?: string
    preservationMethod?: string
    jarSize?: string
    collectionDate?: string
    donorInfo?: string
    description?: string
    functions?: string
    clinicalRelevance?: string
    imageUrl?: string
    specimenPhotoUrl?: string
    additionalNotes?: string
  }
) {
  const userId = await getUserId()
  await db
    .update(specimens)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(specimens.id, id), eq(specimens.userId, userId)))
  revalidatePath('/admin')
  revalidatePath(`/specimen/${id}`)
}

export async function deleteSpecimen(id: string) {
  const userId = await getUserId()
  await db
    .delete(specimens)
    .where(and(eq(specimens.id, id), eq(specimens.userId, userId)))
  revalidatePath('/admin')
}
