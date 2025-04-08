import { useState, useRef } from 'react'

function Quiz() {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    university: '',
    year: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const yearOptions = [
    { id: 'freshman', label: 'Freshman' },
    { id: 'sophomore', label: 'Sophomore' },
    { id: 'junior', label: 'Junior' },
    { id: 'senior', label: 'Senior' },
    { id: 'graduate', label: 'Graduate' }
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleYearSelect = (yearId) => {
    setFormData(prev => ({
      ...prev,
      year: yearId
    }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    // TODO: Handle next step
  }

  const handlePrevious = () => {
    // TODO: Handle previous step
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center text-primary-600 mb-2">RoomNet</h1>
      <p className="text-center text-gray-600 mb-8">Help us find your perfect roommate match by completing this quiz.</p>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-primary-600 h-2.5 rounded-full w-1/3"></div>
      </div>
      <div className="text-right text-sm text-gray-500 mb-8">Step 1 of 3</div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        {/* Profile Image Upload */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile Picture</h2>
          <p className="text-gray-600 mb-4">Add a photo to help potential roommates get to know you better.</p>
          
          <div className="flex flex-col items-center">
            <div 
              onClick={handleImageClick}
              className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary-600 transition-colors"
              style={{
                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!imagePreview && (
                <div className="text-center p-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">Click to upload</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <p className="mt-2 text-sm text-gray-500">Click the circle to upload your photo</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Basic Information</h2>
          <p className="text-gray-600 mb-6">Let's start with some basic information about you.</p>

          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              >
                <option value="">Select your age</option>
                {Array.from({ length: 13 }, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                University
              </label>
              <select
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              >
                <option value="">Select your university</option>
                <option value="unh">University of New Hampshire</option>
                {/* Add more universities as needed */}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <div className="flex flex-wrap gap-3">
                {yearOptions.map((yearOption) => (
                  <button
                    key={yearOption.id}
                    type="button"
                    onClick={() => handleYearSelect(yearOption.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-colors
                      ${formData.year === yearOption.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                      }`}
                  >
                    {yearOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Quiz 