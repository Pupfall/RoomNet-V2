import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After processing is complete, navigate to the matching process
    const timeout = setTimeout(() => {
      navigate('/matching');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-8 p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Processing Your Profile
        </h1>
        
        {/* Loading Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-full h-full border-8 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600">Analyzing your preferences...</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-100"></div>
            <p className="text-gray-600">Creating your profile...</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-200"></div>
            <p className="text-gray-600">Finding potential matches...</p>
          </div>
        </div>

        <p className="text-gray-500 mt-8">
          We're setting up your perfect roommate matching experience. This will only take a moment.
        </p>
      </div>
    </div>
  );
};

export default LoadingPage; 