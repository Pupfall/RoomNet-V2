import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        
        if (session?.user) {
          // Get user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, profile_image_url')
            .eq('id', session.user.id)
            .single()
            
          setUserProfile(profileData)
        }
        
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
      
      if (!session) {
        setUserProfile(null)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUserProfile(null)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="py-4 px-4 bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-500">RoomNet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary-500">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-primary-500">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-600 hover:text-primary-500">FAQ</button>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {userProfile && (
                  <div className="flex items-center space-x-2">
                    {userProfile.profile_image_url ? (
                      <img 
                        src={userProfile.profile_image_url} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://via.placeholder.com/32?text=User'
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">
                      {userProfile.full_name || 'User'}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavigation('/quiz')}
                    className="px-3 py-1 text-primary-500 hover:text-primary-600 border border-primary-500 rounded"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-red-500 hover:text-red-600 border border-red-500 rounded"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => handleNavigation('/login')} 
                  className="px-4 py-2 text-primary-500 hover:text-primary-600"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNavigation('/register')} 
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('features')} 
              className="block text-gray-600 hover:text-primary-500"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block text-gray-600 hover:text-primary-500"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="block text-gray-600 hover:text-primary-500"
            >
              FAQ
            </button>
            <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-2">
              {session ? (
                <>
                  {userProfile && (
                    <div className="flex items-center space-x-2 py-2">
                      {userProfile.profile_image_url ? (
                        <img 
                          src={userProfile.profile_image_url} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/32?text=User'
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {userProfile.full_name ? userProfile.full_name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-700 font-medium">
                        {userProfile.full_name || 'User'}
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={() => handleNavigation('/quiz')} 
                    className="block py-2 text-primary-500 hover:text-primary-600"
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="block py-2 text-red-500 hover:text-red-600"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavigation('/login')} 
                    className="block py-2 text-primary-500 hover:text-primary-600"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => handleNavigation('/register')} 
                    className="block py-2 bg-primary-500 text-white rounded-md text-center hover:bg-primary-600"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 