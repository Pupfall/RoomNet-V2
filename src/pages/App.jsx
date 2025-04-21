import { Routes, Route, Navigate } from 'react-router-dom'
import Waitlist from './Waitlist'
import Success from './Success'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Waitlist />} />
          <Route path="/success" element={<Success />} />
          {/* Redirect all other routes to waitlist */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App 