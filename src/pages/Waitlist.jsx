import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Submitting email:', email.toLowerCase());
      
      // Insert new email directly (we'll handle duplicates via unique constraint)
      const { data, error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email: email.toLowerCase() }])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        
        // Check if it's a unique violation error
        if (insertError.code === '23505') {
          setError('This email is already on the waitlist!');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      console.log('Success! Data:', data);

      // Navigate to success page
      navigate('/success', { 
        state: { email: email.toLowerCase() }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 auth-gradient">
      <div className="max-w-xl w-full text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 py-24 md:p-16 md:py-32">
        <h1 className="text-6xl font-bold mb-12 text-primary-500">Roomnet</h1>
        
        <p className="text-xl mb-24 text-gray-700 mx-auto">
          Finding the perfect roommate or landlord has never been easier. Connect,
          chat, and coordinate your living situation all in one place.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mb-24">
          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setError('');
                setEmail(e.target.value);
              }}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {error && (
              <p className="text-red-500 text-sm text-left">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </div>
        </form>

        <div className="text-sm text-gray-600">
          <p>Be the first to experience Roomnet when we launch.</p>
        </div>
      </div>
    </div>
  );
};

export default Waitlist; 