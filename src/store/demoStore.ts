/**
 * Demo-mode UI state: currently selected model for /api/demo.
 *
 * Kept deliberately tiny — this is just a slot for the selector dropdown
 * and the Demo button to talk through, so they don't have to prop-drill.
 */
import { create } from 'zustand'

export const DEFAULT_DEMO_MODEL = 'llama3.2:3b'

interface DemoState {
  selectedModel: string
  availableModels: string[]
  isLoadingModels: boolean
  modelsError: string | null
  setSelectedModel: (model: string) => void
  setAvailableModels: (models: string[]) => void
  setLoadingModels: (loading: boolean) => void
  setModelsError: (err: string | null) => void
}

export const useDemoStore = create<DemoState>((set) => ({
  selectedModel: DEFAULT_DEMO_MODEL,
  availableModels: [],
  isLoadingModels: false,
  modelsError: null,
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setAvailableModels: (availableModels) => set({ availableModels }),
  setLoadingModels: (isLoadingModels) => set({ isLoadingModels }),
  setModelsError: (modelsError) => set({ modelsError }),
}))
