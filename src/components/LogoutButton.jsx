import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function LogoutButton() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true)
    
    try {
      // Clear any local storage data first
      localStorage.clear(); // Clear all localStorage instead of individual items
      
      console.log('Local storage cleared');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error.message)
        throw error
      }
      
      console.log('Successfully signed out from Supabase');
      
      // Force reload to clear any in-memory state
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Failed to log out. Please try again.')
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`${isLoggingOut ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white font-medium py-2 px-4 rounded-full shadow-lg flex items-center transition-colors`}
      >
        {!isLoggingOut && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        )}
        {isLoggingOut ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging out...
          </div>
        ) : 'Log out'}
      </button>
    </div>
  )
} 