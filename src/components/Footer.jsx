import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-secondary-900 text-gray-400 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <h2 className="text-white text-xl font-bold mb-4">RoomNet</h2>
            <p className="text-gray-400 mb-4">
              AI-powered roommate matching for better campus living experiences.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* For Universities Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Universities</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/integration" className="hover:text-white transition-colors">
                  Integration Guide
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/request-demo" className="hover:text-white transition-colors">
                  Request Demo
                </Link>
              </li>
              <li>
                <Link to="/partnership" className="hover:text-white transition-colors">
                  Partnership Inquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>© 2025 RoomNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 