#!/bin/sh
set -e

PORT="${PORT:-3000}"

echo "[anatomy-demo] starting offline demo on :${PORT} ..."

# Start the Next.js server in the background.
node node_modules/next/dist/bin/next start -p "$PORT" &
SERVER_PID=$!

# Wait until the server is accepting requests.
node -e "
const base = 'http://127.0.0.1:' + (process.env.PORT || '3000');
(async () => {
  let up = false;
  for (let i = 0; i < 90; i++) {
    try {
      await fetch(base + '/', { signal: AbortSignal.timeout(1500) });
      up = true;
      break;
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (!up) { console.error('[anatomy-demo] server did not start in time'); process.exit(1); }
  try {
    const res = await fetch(base + '/api/demo/seed', { signal: AbortSignal.timeout(60000) });
    const json = await res.json();
    console.log('[anatomy-demo] seed ' + (json.ok ? 'complete' : 'failed') + ' — ' + (json.specimenCount ?? json.error ?? '') + ' specimens ready');
  } catch (e) {
    console.log('[anatomy-demo] seed warning: ' + e.message);
  }
})();
"

echo "[anatomy-demo] live at http://localhost:${PORT}  (admin@anatomy.edu.in / password123)"

# Keep the server in the foreground so the container stays alive.
wait "$SERVER_PID"
