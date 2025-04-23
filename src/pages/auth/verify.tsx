import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function VerifyEmail() {
  const location = useLocation()
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState(location.state?.message || 'Please check your email to verify your account.')
  const email = location.state?.email || localStorage.getItem('signupEmail')

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('No email found. Please try signing up again.')
      return
    }

    setIsResending(true)
    setMessage('Sending new verification link...')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      setMessage('New verification link sent! Please check your email.')
    } catch (error) {
      setMessage(error.message || 'Failed to resend verification link')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Verify your email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {message}
              </p>

              {email && (
                <p className="text-xs text-gray-500 mb-6">
                  Verification email sent to: {email}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>

              <Link
                to="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to login
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Didn't receive the email? Check your spam folder or try resending.</p>
              <p className="mt-1">For best results, wait 5-10 seconds before clicking the verification link.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 