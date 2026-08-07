import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
export const specimens = pgTable('specimens', {
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
  imageUrl: text('imageUrl'),           // labeled diagram (e.g. from Wikimedia)
  specimenPhotoUrl: text('specimenPhotoUrl'), // your actual jar/specimen photo
  additionalNotes: text('additionalNotes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  functionsHeading: text('functionsHeading').notNull().default('Physiological Functions'),
  clinicalRelevanceHeading: text('clinicalRelevanceHeading').notNull().default('Clinical Relevance'),
  specimenDetailsHeading: text('specimenDetailsHeading').notNull().default('Specimen Details'),
  donorInformationHeading: text('donorInformationHeading').notNull().default('Donor Information (Anonymized)'),
  additionalNotesHeading: text('additionalNotesHeading').notNull().default('Additional Notes'),
  showImages: boolean('showImages').notNull().default(true),
  showFunctions: boolean('showFunctions').notNull().default(true),
  showClinicalRelevance: boolean('showClinicalRelevance').notNull().default(true),
  showSpecimenDetails: boolean('showSpecimenDetails').notNull().default(true),
  showDonorInformation: boolean('showDonorInformation').notNull().default(true),
  showAdditionalNotes: boolean('showAdditionalNotes').notNull().default(true),
  showFooter: boolean('showFooter').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type Specimen = typeof specimens.$inferSelect
export type NewSpecimen = typeof specimens.$inferInsert
export type SiteSettings = typeof siteSettings.$inferSelect
