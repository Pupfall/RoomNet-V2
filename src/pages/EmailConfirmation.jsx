import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function EmailConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState(null)

  if (!email) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-6">This page cannot be accessed directly.</p>
          <button
            onClick={() => navigate('/register')}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Return to registration
          </button>
        </div>
      </div>
    )
  }

  const handleResendEmail = async () => {
    try {
      setResendLoading(true)
      setError(null)
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (resendError) throw resendError

      setResendSuccess(true)
    } catch (err) {
      console.error('Error resending confirmation:', err)
      setError('Failed to resend confirmation email. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
          <div className="text-gray-600">
            <p className="mb-2">We've sent a confirmation email to:</p>
            <p className="font-medium text-gray-800">{email}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Click the link in the email to verify your account. If you don't see the email, check your spam folder.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">Confirmation email has been resent!</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">Didn't receive the email?</p>
          <button
            onClick={handleResendEmail}
            disabled={resendLoading || resendSuccess}
            className="text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Sending...' : 'Resend confirmation email'}
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-800"
          >
            Return to login
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmation 