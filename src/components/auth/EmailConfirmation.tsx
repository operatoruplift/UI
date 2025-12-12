import React from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'

interface EmailConfirmationProps {
  email: string
  onBack: () => void
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email,
  onBack,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mb-4">
            <h1 className="text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Uplift</h1>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="w-12 h-12 text-primary" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Check your email</h2>
              <p className="text-foreground/70">
                We've sent a confirmation link to
              </p>
              <p className="text-primary font-medium">{email}</p>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 w-full">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-foreground/80">
                  <p className="font-medium mb-1">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-foreground/70">
                    <li>Check your inbox (and spam folder)</li>
                    <li>Click the confirmation link</li>
                    <li>Return here to sign in</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="mt-6 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

