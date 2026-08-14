import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// --- App tables (SQLite / offline demo) ------------------------------------
// Mirrors lib/db/schema.ts so the demo mode can run without PostgreSQL.

export const specimens = sqliteTable('specimens', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  systemCategory: text('systemCategory').notNull(),
  specimenNumber: text('specimenNumber').notNull().unique(),
  organ: text('organ').notNull(),
  sex: text('sex'),
  age: text('age'),
  preservationMethod: text('preservationMethod').notNull(),
  jarSize: text('jarSize'),
  collectionDate: text('collectionDate'),
  donorInfo: text('donorInfo'),
  description: text('description').notNull(),
  functions: text('functions').notNull(),
  clinicalRelevance: text('clinicalRelevance').notNull(),
  imageUrl: text('imageUrl'),
  specimenPhotoUrl: text('specimenPhotoUrl'),
  additionalNotes: text('additionalNotes'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().defaultNow(),
})

export const siteSettings = sqliteTable('site_settings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  functionsHeading: text('functionsHeading').notNull().default('Physiological Functions'),
  clinicalRelevanceHeading: text('clinicalRelevanceHeading').notNull().default('Clinical Relevance'),
  specimenDetailsHeading: text('specimenDetailsHeading').notNull().default('Specimen Details'),
  donorInformationHeading: text('donorInformationHeading').notNull().default('Donor Information (Anonymized)'),
  additionalNotesHeading: text('additionalNotesHeading').notNull().default('Additional Notes'),
  showImages: integer('showImages', { mode: 'boolean' }).notNull().default(true),
  showFunctions: integer('showFunctions', { mode: 'boolean' }).notNull().default(true),
  showClinicalRelevance: integer('showClinicalRelevance', { mode: 'boolean' }).notNull().default(true),
  showSpecimenDetails: integer('showSpecimenDetails', { mode: 'boolean' }).notNull().default(true),
  showDonorInformation: integer('showDonorInformation', { mode: 'boolean' }).notNull().default(true),
  showAdditionalNotes: integer('showAdditionalNotes', { mode: 'boolean' }).notNull().default(true),
  showFooter: integer('showFooter', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().defaultNow(),
})

export type Specimen = typeof specimens.$inferSelect
export type NewSpecimen = typeof specimens.$inferInsert
export type SiteSettings = typeof siteSettings.$inferSelect
