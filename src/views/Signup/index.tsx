import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { SignupSchema, type SignupFormData } from '@/models/auth'
import { useAuthStore } from '@/store/authStore'
import { SignupHeader } from './SignupHeader'
import { SignupForm } from './SignupForm'
import { SignupDivider } from './SignupDivider'
import { SignupLoginLink } from './SignupLoginLink'
import { SignupFooter } from './SignupFooter'
import { EmailConfirmation } from '@/components/auth/EmailConfirmation'

export const Signup: React.FC = () => {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuthStore()
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null)
      const result = await signup(data.email, data.password, data.name)
      
      if (result.requiresConfirmation) {
        // Email confirmation required - show success message
        setConfirmationEmail(data.email)
        reset() // Clear the form
      } else {
        // User is logged in immediately, navigate to chat
        navigate('/chat')
      }
    } catch (error: any) {
      console.error('Signup failed:', error)
      setError(error?.message || 'Signup failed. Please try again.')
      setConfirmationEmail(null)
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
        <SignupHeader />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="space-y-6">
          <SignupForm
            register={register}
            errors={errors}
            isLoading={isLoading}
            onSubmit={handleSubmit(onSubmit)}
          />

          <SignupDivider />

          <SignupLoginLink />
        </div>

        <SignupFooter />
      </div>
    </div>
  )
}

