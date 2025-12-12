import React, { useEffect, useRef } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Login } from '@/views/Login'
import { Signup } from '@/views/Signup'
import { Dashboard } from '@/views/Dashboard'
import { ProtectedRoute } from '@/views/Wrapper/ProtectedRoute'
import { WindowNavbar } from '@/views/Wrapper/WindowNavbar'
import { links } from './config/static'
import { useAuthStore, withAuth } from '@/store/authStore'
import { connectRelay, disconnectRelay, relayService } from '@/services/dashboard/execute/relayService'
import { getOrCreateDeviceId } from '@/services/dashboard/devices/deviceService'
import { ToastProvider } from '@/components/ui/toast'

// Redirects authenticated users away from login/signup pages
const AuthRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  useEffect(() => {
    if (!isLoading && isAuthenticated && ['/login', '/signup', '/'].includes(location.pathname)) {
      navigate('/chat', { replace: true })
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate])

  return null
}

// Component to handle voice chat navigation from shortcut
const VoiceChatNavigator = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (window.electronAPI?.onNavigateToVoiceChat) {
      const cleanup = window.electronAPI.onNavigateToVoiceChat(() => {
        navigate('/voicechat')
      })
      return cleanup
    }
  }, [navigate])
  
  return null
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    const init = async () => {
      await initializeAuth()
    }
    init()
  }, [initializeAuth])

  // Relay connection
  const relayConnectionRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const handleRelay = async () => {
      if (isAuthenticated) {
        try {
          const token = await withAuth(async (_, token) => token)
          if (token && isMounted) {
            await connectRelay(getOrCreateDeviceId(), token)
            relayConnectionRef.current = true
            console.log('Relay connected')
          }
        } catch (err) {
          console.error('Failed to connect relay:', err)
        }
      } else if (relayConnectionRef.current) {
        disconnectRelay()
        relayConnectionRef.current = false
        console.log('Disconnecting relay')
      }
    }

    handleRelay()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  return (
    <ToastProvider>
      <div className='bg-background overflow-clip h-screen flex flex-col relative'>
        <WindowNavbar />
        <div className="flex-1 overflow-hidden">
          <Router>
            <AuthRedirect />
            <VoiceChatNavigator />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Agent detail route */}
              <Route path="/store/:id" element={<ProtectedRoute><Dashboard id="/store" /></ProtectedRoute>} />

              {/* Store route */}
              <Route path="/store" element={<ProtectedRoute><Dashboard id="/store" /></ProtectedRoute>} />

              {/* Dynamic links */}
              {links.map((link) => (
                <Route key={link.href} path={link.href} element={<ProtectedRoute><Dashboard id={link.href} /></ProtectedRoute>} />
              ))}

              {/* Voice chat route */}
              <Route path="/voicechat" element={<ProtectedRoute><Dashboard id="/voicechat" /></ProtectedRoute>} />

              {/* Redirect root */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </div>
      </div>
    </ToastProvider>
  )
}

export default App
