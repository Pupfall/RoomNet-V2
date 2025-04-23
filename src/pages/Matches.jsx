import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// Development mode toggle - set to true to bypass authentication
const DEVELOPMENT_MODE = false;

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        
        // In development mode, skip authentication check
        if (!DEVELOPMENT_MODE) {
          // Get current user
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          
          if (userError) {
            throw userError
          }

          if (!user) {
            throw new Error('No user logged in')
          }
        }

        // In a real application, you would fetch actual matches here
        // For now, we'll use mock data
        const mockMatches = [
          {
            id: 1,
            name: 'Alex Johnson',
            university: 'University of New Hampshire',
            matchPercentage: 95,
            sleepHabits: 'Night Owl',
            cleanliness: 'Very Clean',
            interests: ['Basketball', 'Gaming', 'Reading'],
            imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          {
            id: 2,
            name: 'Sam Taylor',
            university: 'University of New Hampshire',
            matchPercentage: 89,
            sleepHabits: 'Early Bird',
            cleanliness: 'Moderately Clean',
            interests: ['Hiking', 'Cooking', 'Music'],
            imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            id: 3,
            name: 'Jordan Smith',
            university: 'University of New Hampshire',
            matchPercentage: 84,
            sleepHabits: 'Average',
            cleanliness: 'Moderately Clean',
            interests: ['Swimming', 'Photography', 'Movies'],
            imageUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
          }
        ]
        
        // Simulate API delay
        setTimeout(() => {
          setMatches(mockMatches)
          setLoading(false)
        }, 1000)
        
      } catch (error) {
        console.error('Error fetching matches:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Matches</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Roommate Matches</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <div key={match.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src={match.imageUrl} 
                  alt={match.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white text-sm font-bold rounded-full px-3 py-1">
                  {match.matchPercentage}% Match
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{match.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{match.university}</p>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 text-sm w-24">Sleep Habits:</span>
                    <span className="text-gray-800 text-sm">{match.sleepHabits}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm w-24">Cleanliness:</span>
                    <span className="text-gray-800 text-sm">{match.cleanliness}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm mb-2">Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {match.interests.map((interest, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-6 w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Matches Found</h2>
            <p className="text-gray-600">We couldn't find any roommate matches for you at this time. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
} 