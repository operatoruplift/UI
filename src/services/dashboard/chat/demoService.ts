/**
 * Demo mode service.
 *
 * Hits the CORE Flask backend's public /api/demo endpoint, which runs a
 * single buffered agent query against a pinned fast model and returns the
 * fully-assembled response as JSON (no SSE streaming).
 *
 * Intentionally isolated from `chatService.ts` — this path is unauthenticated
 * and targets a hardcoded localhost URL for Colosseum Demo Day. Do not reuse
 * for the production chat flow.
 */

const DEMO_ENDPOINT = 'http://localhost:5000/api/demo'
const DEMO_TIMEOUT_MS = 65_000

export interface DemoResponse {
  response: string
  model: string
  duration_ms: number
  truncated: boolean
  chunk_count: number
}

export interface DemoErrorBody {
  error: string
  message?: string
  retry_after_seconds?: number
}

export class DemoServiceError extends Error {
  readonly code: string
  readonly status: number
  readonly retryAfterSeconds?: number

  constructor(code: string, message: string, status: number, retryAfterSeconds?: number) {
    super(message)
    this.name = 'DemoServiceError'
    this.code = code
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

/**
 * Send a single demo query. Resolves with the assistant response string.
 * Throws DemoServiceError on any non-2xx or network failure.
 * Optional `model` overrides the backend's default (advisory only on the
 * Flask side — see core/demo_service.py for the caveat).
 */
export async function sendDemoMessage(message: string, model?: string): Promise<string> {
  const trimmed = (message ?? '').trim()
  if (!trimmed) {
    throw new DemoServiceError('empty_message', 'Message cannot be empty', 400)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEMO_TIMEOUT_MS)

  const reqBody: Record<string, unknown> = { message: trimmed }
  if (model) reqBody.model = model

  let res: Response
  try {
    res = await fetch(DEMO_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
      signal: controller.signal,
    })
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err?.name === 'AbortError') {
      throw new DemoServiceError('timeout', 'Demo request timed out', 504)
    }
    throw new DemoServiceError(
      'network_error',
      `Cannot reach demo backend at ${DEMO_ENDPOINT}. Is the Flask server running?`,
      0,
    )
  }
  clearTimeout(timeoutId)

  let resBody: DemoResponse | DemoErrorBody | null = null
  try {
    resBody = await res.json()
  } catch {
    throw new DemoServiceError('bad_response', 'Demo backend returned invalid JSON', res.status)
  }

  if (!res.ok) {
    const errBody = resBody as DemoErrorBody
    throw new DemoServiceError(
      errBody?.error || 'demo_failed',
      errBody?.message || errBody?.error || `HTTP ${res.status}`,
      res.status,
      errBody?.retry_after_seconds,
    )
  }

  const ok = resBody as DemoResponse
  return ok.response ?? ''
}

export async function sendDemoMessageFull(message: string, model?: string): Promise<DemoResponse> {
  const trimmed = (message ?? '').trim()
  if (!trimmed) {
    throw new DemoServiceError('empty_message', 'Message cannot be empty', 400)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEMO_TIMEOUT_MS)

  const reqBody: Record<string, unknown> = { message: trimmed }
  if (model) reqBody.model = model

  let res: Response
  try {
    res = await fetch(DEMO_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
      signal: controller.signal,
    })
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err?.name === 'AbortError') {
      throw new DemoServiceError('timeout', 'Demo request timed out', 504)
    }
    throw new DemoServiceError('network_error', `Cannot reach ${DEMO_ENDPOINT}`, 0)
  }
  clearTimeout(timeoutId)

  const resBody = (await res.json().catch(() => null)) as DemoResponse | DemoErrorBody | null
  if (!res.ok || !resBody) {
    const errBody = resBody as DemoErrorBody | null
    throw new DemoServiceError(
      errBody?.error || 'demo_failed',
      errBody?.message || `HTTP ${res.status}`,
      res.status,
      errBody?.retry_after_seconds,
    )
  }
  return resBody as DemoResponse
}
