import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { SignupFormData } from '@/models/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'

interface SignupFormProps {
  register: UseFormRegister<SignupFormData>
  errors: FieldErrors<SignupFormData>
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const SignupForm: React.FC<SignupFormProps> = ({
  register,
  errors,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Name Field */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User size={16} className="text-primary" />
          Full Name
        </label>
        <Input
          {...register('name')}
          type="text"
          placeholder="John Doe"
          className="h-11"
        />
        {errors.name && (
          <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Mail size={16} className="text-primary" />
          Email Address
        </label>
        <Input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="h-11"
        />
        {errors.email && (
          <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lock size={16} className="text-primary" />
          Password
        </label>
        <Input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className="h-11"
        />
        {errors.password && (
          <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lock size={16} className="text-primary" />
          Confirm Password
        </label>
        <Input
          {...register('confirmPassword')}
          type="password"
          placeholder="••••••••"
          className="h-11"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-6 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Sign Up</span>
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  )
}

