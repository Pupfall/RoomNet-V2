import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

interface SignupState {
  email: string
  password: string
  confirmPassword: string
}

interface AuthError {
  message: string
  status: 'error' | 'success' | 'info'
}

export default function Signup() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState<SignupState>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const [showResend, setShowResend] = useState(false)

  const validateForm = (): boolean => {
    if (!formState.email || !formState.password || !formState.confirmPassword) {
      setAuthError({
        message: 'Please fill in all fields',
        status: 'error',
      })
      return false
    }

    if (formState.password !== formState.confirmPassword) {
      setAuthError({
        message: 'Passwords do not match',
        status: 'error',
      })
      return false
    }

    if (formState.password.length < 8) {
      setAuthError({
        message: 'Password must be at least 8 characters long',
        status: 'error',
      })
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setAuthError(null)

    try {
      // First, check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formState.email)
        .single()

      if (existingUser) {
        setShowResend(true)
        setAuthError({
          message: 'An account with this email already exists. Need a new verification link?',
          status: 'info',
        })
        setIsLoading(false)
        return
      }

      // Clear any existing sessions
      await supabase.auth.signOut()

      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setAuthError({
        message: 'Please check your email for the verification link. For best results, wait 5-10 seconds before clicking the link.',
        status: 'success',
      })

      // Store signup timestamp for verification link expiry handling
      localStorage.setItem('signupTimestamp', Date.now().toString())
      localStorage.setItem('signupEmail', formState.email)

    } catch (error) {
      setAuthError({
        message: error.message || 'An error occurred during signup',
        status: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formState.email,
      })

      if (error) throw error

      setAuthError({
        message: 'New verification link sent! Please check your email.',
        status: 'success',
      })
    } catch (error) {
      setAuthError({
        message: error.message || 'Failed to resend verification link',
        status: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={formState.confirmPassword}
                  onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {authError && (
              <div
                className={`rounded-md p-4 ${
                  authError.status === 'error'
                    ? 'bg-red-50 text-red-700'
                    : authError.status === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <p className="text-sm">{authError.message}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          {showResend && (
            <div className="mt-6">
              <button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-100 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Resend verification link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 