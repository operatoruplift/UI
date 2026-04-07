import React, { useEffect, useState } from 'react'
import { Key, Lock, Unlock, Trash2, RefreshCw, AlertCircle, Plus } from 'lucide-react'
import {
  listKeys,
  unlockVault,
  lockVault,
  createKey,
  revokeKey,
  AccessKey,
  getAdminToken,
} from '@/services/dashboard/keys/keysService'

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function keyExpired(key: AccessKey): boolean {
  if (!key.expires_at) return false
  try {
    return new Date(key.expires_at).getTime() < Date.now()
  } catch {
    return false
  }
}

export const KeysSection: React.FC = () => {
  const [keys, setKeys] = useState<AccessKey[]>([])
  const [requiresUnlock, setRequiresUnlock] = useState(false)
  const [unlocked, setUnlocked] = useState<boolean>(!!getAdminToken())
  const [passphrase, setPassphrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listKeys()
      setKeys(result.keys)
      setRequiresUnlock(result.requiresUnlock)
      if (result.requiresUnlock) setUnlocked(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to load keys')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleUnlock = async () => {
    setLoading(true)
    setError(null)
    const result = await unlockVault(passphrase)
    if (!result.ok) {
      setError((result as { ok: false; error: string }).error)
      setLoading(false)
      return
    }
    setPassphrase('')
    setUnlocked(true)
    await refresh()
  }

  const handleLock = () => {
    lockVault()
    setUnlocked(false)
    setRequiresUnlock(true)
    setKeys([])
  }

  const handleRevoke = async (id: string) => {
    try {
      await revokeKey(id)
      await refresh()
    } catch (err: any) {
      setError(err?.message || 'Revoke failed')
    }
  }

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    try {
      await createKey(newKeyName.trim(), [])
      setNewKeyName('')
      await refresh()
    } catch (err: any) {
      setError(err?.message || 'Create key failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Key size={16} className="text-primary" />
            Agentic Vault
          </h3>
          <p className="text-xs text-foreground/50 mt-1">
            Time-limited access keys. Each key defines what an agent can see or do for a specific task.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            title="Refresh"
            className="h-8 w-8 rounded-lg flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground/60 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          {unlocked && (
            <button
              type="button"
              onClick={handleLock}
              title="Lock vault"
              className="h-8 px-3 rounded-lg flex items-center gap-1.5 bg-foreground/5 hover:bg-destructive/15 border border-foreground/10 hover:border-destructive/30 text-foreground/60 hover:text-destructive text-xs font-medium transition-all"
            >
              <Lock size={13} />
              Lock
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Unlock flow */}
      {!unlocked && (
        <div className="p-4 rounded-xl bg-foreground/[0.03] border border-foreground/10 space-y-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Lock size={14} className="text-primary" />
            <span className="font-medium">Vault is locked</span>
          </div>
          <p className="text-xs text-foreground/50">
            Enter your runtime passphrase to view and manage access keys. The passphrase is held in memory only for this session.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock()
              }}
              placeholder="Runtime passphrase"
              className="flex-1 h-9 px-3 rounded-lg bg-background border border-foreground/10 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/40"
            />
            <button
              type="button"
              onClick={handleUnlock}
              disabled={!passphrase || loading}
              className="h-9 px-4 rounded-lg flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-40"
            >
              <Unlock size={14} />
              Unlock
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      {unlocked && (
        <>
          <div className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10">
            <div className="flex items-center gap-2 mb-2">
              <Plus size={13} className="text-primary" />
              <span className="text-xs font-medium text-foreground">Create new key</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                }}
                placeholder="Key name (e.g. calendar-read-only)"
                className="flex-1 h-8 px-3 rounded-lg bg-background border border-foreground/10 text-xs text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/40"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newKeyName.trim()}
                className="h-8 px-3 rounded-lg bg-primary/15 hover:bg-primary/25 border border-primary/25 text-primary text-xs font-medium transition-all disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {keys.length === 0 ? (
              <div className="text-center py-8 text-sm text-foreground/40">
                No access keys yet. Create one above.
              </div>
            ) : (
              keys.map((k) => {
                const expired = keyExpired(k)
                const revoked = !!k.revoked_at
                const inactive = expired || revoked
                return (
                  <div
                    key={k.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      inactive
                        ? 'bg-foreground/[0.02] border-foreground/10 opacity-60'
                        : 'bg-foreground/[0.04] border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                      <Key size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {k.name || k.label || k.id}
                        </span>
                        {revoked && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">
                            REVOKED
                          </span>
                        )}
                        {expired && !revoked && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50 border border-foreground/20">
                            EXPIRED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-foreground/50 font-mono truncate">
                        {k.id}
                      </div>
                      <div className="text-[11px] text-foreground/40 mt-0.5">
                        Created {formatDate(k.created_at)} · Expires {formatDate(k.expires_at)}
                      </div>
                    </div>
                    {!inactive && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(k.id)}
                        title="Revoke"
                        className="h-8 px-3 rounded-lg flex items-center gap-1.5 bg-foreground/5 hover:bg-destructive/15 border border-foreground/10 hover:border-destructive/30 text-foreground/60 hover:text-destructive text-xs font-medium transition-all"
                      >
                        <Trash2 size={13} />
                        Revoke
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}
