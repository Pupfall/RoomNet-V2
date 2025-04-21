import { Link, useLocation, Navigate } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const email = location.state?.email;

  // If someone tries to access success page directly, redirect to waitlist
  if (!email) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 auth-gradient">
      <div className="max-w-xl w-full text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 py-24 md:p-16 md:py-32">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-12 text-primary-500">Thank You!</h1>
        
        <p className="text-xl mb-24 text-gray-700 mx-auto">
          You've been added to our waitlist. We'll notify <span className="font-medium">{email}</span> as soon as Roomnet launches.
        </p>

        <div className="text-sm text-gray-600 mb-24">
          <p>Keep an eye on your inbox for updates!</p>
        </div>

        <Link
          to="/"
          className="inline-block w-full px-6 py-3 text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success; 