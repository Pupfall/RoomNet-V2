import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import EmailConfirmation from './EmailConfirmation'
import VerifyEmail from './VerifyEmail'
import Quiz from './Quiz'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App 