import React, { useEffect, useState } from 'react'
import { ChevronDown, Cpu } from 'lucide-react'
import { useDemoStore, DEFAULT_DEMO_MODEL } from '@/store/demoStore'
import { listModels } from '@/services/dashboard/models/modelsService'

export const ModelSelector: React.FC = () => {
  const {
    selectedModel,
    availableModels,
    isLoadingModels,
    modelsError,
    setSelectedModel,
    setAvailableModels,
    setLoadingModels,
    setModelsError,
  } = useDemoStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchModels() {
      setLoadingModels(true)
      try {
        const result = await listModels()
        if (cancelled) return
        const names = (result.models ?? []).map((m) => m.name).filter(Boolean)
        setAvailableModels(names)
        setModelsError(null)
        if (names.length && !names.includes(selectedModel)) {
          setSelectedModel(
            names.find((n) => n === DEFAULT_DEMO_MODEL) || names[0],
          )
        }
      } catch (err: any) {
        if (!cancelled) setModelsError(err?.message || 'Failed to load models')
      } finally {
        if (!cancelled) setLoadingModels(false)
      }
    }
    fetchModels()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayList = availableModels.length
    ? availableModels
    : [DEFAULT_DEMO_MODEL]

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={
          modelsError
            ? `Model list unavailable: ${modelsError}`
            : 'Select demo model'
        }
        className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium bg-foreground/[0.05] hover:bg-foreground/[0.08] border border-foreground/10 hover:border-primary/30 text-foreground/70 hover:text-foreground transition-all"
      >
        <Cpu size={13} className="text-primary" />
        <span className="max-w-[110px] truncate">
          {isLoadingModels ? 'Loading…' : selectedModel}
        </span>
        <ChevronDown size={12} className="text-foreground/40" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full mb-2 right-0 min-w-[220px] z-50 rounded-xl border border-foreground/10 bg-background shadow-xl shadow-black/30 backdrop-blur-lg overflow-hidden">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-foreground/40 border-b border-foreground/10">
              Demo model
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {displayList.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setSelectedModel(name)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-all ${
                    name === selectedModel
                      ? 'bg-primary/10 text-foreground border-l-2 border-primary'
                      : 'text-foreground/70 hover:bg-foreground/[0.05] hover:text-foreground border-l-2 border-transparent'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            {modelsError && (
              <div className="px-3 py-2 text-[10px] text-destructive border-t border-foreground/10">
                {modelsError}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
