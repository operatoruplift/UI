/**
 * Permissions service.
 *
 * Two data sources, deliberately split:
 *
 * 1. PENDING QUEUE — served by Flask at localhost:5000 (`/api/permissions/pending/*`).
 *    This is a demo-theater in-memory queue that mirrors the "approve every
 *    agent action" story from the website. No real enforcement.
 *
 * 2. RULES ENGINE — served by the Rust runtime at localhost:3001
 *    (`/api/permissions`). Returns `{mode, rules}`. This is the real
 *    permission-rules surface; Approve/Deny is not part of it.
 *
 * The UI consumes both. ApprovalModal uses (1); PermissionsSection uses (2).
 */

const FLASK_BASE = 'http://localhost:5000'
const RUST_BASE = 'http://localhost:3001'
const FETCH_TIMEOUT_MS = 5000

function withTimeout<T>(p: Promise<T>, ms = FETCH_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), ms)
  return (p as any).finally?.(() => clearTimeout(t)) ?? p
}

// ---------- PENDING QUEUE (Flask) ----------

export type RiskLevel = 'low' | 'medium' | 'high'

export interface PendingPermission {
  id: string
  seq: number
  agent: string
  action: string
  resource: string
  risk: RiskLevel
  created_at: number
  status: 'pending'
}

export interface ResolvedPermission extends Omit<PendingPermission, 'status'> {
  status: 'approved' | 'denied'
  resolved_at: number
}

export async function listPendingPermissions(signal?: AbortSignal): Promise<PendingPermission[]> {
  const res = await fetch(`${FLASK_BASE}/api/permissions/pending`, { signal })
  if (!res.ok) throw new Error(`pending list failed: HTTP ${res.status}`)
  const body = await res.json()
  return (body?.pending ?? []) as PendingPermission[]
}

export async function approvePermission(id: string): Promise<ResolvedPermission> {
  const res = await fetch(`${FLASK_BASE}/api/permissions/pending/${id}/approve`, { method: 'POST' })
  if (!res.ok) throw new Error(`approve failed: HTTP ${res.status}`)
  const body = await res.json()
  return body.resolved as ResolvedPermission
}

export async function denyPermission(id: string): Promise<ResolvedPermission> {
  const res = await fetch(`${FLASK_BASE}/api/permissions/pending/${id}/deny`, { method: 'POST' })
  if (!res.ok) throw new Error(`deny failed: HTTP ${res.status}`)
  const body = await res.json()
  return body.resolved as ResolvedPermission
}

// ---------- RULES ENGINE (Rust runtime) ----------

export interface PermissionRule {
  id?: string
  pattern?: string
  action?: string
  effect?: 'allow' | 'deny' | string
  [key: string]: any
}

export interface PermissionRulesDoc {
  mode: string
  rules: PermissionRule[]
}

export async function getPermissionRules(): Promise<PermissionRulesDoc> {
  try {
    const res = await fetch(`${RUST_BASE}/api/permissions`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as PermissionRulesDoc
  } catch (err: any) {
    throw new Error(
      `Cannot reach Rust runtime permissions at ${RUST_BASE}/api/permissions: ${err?.message || err}`,
    )
  }
}

export async function addPermissionRule(rule: PermissionRule): Promise<PermissionRulesDoc> {
  const res = await fetch(`${RUST_BASE}/api/permissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  })
  if (!res.ok) throw new Error(`rule create failed: HTTP ${res.status}`)
  return (await res.json()) as PermissionRulesDoc
}
