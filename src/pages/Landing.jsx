import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'

function Landing() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Get current session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setLoading(false)
      }
    }
    
    getSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  const scrollToFeatures = () => {
    const element = document.getElementById('features')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-grow flex items-center justify-center py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-gray-800">Find Your Perfect</span>
                  <br />
                  <span className="text-primary-500">Roommate Match</span>
                  {' '}
                  <span className="text-gray-800">with AI</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Our AI-powered matching system helps college students find
                  compatible roommates based on personality, habits, and lifestyle
                  preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {!loading && (
                    session ? (
                      // Show these buttons when logged in
                      <>
                        <button
                          onClick={() => navigate('/quiz')}
                          className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => navigate('/matches')}
                          className="px-8 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center"
                        >
                          View Matches
                        </button>
                      </>
                    ) : (
                      // Show these buttons when logged out
                      <>
                        <button
                          onClick={() => navigate('/register')}
                          className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center"
                        >
                          Sign Up
                        </button>
                        <button
                          onClick={() => navigate('/login')}
                          className="px-8 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center"
                        >
                          Log In
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/roommates-illustration.svg" 
                  alt="Roommates finding each other" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features preview section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose RoomNet?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform offers unique features designed specifically for university
                housing needs.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
              <button 
                onClick={scrollToFeatures} 
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Learn more about our features →
              </button>
            </div>
          </div>
        </section>

        {/* Features Section with ID for scrolling */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover what makes RoomNet the perfect solution for finding your ideal roommate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Matching</h3>
                <p className="text-gray-600">Advanced algorithm that analyzes your preferences and habits to find compatible roommates.</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Matching</h3>
                <p className="text-gray-600">All your data is protected, and you control who you connect with.</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personality Quiz</h3>
                <p className="text-gray-600">Take our research-based assessment to find roommates with compatible lifestyles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Finding your perfect roommate is simple with our three-step process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-500">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Account</h3>
                <p className="text-gray-600">Sign up and create your profile with basic information.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-500">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Take the Quiz</h3>
                <p className="text-gray-600">Complete our personality and preference assessment.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-500">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Matches</h3>
                <p className="text-gray-600">Review your AI-generated roommate matches and connect.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our roommate matching service.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="mb-6 p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How does the matching algorithm work?</h3>
                <p className="text-gray-600">Our AI analyzes over 20 compatibility factors from your quiz responses to find roommates with similar habits, preferences, and lifestyles.</p>
              </div>

              <div className="mb-6 p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Is the service only for students?</h3>
                <p className="text-gray-600">Yes, currently RoomNet is designed specifically for university students looking for roommates on campus or in nearby housing.</p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How secure is my personal information?</h3>
                <p className="text-gray-600">We take privacy seriously. Your personal data is encrypted and secure, and we never share your information with third parties without consent.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Landing 