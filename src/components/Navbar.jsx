import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b border-gray-100">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-500">
            RoomNet
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-secondary-600 hover:text-secondary-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/take-quiz" className="text-secondary-600 hover:text-primary-500 transition-colors duration-200">
              Take Quiz
            </Link>
            <Link to="/features" className="text-secondary-600 hover:text-primary-500 transition-colors duration-200">
              Features
            </Link>
            <Link to="/how-it-works" className="text-secondary-600 hover:text-primary-500 transition-colors duration-200">
              How It Works
            </Link>
            <Link to="/faq" className="text-secondary-600 hover:text-primary-500 transition-colors duration-200">
              FAQ
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline">
              Register
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <div className="flex flex-col space-y-4">
            <Link 
              to="/take-quiz" 
              className="text-secondary-600 hover:text-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Take Quiz
            </Link>
            <Link 
              to="/features" 
              className="text-secondary-600 hover:text-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-secondary-600 hover:text-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/faq" 
              className="text-secondary-600 hover:text-primary-500 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Link 
                to="/login" 
                className="btn btn-outline w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-outline w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 