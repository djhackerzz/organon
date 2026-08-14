import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { isDemoMode, demoDatabasePath } from '@/lib/demo-mode'
import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

function demoDatabase() {
  const path = demoDatabasePath()
  mkdirSync(dirname(path), { recursive: true })
  return new Database(path)
}

export const auth = betterAuth({
  database: isDemoMode() ? demoDatabase() : pool,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    (isDemoMode() ? 'offline-demo-secret-do-not-use-in-prod' : undefined),
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (isDemoMode()
      ? 'http://localhost:3000'
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    'http://localhost:3000',
    'https://*.vercel.app',
    // Custom domain support — add your published domain here if you rename it
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_BRANCH_URL
      ? [`https://${process.env.VERCEL_BRANCH_URL}`]
      : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  ...(process.env.NODE_ENV === 'development' || isDemoMode()
    ? {
        advanced: {
          // v0 preview runs inside a cross-site iframe — disable CSRF origin
          // check and set cross-site cookies so sessions survive the iframe.
          disableCSRFCheck: true,
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
