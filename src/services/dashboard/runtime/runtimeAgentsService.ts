/**
 * Runtime agents service.
 *
 * Fetches agents from the Rust runtime (localhost:3001/api/agents), which is
 * the authoritative source for the Demo Day build. Flask's /api/agents/{name}/run
 * stub is used as the launch target since the runtime doesn't yet expose a
 * one-shot agent-invoke route the UI can hit without a session.
 */

const RUST_BASE = 'http://localhost:3001'
const FLASK_BASE = 'http://localhost:5000'

export interface RuntimeAgent {
  id: string
  name: string
  model: string
  provider: string
  system_prompt?: string
  tools?: string[]
  created_at?: string
  updated_at?: string
  description?: string
  category?: string
  disabled?: boolean
}

export async function listRuntimeAgents(): Promise<RuntimeAgent[]> {
  try {
    const res = await fetch(`${RUST_BASE}/api/agents`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = await res.json()
    if (Array.isArray(body)) return body as RuntimeAgent[]
    if (Array.isArray(body?.agents)) return body.agents as RuntimeAgent[]
    return []
  } catch (err: any) {
    throw new Error(
      `Cannot reach Rust runtime agents at ${RUST_BASE}/api/agents: ${err?.message || err}`,
    )
  }
}

export interface AgentRunResult {
  agent: string
  response: string
  stub?: boolean
  context_echo?: Record<string, any>
}

export async function runAgent(
  name: string,
  message: string,
  context: Record<string, any> = {},
): Promise<AgentRunResult> {
  const res = await fetch(`${FLASK_BASE}/api/agents/${encodeURIComponent(name)}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`agent run failed: HTTP ${res.status} ${text}`)
  }
  return (await res.json()) as AgentRunResult
}
