import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// Development mode toggle - set to true to bypass authentication
const DEVELOPMENT_MODE = false;

const matchingSteps = [
  {
    id: 1,
    title: "Analyzing Your Profile",
    description: "We're processing your preferences and lifestyle choices..."
  },
  {
    id: 2,
    title: "Finding Compatible Roommates",
    description: "Searching for students with similar habits and interests..."
  },
  {
    id: 3,
    title: "Calculating Best Matches",
    description: "Using AI to determine your most compatible roommates..."
  },
  {
    id: 4,
    title: "Finalizing Results",
    description: "Preparing your personalized roommate suggestions..."
  }
]

export default function MatchingProcess() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    let timer
    const startMatching = async () => {
      try {
        // Simulate progress through steps
        for (let i = 0; i < matchingSteps.length; i++) {
          timer = setTimeout(() => {
            setCurrentStep(i)
          }, i * 2000) // Each step takes 2 seconds
        }

        // After all steps, wait 1 second before navigating to matches
        setTimeout(() => {
          if (DEVELOPMENT_MODE) {
            console.log('Development mode: Navigating to matches page');
            navigate('/matches', { replace: true });
            return;
          }
          
          const checkUserAndNavigate = async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser()
              
              if (!user) {
                throw new Error('No user logged in')
              }
              
              console.log('User authenticated, navigating to matches page')
              navigate('/matches', { replace: true })
            } catch (error) {
              console.error('Error checking user:', error)
              setError(error.message)
            }
          }
          
          checkUserAndNavigate()
        }, matchingSteps.length * 2000 + 1000)

      } catch (error) {
        console.error('Error in matching process:', error)
        setError(error.message)
      }
    }

    startMatching()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/quiz')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Finding Your Perfect Roommate</h2>
          <p className="text-gray-600">Our AI is working to find your best matches...</p>
        </div>

        <div className="space-y-8">
          {matchingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index === currentStep ? 'opacity-100' : 'opacity-40'}`}
            >
              <div className="relative">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${index === currentStep ? 'bg-primary-600 animate-pulse' : 
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200'}
                `}>
                  {index < currentStep ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium text-white">{step.id}</span>
                  )}
                </div>
                {index < matchingSteps.length - 1 && (
                  <div className={`
                    absolute top-8 left-1/2 w-0.5 h-12 transform -translate-x-1/2
                    ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
                {index === currentStep && (
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          This may take a few moments. Please don't close this page.
        </div>
      </div>
    </div>
  )
} 