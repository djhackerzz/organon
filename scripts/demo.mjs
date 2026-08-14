#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = process.cwd()

const PORT = process.env.PORT ?? '3000'
const DB_PATH = process.env.DEMO_DB_PATH ?? join(root, 'data', 'demo.sqlite')
const BUILD_DIR = join(root, '.next')
const DEMO_MODE = '1'

function log(msg) {
  console.log(`[demo] ${msg}`)
}

function isWin() {
  return process.platform === 'win32'
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    log(`${cmd} ${args.join(' ')}`)
    // On Windows, npm/npx are .cmd shims that spawn() cannot run directly.
    const child = spawn(cmd, args, {
      stdio: opts.silent ? 'ignore' : 'inherit',
      shell: isWin(),
      env: { ...process.env, ...opts.env },
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
    child.on('error', reject)
  })
}

function seed() {
  // We seed through the running server so the route can use the app's own
  // better-auth + drizzle instances. The first `next start` triggers it via
  // the demo/seed endpoint below.
  return Promise.resolve()
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) })
      if (res.ok || res.status < 500) return true
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

async function main() {
  const action = process.argv[2] ?? 'start'
  mkdirSync(join(root, 'data'), { recursive: true })

  if (action === 'prepare') {
    log('Installing dependencies...')
    await run('npm', ['install'])
    log('Building the app...')
    await run('npm', ['run', 'build'], { env: { DEMO_MODE: DEMO_MODE } })
    log('Prepare complete. You can now run `npm run demo` at the venue.')
    return
  }

  // start (default)
  if (!existsSync(BUILD_DIR)) {
    log('.next build not found — building now (needs internet for fonts).')
    await run('npm', ['run', 'build'], { env: { DEMO_MODE: DEMO_MODE } })
  }

  if (!existsSync(DB_PATH)) {
    log('Demo database not found — it will be seeded on first start.')
  }

  log(`Starting the offline demo at http://localhost:${PORT}`)
  // Use `node node_modules/next/dist/bin/next` instead of the .bin shim so it
  // works the same on Windows and POSIX (the shim is .cmd-only on Windows).
  const server = spawn(
    process.execPath,
    [join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', PORT],
    {
      stdio: 'inherit',
      env: { ...process.env, DEMO_MODE, DEMO_DB_PATH: DB_PATH },
    },
  )

  const base = `http://localhost:${PORT}`
  const up = await waitForServer(base)
  if (!up) {
    log('Server did not start in time.')
    server.kill()
    process.exit(1)
  }

  // Trigger seeding through the running app.
  try {
    const res = await fetch(`${base}/api/demo/seed`, { signal: AbortSignal.timeout(30000) })
    const json = await res.json()
    log(`Seed ${json.ok ? 'complete' : 'failed'}: ${json.specimenCount ?? json.error ?? ''} specimens ready`)
  } catch (e) {
    log(`Seed request failed: ${e.message}`)
  }

  log(`Demo is live: ${base}  (sign in: admin@anatomy.edu.in / password123)`)

  // Open the browser if possible (best effort).
  try {
    const { execSync } = require('node:child_process')
    const cmd = process.platform === 'darwin'
      ? `open ${base}`
      : process.platform === 'win32'
        ? `start "" "${base}"`
        : `xdg-open ${base}`
    execSync(cmd, { stdio: 'ignore' })
  } catch {
    /* no browser open available */
  }

  server.on('exit', (code) => process.exit(code ?? 0))
  process.on('SIGINT', () => server.kill())
  process.on('SIGTERM', () => server.kill())
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
