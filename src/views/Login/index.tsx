import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { LoginSchema, type LoginFormData } from '@/models/auth'
import { useAuthStore } from '@/store/authStore'
import { LoginHeader } from './LoginHeader'
import { LoginForm } from './LoginForm'
import { LoginDivider } from './LoginDivider'
import { LoginSignupLink } from './LoginSignupLink'
import { LoginFooter } from './LoginFooter'
import { EmailConfirmation } from '@/components/auth/EmailConfirmation'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, loginWithX, isLoading } = useAuthStore()
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      const result = await login(data.email, data.password)
      
      if (result.requiresConfirmation) {
        // Email confirmation required - show confirmation message
        setConfirmationEmail(data.email)
        reset()
      } else {
        // User is logged in, navigate to chat
        navigate('/chat')
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      setError(error?.message || 'Login failed. Please try again.')
      setConfirmationEmail(null)
    }
  }

  const handleXLogin = async () => {
    try {
      await loginWithX()
      navigate('/chat')
    } catch (error) {
      console.error('X login failed:', error)
    }
  }

  // Show confirmation message if email confirmation is required
  if (confirmationEmail) {
    return (
      <EmailConfirmation
        email={confirmationEmail}
        onBack={() => {
          setConfirmationEmail(null)
          reset()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="space-y-6">
          <LoginForm
            register={register}
            errors={errors}
            isLoading={isLoading}
            onSubmit={handleSubmit(onSubmit)}
            onXLogin={handleXLogin}
          />

          <LoginDivider />

          <LoginSignupLink />
        </div>

        <LoginFooter />
      </div>
    </div>
  )
}

