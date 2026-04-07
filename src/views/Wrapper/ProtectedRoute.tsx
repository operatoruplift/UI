import React from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// DEMO MODE: auth gate is bypassed. The production auth flow (authStore
// + Supabase, spinner loading state, redirect-to-/login on unauthenticated)
// is intentionally disabled so the Colosseum Demo Day build can reach the
// chat view without a Supabase session. Restore this file from git to
// re-enable gating.
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>
}
