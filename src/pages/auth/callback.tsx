import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState('Signing you in...')

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Check for error parameters in URL
        const errorType = searchParams.get('error')
        const errorCode = searchParams.get('error_code')
        
        if (errorType || errorCode) {
          // If it's an expired link and we have the email stored, attempt auto-resend
          if (errorCode === 'otp_expired' && localStorage.getItem('signupEmail')) {
            await handleExpiredLink()
            return
          }
          
          // Otherwise, redirect to error page with parameters
          const params = new URLSearchParams(searchParams)
          navigate(`/auth/error?${params.toString()}`)
          return
        }

        // Try to get session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error retrieving session:', error.message)
          navigate('/auth/error', {
            state: { error: error.message }
          })
        } else if (data.session) {
          // Clear signup data from localStorage
          localStorage.removeItem('signupTimestamp')
          localStorage.removeItem('signupEmail')
          
          // Successful login
          navigate('/dashboard')
        } else {
          console.warn('No session found.')
          navigate('/auth/error', {
            state: { error: 'No session found' }
          })
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        navigate('/auth/error', {
          state: { error: 'An unexpected error occurred' }
        })
      }
    }

    const handleExpiredLink = async () => {
      const email = localStorage.getItem('signupEmail')
      if (!email) return

      setMessage('Verification link expired. Requesting a new one...')
      setIsResending(true)

      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        })

        if (error) throw error

        setMessage('New verification link sent! Please check your email.')
        // Wait 3 seconds before redirecting
        await new Promise(resolve => setTimeout(resolve, 3000))
        navigate('/auth/verify', {
          state: { 
            message: 'A new verification link has been sent to your email.',
            email 
          }
        })
      } catch (error) {
        console.error('Error resending verification:', error)
        navigate('/auth/error', {
          state: { error: 'Failed to resend verification link' }
        })
      }
    }

    handleAuthRedirect()
  }, [navigate, searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-lg text-gray-600">{message}</p>
        {isResending && (
          <p className="text-sm text-gray-500">
            This will only take a moment...
          </p>
        )}
      </div>
    </div>
  )
} 