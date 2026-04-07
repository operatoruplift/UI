import React, { useEffect, useState } from 'react'
import { Shield, RefreshCw, AlertCircle } from 'lucide-react'
import {
  getPermissionRules,
  PermissionRulesDoc,
} from '@/services/dashboard/permissions/permissionsService'

export const PermissionsSection: React.FC = () => {
  const [doc, setDoc] = useState<PermissionRulesDoc | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await getPermissionRules()
      setDoc(d)
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch permission rules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            Permission Rules
          </h3>
          <p className="text-xs text-foreground/50 mt-1">
            The rules engine governs what agents can do. Fetched live from the Rust runtime at{' '}
            <code className="px-1 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-[11px]">
              localhost:3001/api/permissions
            </code>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          title="Refresh"
          className="h-8 w-8 rounded-lg flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground/60 transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertCircle size={14} />
          <span className="truncate">{error}</span>
        </div>
      )}

      {doc && (
        <>
          <div className="p-4 rounded-xl bg-foreground/[0.03] border border-foreground/10">
            <div className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2">
              Mode
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider">
                {doc.mode}
              </span>
              <span className="text-xs text-foreground/50">
                {doc.mode === 'default'
                  ? 'Default enforcement — built-in rules only.'
                  : 'Custom enforcement mode.'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2">
              Active rules ({doc.rules.length})
            </div>
            {doc.rules.length === 0 ? (
              <div className="text-center py-8 text-sm text-foreground/40 rounded-xl bg-foreground/[0.02] border border-dashed border-foreground/10">
                No custom rules configured. Runtime is using defaults.
              </div>
            ) : (
              <div className="space-y-2">
                {doc.rules.map((rule, idx) => (
                  <div
                    key={rule.id || idx}
                    className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {rule.effect && (
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                            rule.effect === 'allow'
                              ? 'bg-primary/15 text-primary border-primary/25'
                              : 'bg-destructive/15 text-destructive border-destructive/30'
                          }`}
                        >
                          {String(rule.effect).toUpperCase()}
                        </span>
                      )}
                      <span className="text-xs font-medium text-foreground">
                        {rule.action || '(any action)'}
                      </span>
                    </div>
                    {rule.pattern && (
                      <div className="text-[11px] font-mono text-foreground/50">
                        {rule.pattern}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
