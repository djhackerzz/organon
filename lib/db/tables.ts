import { isDemoMode } from '@/lib/demo-mode'
import * as schema from './schema'
import * as demoSchema from './schema-demo'

export const specimens = (isDemoMode()
  ? demoSchema.specimens
  : schema.specimens) as typeof schema.specimens

export const siteSettings = (isDemoMode()
  ? demoSchema.siteSettings
  : schema.siteSettings) as typeof schema.siteSettings
