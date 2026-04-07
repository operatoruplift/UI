/**
 * Ollama models listing — hits Flask /api/models.
 */

const MODELS_ENDPOINT = 'http://localhost:5000/api/models'

export interface OllamaModel {
  name: string
  size?: number
  modified_at?: string
  family?: string | null
}

export interface ModelsResult {
  host: string
  models: OllamaModel[]
}

export async function listModels(): Promise<ModelsResult> {
  const res = await fetch(MODELS_ENDPOINT)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message || `HTTP ${res.status}`)
  }
  return (await res.json()) as ModelsResult
}
