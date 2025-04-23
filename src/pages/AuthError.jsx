import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function AuthError() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [errorType, setErrorType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Parse the query parameters
    const searchParams = new URLSearchParams(location.search)
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDesc = searchParams.get('error_description')

    setErrorType(errorCode || error || 'unknown_error')
    setErrorMessage(errorDesc || 'An error occurred during authentication')
  }, [location])

  // Function to handle resending verification email
  const handleResendVerification = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })

      if (error) throw error

      setLoading(false)
      setSuccess(true)
    } catch (error) {
      console.error('Error resending verification email:', error)
      alert(error.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  // Get the appropriate error display based on error type
  const getErrorDisplay = () => {
    switch (errorType) {
      case 'otp_expired':
      case 'expired_token':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Link Expired</h2>
            <p className="text-gray-600 mb-6">
              The verification link has expired. Please enter your email below to request a new verification link.
            </p>
            
            {success ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <p className="text-green-700 text-center">
                  A new verification link has been sent. Please check your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResendVerification} className="space-y-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Resend Verification Link'}
                </button>
              </form>
            )}
          </div>
        )
      
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
            <p className="text-red-600 mb-6">{errorMessage}</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        {getErrorDisplay()}
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthError 