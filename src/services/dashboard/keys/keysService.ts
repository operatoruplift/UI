/**
 * Access Keys service — Agentic Vault.
 *
 * Talks directly to the Rust runtime at localhost:3001. The runtime's
 * /api/keys endpoint requires an admin token (the passphrase unlocks the
 * encrypted vault via /api/auth/unlock). This service exposes:
 *
 *   - listKeys(): fetches /api/keys. Returns empty + requiresUnlock=true if
 *     the runtime says it needs an admin token.
 *   - unlockVault(passphrase): POST /api/auth/unlock, stores the returned
 *     admin token in-memory (NOT localStorage — we don't want the token to
 *     outlive the session).
 *   - createKey / revokeKey: authenticated calls using the stored token.
 */

const RUST_BASE = 'http://localhost:3001'

export interface AccessKey {
  id: string
  name?: string
  label?: string
  created_at?: string
  expires_at?: string | null
  revoked_at?: string | null
  scopes?: string[]
  [key: string]: any
}

export interface KeysListResult {
  keys: AccessKey[]
  requiresUnlock: boolean
  message?: string
}

let _adminToken: string | null = null

export function getAdminToken(): string | null {
  return _adminToken
}

function authHeaders(): Record<string, string> {
  return _adminToken ? { Authorization: `Bearer ${_adminToken}` } : {}
}

export async function unlockVault(passphrase: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!passphrase) return { ok: false, error: 'Passphrase required' }
  try {
    const res = await fetch(`${RUST_BASE}/api/auth/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase }),
    })
    if (!res.ok) {
      return { ok: false, error: `Unlock failed: HTTP ${res.status}` }
    }
    const body = await res.json().catch(() => ({}))
    // Accept several plausible token field names — we don't know the exact shape.
    const token = body?.admin_token || body?.token || body?.access_token || body?.session_token
    if (token) {
      _adminToken = String(token)
      return { ok: true }
    }
    // Some runtimes return just {ok: true} and set a session cookie. Treat
    // that as success too; subsequent requests will carry the cookie.
    if (body?.ok === true || body?.status === 'ok' || body?.unlocked === true) {
      return { ok: true }
    }
    return { ok: false, error: 'Unlock response did not include a token' }
  } catch (err: any) {
    return { ok: false, error: `Cannot reach runtime: ${err?.message || err}` }
  }
}

export function lockVault(): void {
  _adminToken = null
}

export async function listKeys(): Promise<KeysListResult> {
  try {
    const res = await fetch(`${RUST_BASE}/api/keys`, {
      headers: authHeaders(),
      credentials: 'include',
    })
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { keys: [], requiresUnlock: true, message: `HTTP ${res.status}` }
      }
      throw new Error(`HTTP ${res.status}`)
    }
    const body = await res.json()
    const keys = (body?.keys ?? []) as AccessKey[]
    const msg = body?.message as string | undefined
    const requiresUnlock = !!msg && /admin token|unlock|passphrase/i.test(msg)
    return { keys, requiresUnlock, message: msg }
  } catch (err: any) {
    throw new Error(`Cannot reach runtime at ${RUST_BASE}/api/keys: ${err?.message || err}`)
  }
}

export async function createKey(name: string, scopes: string[] = []): Promise<AccessKey> {
  const res = await fetch(`${RUST_BASE}/api/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify({ name, scopes }),
  })
  if (!res.ok) throw new Error(`create key failed: HTTP ${res.status}`)
  const body = await res.json()
  return (body?.key ?? body) as AccessKey
}

export async function revokeKey(id: string): Promise<void> {
  const res = await fetch(`${RUST_BASE}/api/keys/${id}/revoke`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`revoke failed: HTTP ${res.status}`)
}
