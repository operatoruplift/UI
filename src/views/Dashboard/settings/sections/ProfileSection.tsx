import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Mail, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export const ProfileSection: React.FC = () => {
  const { user, updateProfile, updatePassword, isLoading } = useAuthStore()
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  // Update form when user changes
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, resetProfile])

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setProfileError(null)
      setProfileSuccess(false)
      
      await updateProfile(data.name, data.email)
      
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (error: any) {
      console.error('Profile update failed:', error)
      setProfileError(error?.message || 'Failed to update profile. Please try again.')
      setProfileSuccess(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setPasswordError(null)
      setPasswordSuccess(false)

      // Verify current password by attempting to sign in
      const { supabase } = await import('@/lib/supabase')
      
      if (!user?.email) {
        throw new Error('User email not found')
      }

      // Verify current password by attempting to sign in
      // Note: This will temporarily sign in the user, but we'll update the password right after
      const { withTimeout } = await import('@/lib/timeout');
      const signInResult = await withTimeout(
        (supabase.auth as any).signInWithPassword({
          email: user.email,
          password: data.currentPassword,
        }),
        15000, // 15 second timeout
        'Password verification timed out'
      ) as { error?: any; data?: any };

      if (signInResult?.error) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      await updatePassword(data.newPassword)
      
      setPasswordSuccess(true)
      resetPassword()
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error: any) {
      console.error('Password update failed:', error)
      setPasswordError(error?.message || 'Failed to update password. Please try again.')
      setPasswordSuccess(false)
    }
  }

  return (
    <div className="space-y-8 mx-auto flex flex-col justify-center h-full max-w-2xl">
      {/* Profile Information Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Profile Information</h3>
          <p className="text-sm text-foreground/60">Update your account information</p>
        </div>

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide flex items-center gap-2">
                <UserIcon size={14} />
                Full Name
              </label>
              <Input
                {...registerProfile('name')}
                type="text"
                placeholder="John Doe"
                className="w-full"
              />
              {profileErrors.name && (
                <p className="text-xs text-destructive font-medium">{profileErrors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide flex items-center gap-2">
                <Mail size={14} />
                Email
              </label>
              <Input
                {...registerProfile('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full"
              />
              {profileErrors.email && (
                <p className="text-xs text-destructive font-medium">{profileErrors.email.message}</p>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {profileSuccess && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <p className="text-sm text-primary font-medium">Profile updated successfully!</p>
            </div>
          )}

          {profileError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive font-medium">{profileError}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => resetProfile({ name: user?.name || '', email: user?.email || '' })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Divider */}
      <div className="border-t border-foreground/10"></div>

      {/* Password Change Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Change Password</h3>
          <p className="text-sm text-foreground/60">Update your password to keep your account secure</p>
        </div>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide flex items-center gap-2">
              <Lock size={14} />
              Current Password
            </label>
            <Input
              {...registerPassword('currentPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full"
            />
            {passwordErrors.currentPassword && (
              <p className="text-xs text-destructive font-medium">{passwordErrors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide flex items-center gap-2">
                <Lock size={14} />
                New Password
              </label>
              <Input
                {...registerPassword('newPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full"
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-destructive font-medium">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide flex items-center gap-2">
                <Lock size={14} />
                Confirm Password
              </label>
              <Input
                {...registerPassword('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-destructive font-medium">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {passwordSuccess && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <p className="text-sm text-primary font-medium">Password updated successfully!</p>
            </div>
          )}

          {passwordError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive font-medium">{passwordError}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => resetPassword()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
