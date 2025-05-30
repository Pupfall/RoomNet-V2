import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// Pages
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Quiz from './Quiz'
import MatchingProcess from './MatchingProcess'
import LoadingPage from './LoadingPage'
import VerifyEmail from './VerifyEmail'
import EmailConfirmation from './EmailConfirmation'
import Landing from './Landing'
import Matches from './Matches'
import AuthError from './AuthError'

// Components
import LogoutButton from '../components/LogoutButton'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Development mode toggle - set to true to bypass authentication
const DEVELOPMENT_MODE = false;

// Protected Route component
const ProtectedRoute = ({ children, requireComplete = true }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If in development mode, bypass auth checks
    if (DEVELOPMENT_MODE) {
      setLoading(false);
      return;
    }

    // Get session from Supabase auth
    const getSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)

        if (session?.user) {
          // Get user profile to check if quiz is completed
          const { data: profileData } = await supabase
            .from('profiles')
            .select('profile_complete')
            .eq('id', session.user.id)
            .single()

          setProfileComplete(profileData?.profile_complete || false)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setLoading(false)
      }
    }

    getSessionAndProfile()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      
      if (session?.user) {
        // Get user profile to check if quiz is completed
        const { data: profileData } = await supabase
          .from('profiles')
          .select('profile_complete')
          .eq('id', session.user.id)
          .single()

        setProfileComplete(profileData?.profile_complete || false)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  // If in development mode, always render children
  if (DEVELOPMENT_MODE) {
    return children;
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Only redirect to quiz if profile is not complete AND we require a complete profile
  if (requireComplete && !profileComplete && window.location.pathname !== '/quiz') {
    console.log('Redirecting to quiz: Profile not complete and complete profile required');
    return <Navigate to="/quiz" replace />
  }

  return children
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDevBanner, setShowDevBanner] = useState(DEVELOPMENT_MODE)

  // --- BEGIN: Realtime queue for survey completions ---
  const queue = useRef([]);
  const isProcessing = useRef(false);

  const processQueue = async () => {
    if (isProcessing.current || queue.current.length === 0) {
      return;
    }

    isProcessing.current = true;

    while (queue.current.length > 0) {
      const userId = queue.current.shift();
      console.log('Processing user_id from queue:', userId);

      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/handle-survey-completion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ user_id: userId })
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log('Successfully processed:', result);
      } catch (error) {
        console.error('Error processing user:', userId, error);
        // Retry failed user by putting back at the end of queue
        queue.current.push(userId);
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds before retry
      }
    }

    isProcessing.current = false;
  };

  useEffect(() => {
    const channel = supabase
      .channel('survey-completions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'survey_responses'
        },
        (payload) => {
          console.log('Survey response update detected:', payload);

          const newRecord = payload.new;
          const oldRecord = payload.old;

          const userId = newRecord.user_id;
          const completedNow = newRecord.completed_at;
          const wasIncomplete = !oldRecord.completed_at;

          if (userId && completedNow && wasIncomplete) {
            console.log('Survey just completed! Queuing user_id:', userId);
            queue.current.push(userId);
            processQueue();
          } else {
            console.log('Update ignored — survey not newly completed.');
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe();
    };
  }, []);
  // --- END: Realtime queue for survey completions ---

  useEffect(() => {
    // If in development mode, skip auth check
    if (DEVELOPMENT_MODE) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session check:', session ? 'Authenticated' : 'Not authenticated')
        setSession(session)
        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session ? 'Authenticated' : 'Not authenticated')
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showDevBanner && (
        <div className="bg-yellow-500 text-black text-center py-1 text-sm font-bold">
          Development Mode - Authentication Bypassed
        </div>
      )}
      <div className="flex-grow">
        <Routes>
          {/* Public routes - always accessible */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={
            session ? (
              <Navigate to="/quiz" replace />
            ) : (
              <Login />
            )
          } />
          <Route path="/register" element={
            session ? (
              <Navigate to="/quiz" replace />
            ) : (
              <Register />
            )
          } />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/auth/error" element={<AuthError />} />
          
          {/* Protected routes - require authentication but not profile completion */}
          <Route path="/quiz" element={
            <ProtectedRoute requireComplete={false}>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/loading" element={
            <ProtectedRoute requireComplete={false}>
              <LoadingPage />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - require authentication AND profile completion */}
          <Route path="/matching" element={
            <ProtectedRoute requireComplete={true}>
              <MatchingProcess />
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute requireComplete={true}>
              <Matches />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      {/* Logout Button - Only shown when user is logged in */}
      {(session || DEVELOPMENT_MODE) && <LogoutButton />}
    </div>
  )
}

export default App 