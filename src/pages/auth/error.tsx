import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthError() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const errorType = searchParams.get('type')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')

  const getErrorMessage = () => {
    if (errorCode === 'otp_expired') {
      return 'The verification link has expired. Please enter your email below to request a new verification link.'
    }
    if (errorType === 'access_denied') {
      return 'Access was denied. This could be because the link is invalid or has already been used.'
    }
    return errorDescription || 'An error occurred during authentication.'
  }

  const handleResendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      setMessage('A new verification link has been sent to your email.')
      setEmail('')
    } catch (error) {
      setMessage(error.message || 'Failed to send verification link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Email Link Expired</h2>
          <p className="mt-2 text-sm text-gray-600">{getErrorMessage()}</p>
        </div>

        {errorCode === 'otp_expired' && (
          <form onSubmit={handleResendLink} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${message.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend Verification Link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/"
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
} 