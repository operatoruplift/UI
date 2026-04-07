import React, { useEffect, useRef, useState } from 'react'
import { Shield, Check, X, AlertTriangle } from 'lucide-react'
import {
  listPendingPermissions,
  approvePermission,
  denyPermission,
  PendingPermission,
  RiskLevel,
} from '@/services/dashboard/permissions/permissionsService'

const POLL_INTERVAL_MS = 3000

const riskStyles: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: 'LOW', className: 'bg-foreground/10 text-foreground/70 border-foreground/20' },
  medium: { label: 'MEDIUM', className: 'bg-accent/15 text-accent border-accent/30' },
  high: { label: 'HIGH', className: 'bg-destructive/15 text-destructive border-destructive/30' },
}

function formatAction(item: PendingPermission): string {
  return item.action.replace(/_/g, ' ')
}

export const ApprovalModal: React.FC = () => {
  const [pending, setPending] = useState<PendingPermission[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    let cancelled = false
    const controller = new AbortController()

    async function poll() {
      try {
        const items = await listPendingPermissions(controller.signal)
        if (!cancelled && mountedRef.current) {
          setPending(items)
          setError(null)
        }
      } catch (err: any) {
        if (!cancelled && mountedRef.current && err?.name !== 'AbortError') {
          setError(err?.message || 'Failed to poll permissions')
        }
      }
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      mountedRef.current = false
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  const handleApprove = async (id: string) => {
    setBusyId(id)
    try {
      await approvePermission(id)
      setPending((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      setError(err?.message || 'Approve failed')
    } finally {
      setBusyId(null)
    }
  }

  const handleDeny = async (id: string) => {
    setBusyId(id)
    try {
      await denyPermission(id)
      setPending((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      setError(err?.message || 'Deny failed')
    } finally {
      setBusyId(null)
    }
  }

  if (pending.length === 0 && !error) return null

  const top = pending[0]

  return (
    <div className="flex-shrink-0 px-4 pb-2 sm:px-6">
      <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
        {error && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            <AlertTriangle size={14} />
            <span className="truncate">Permissions service: {error}</span>
          </div>
        )}
        {top && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.04] border border-primary/25 backdrop-blur-sm animate-slide-in">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Shield size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-foreground">
                  {top.agent}
                </span>
                <span className="text-[10px] text-foreground/40 uppercase tracking-wider">
                  wants to
                </span>
                <span className="text-xs font-medium text-foreground">
                  {formatAction(top)}
                </span>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${riskStyles[top.risk].className}`}
                >
                  {riskStyles[top.risk].label}
                </span>
              </div>
              <div className="text-[11px] text-foreground/50 font-mono truncate">
                {top.resource}
              </div>
              {pending.length > 1 && (
                <div className="text-[10px] text-foreground/30 mt-0.5">
                  +{pending.length - 1} more pending
                </div>
              )}
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDeny(top.id)}
                disabled={busyId === top.id}
                title="Deny"
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-foreground/5 hover:bg-destructive/15 border border-foreground/10 hover:border-destructive/30 text-foreground/60 hover:text-destructive transition-all disabled:opacity-40"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleApprove(top.id)}
                disabled={busyId === top.id}
                title="Approve"
                className="h-8 px-3 rounded-lg flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-40"
              >
                <Check size={14} />
                <span>Approve</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
