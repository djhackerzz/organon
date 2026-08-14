export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === '1'
}

export function demoDatabasePath(): string {
  return process.env.DEMO_DB_PATH ?? 'data/demo.sqlite'
}
