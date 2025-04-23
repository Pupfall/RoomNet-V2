import { Link } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'

function Home() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "How does the AI matching algorithm work?",
      answer: "Our AI algorithm analyzes multiple factors including personality traits, lifestyle habits, study preferences, and social patterns to find compatible matches. It uses advanced machine learning to identify patterns and predict successful roommate pairings."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security seriously. All personal information is encrypted, stored securely, and never shared with third parties. We comply with all relevant data protection regulations and industry best practices."
    },
    {
      question: "How much does RoomNet cost for students?",
      answer: "RoomNet is typically provided as a free service to students through their university's housing department. Contact your university's housing office to learn more about availability."
    },
    {
      question: "Can I use RoomNet for off-campus housing?",
      answer: "Yes, RoomNet can be used for both on-campus and off-campus housing arrangements, depending on your university's implementation."
    },
    {
      question: "What if I'm not satisfied with my matches?",
      answer: "You can retake the quiz or adjust your preferences at any time to get new matches. Our support team is also available to help you find the right roommate match."
    },
    {
      question: "How do universities implement RoomNet?",
      answer: "Universities partner with us to integrate RoomNet into their housing assignment process. We work closely with housing departments to customize the platform to their specific needs and requirements."
    }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section id="hero" className="py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                Find Your Perfect
                <br />
                <span className="text-primary-500">Roommate Match</span>
                {' '}with AI
              </h1>
              <p className="text-lg text-secondary-600 mb-8">
                Our AI-powered matching system helps college students find
                compatible roommates based on personality, habits, and lifestyle
                preferences.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/take-quiz" className="btn btn-outline">
                  Take The Quiz
                </Link>
                <Link to="#how-it-works" className="btn btn-outline">
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose RoomNet?</h2>
              <p className="text-secondary-600">
                Our platform offers unique features designed specifically for university
                housing needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">AI-Powered Matching</h3>
                <p className="text-secondary-600">
                  Our sophisticated algorithm analyzes 20+ compatibility factors to find your ideal roommate match.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Personality Assessment</h3>
                <p className="text-secondary-600">
                  Take our research-backed quiz to identify your living preferences, habits, and personality traits.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Video Interviews</h3>
                <p className="text-secondary-600">
                  Connect with potential matches through our integrated video platform before making decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How RoomNet Works</h2>
              <p className="text-secondary-600">
                Our simple 4-step process helps you find your ideal roommate match
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete the Personality Quiz</h3>
                  <p className="text-secondary-600">
                    Answer questions about your living habits, schedule preferences, study environment, and social tendencies to create your matching profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Finds Your Matches</h3>
                  <p className="text-secondary-600">
                    Our advanced algorithm analyzes your responses and compares them with other students to identify your most compatible potential roommates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Video Interviews</h3>
                  <p className="text-secondary-600">
                    Connect with your top matches through our secure video platform to get to know each other better before making your decision.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Confirm Your Match</h3>
                  <p className="text-secondary-600">
                    When you've found the right match, both parties confirm, and your university housing department receives the match information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-secondary-600">
                Get answers to common questions about RoomNet
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-secondary-800">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <p className="text-secondary-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="take-quiz" className="py-20 bg-primary-500 text-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Ready to Find Your Perfect Roommate?</h2>
              <p className="text-lg mb-8">
                Join thousands of students who've found their ideal living partners through
                RoomNet. Start your journey to better campus living today!
              </p>
              <Link to="/take-quiz" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-500 transition-all duration-300 hover:scale-105">
                Take the Quiz
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home 