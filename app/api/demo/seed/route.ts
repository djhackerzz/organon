import { NextResponse } from 'next/server'
import { isDemoMode, demoDatabasePath } from '@/lib/demo-mode'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { specimens, siteSettings } from '@/lib/db/tables'
import { demoSpecimens, demoAdmin, demoSiteSettings } from '@/lib/demo-data'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

type DemoDbClient = {
  exec: (sql: string) => void
  prepare?: (sql: string) => { get: (...args: unknown[]) => unknown }
}

// Demo-only seed. Guards against accidental use in production.
export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const sqlite = (db as unknown as { $client?: DemoDbClient }).$client
  if (!sqlite) {
    return NextResponse.json({ error: 'Demo database not available' }, { status: 500 })
  }

  try {
    // 1. Better Auth tables (user, session, account, verification)
    const { getMigrations } = await import('better-auth/db/migration')
    const { runMigrations } = await getMigrations(auth.options)
    await runMigrations()

    // 2. App tables
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS specimens (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        systemCategory TEXT NOT NULL,
        specimenNumber TEXT NOT NULL UNIQUE,
        organ TEXT NOT NULL,
        sex TEXT,
        age TEXT,
        preservationMethod TEXT NOT NULL,
        jarSize TEXT,
        collectionDate TEXT,
        donorInfo TEXT,
        description TEXT NOT NULL,
        functions TEXT NOT NULL,
        clinicalRelevance TEXT NOT NULL,
        imageUrl TEXT,
        specimenPhotoUrl TEXT,
        additionalNotes TEXT,
        createdAt INTEGER DEFAULT (strftime('%s','now')*1000) NOT NULL,
        updatedAt INTEGER DEFAULT (strftime('%s','now')*1000) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL UNIQUE,
        functionsHeading TEXT NOT NULL DEFAULT 'Physiological Functions',
        clinicalRelevanceHeading TEXT NOT NULL DEFAULT 'Clinical Relevance',
        specimenDetailsHeading TEXT NOT NULL DEFAULT 'Specimen Details',
        donorInformationHeading TEXT NOT NULL DEFAULT 'Donor Information (Anonymized)',
        additionalNotesHeading TEXT NOT NULL DEFAULT 'Additional Notes',
        showImages INTEGER NOT NULL DEFAULT 1,
        showFunctions INTEGER NOT NULL DEFAULT 1,
        showClinicalRelevance INTEGER NOT NULL DEFAULT 1,
        showSpecimenDetails INTEGER NOT NULL DEFAULT 1,
        showDonorInformation INTEGER NOT NULL DEFAULT 1,
        showAdditionalNotes INTEGER NOT NULL DEFAULT 1,
        showFooter INTEGER NOT NULL DEFAULT 1,
        createdAt INTEGER DEFAULT (strftime('%s','now')*1000) NOT NULL,
        updatedAt INTEGER DEFAULT (strftime('%s','now')*1000) NOT NULL
      );
    `)

    // 3. Admin user (idempotent)
    const existingAdmin = (sqlite.prepare
      ?.('SELECT id FROM user WHERE email = ?')
      .get(demoAdmin.email) ?? null) as { id: string } | null

    let adminUserId = existingAdmin?.id ?? null
    if (!adminUserId) {
      const signup = await auth.api.signUpEmail({
        body: {
          email: demoAdmin.email,
          password: demoAdmin.password,
          name: demoAdmin.name,
        },
      })
      adminUserId = signup.user.id
    }

    // 4. Demo specimen (idempotent — skip if any exist)
    const existing = await db.select({ id: specimens.id }).from(specimens).limit(1)
    if (existing.length === 0) {
      for (const s of demoSpecimens) {
        await db.insert(specimens).values({
          id: randomUUID(),
          userId: adminUserId,
          ...s,
        })
      }
    }

    // 5. Site settings (idempotent)
    const settingsRow = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .where(eq(siteSettings.userId, adminUserId))
      .limit(1)
    if (settingsRow.length === 0) {
      await db.insert(siteSettings).values({
        id: randomUUID(),
        userId: adminUserId,
        ...demoSiteSettings,
      })
    }

    const counts = await db.select({ id: specimens.id }).from(specimens)
    return NextResponse.json({
      ok: true,
      db: demoDatabasePath(),
      adminEmail: demoAdmin.email,
      specimenCount: counts.length,
    })
  } catch (error) {
    console.error('[demo/seed] Error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
