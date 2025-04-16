import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const Thermostat = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const minTemp = 60 // 60°F
  const maxTemp = 80 // 80°F
  const radius = 120
  
  // Convert temperature to angle (0° at 3 o'clock, moving counterclockwise)
  const tempToDegrees = (temp) => {
    // Map 60°F -> 0° (3 o'clock) and 80°F -> 130° (10 o'clock)
    return ((temp - minTemp) / (maxTemp - minTemp)) * 130
  }

  // Convert angle back to temperature
  const degreesToTemp = (angle) => {
    // Map 0° -> 60°F and 130° -> 80°F
    return Math.round((angle / 130) * (maxTemp - minTemp) + minTemp)
  }

  // Calculate dot position on the arc
  const getDotPosition = (angle) => {
    const angleInRadians = (angle - 90) * (Math.PI / 180)
    return {
      x: radius * Math.cos(angleInRadians),
      y: radius * Math.sin(angleInRadians)
    }
  }

  // Handle mouse/touch movement
  const handleDrag = (event, info) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Get current mouse/touch position
    const currentX = event.clientX || event.touches?.[0].clientX || 0
    const currentY = event.clientY || event.touches?.[0].clientY || 0

    // Calculate angle relative to center
    const deltaX = currentX - centerX
    const deltaY = currentY - centerY
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90

    // Normalize angle to 0-360 range
    angle = ((angle % 360) + 360) % 360

    // Constrain to arc range (0° to 130°)
    if (angle <= 130) {
      const newTemp = degreesToTemp(angle)
      if (newTemp >= minTemp && newTemp <= maxTemp) {
        onChange(newTemp)
      }
    }
  }

  const currentAngle = tempToDegrees(value)
  const dotPosition = getDotPosition(currentAngle)

  return (
    <div ref={containerRef} className="relative w-[300px] h-[300px] mx-auto">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-[#1a365d]">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[#64748b] text-lg font-medium mb-2">
            HEAT TO
          </div>
          <div className="text-white text-6xl font-bold">
            {value}
          </div>
        </div>
      </div>

      {/* Arc gradient */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M 270 150 A 120 120 0 0 0 150 30"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Interactive knob */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className="absolute w-8 h-8 rounded-full cursor-pointer"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(${dotPosition.x}px, ${dotPosition.y}px)`,
          marginLeft: '-16px',
          marginTop: '-16px',
          background: 'radial-gradient(circle at center, white 0%, #e2e8f0 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          touchAction: 'none',
          zIndex: 10
        }}
      />

      {/* Drag area */}
      <div 
        className="absolute inset-0"
        style={{ 
          pointerEvents: isDragging ? 'auto' : 'none',
          cursor: 'grab'
        }}
      />
    </div>
  )
}

export default Thermostat 