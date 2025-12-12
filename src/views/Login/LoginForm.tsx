import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { LoginFormData } from '@/models/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

interface LoginFormProps {
  register: UseFormRegister<LoginFormData>
  errors: FieldErrors<LoginFormData>
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onXLogin: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  register,
  errors,
  isLoading,
  onSubmit,
  onXLogin,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-6  gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight size={16} />
          </>
        )}
      </Button>
      {/* X Login Button */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={onXLogin}
        className="w-full h-11 font-semibold border-foreground/10 hover:bg-foreground/5 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>Continue with X</span>
      </Button>
    </form>
  )
}

