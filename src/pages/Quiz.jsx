import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function Quiz() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('quizStep')
    return savedStep ? parseInt(savedStep) : 1
  })
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem('quizFormData')
    return savedFormData ? JSON.parse(savedFormData) : {
      // Basic Info (Step 1)
    fullName: '',
    age: '',
      university: [],
      year: '',
      countryOfOrigin: '',
      languages: [],
      profileImage: null,
      // Living Preferences (Step 2)
      sleepTime: '',
      wakeTime: '',
      cleanliness: '',
      visitors: '',
      smoking: '',
      // Lifestyle & Activities (Step 3)
      studyHabits: '',
      hobbies: [],
      musicPreference: '',
      additionalInfo: ''
    }
  })
  const [imagePreview, setImagePreview] = useState(() => {
    const savedImagePreview = localStorage.getItem('quizImagePreview')
    return savedImagePreview || null
  })
  const [universitySearch, setUniversitySearch] = useState('')
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [languageSearch, setLanguageSearch] = useState('')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [hobbySearch, setHobbySearch] = useState('')
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false)
  const [showHobbyIdeas, setShowHobbyIdeas] = useState(false)

  const yearOptions = [
    { id: 'freshman', label: 'Freshman' },
    { id: 'sophomore', label: 'Sophomore' },
    { id: 'junior', label: 'Junior' },
    { id: 'senior', label: 'Senior' }
  ]

  const sleepTimeOptions = [
    { id: 'early_bird', label: 'Early Bird', description: 'Before 10 PM' },
    { id: 'average', label: 'Average', description: '10 PM - 12 AM' },
    { id: 'night_owl', label: 'Night Owl', description: 'After 12 AM' }
  ]

  const wakeTimeOptions = [
    { id: 'very_early', label: 'Early Bird', description: 'Before 7 AM' },
    { id: 'average', label: 'Average', description: '7 AM - 9 AM' },
    { id: 'late', label: 'Late Riser', description: 'After 9 AM' }
  ]

  const cleanlinessOptions = [
    { id: 'very_clean', label: 'Very Clean' },
    { id: 'moderately_clean', label: 'Moderately Clean' },
    { id: 'relaxed_cleaning', label: 'Relaxed Cleaning' },
    { id: 'minimal_effort', label: 'Minimal Effort' }
  ]

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12
    const ampm = i < 12 ? 'AM' : 'PM'
    return {
      value: i.toString().padStart(2, '0'),
      label: `${hour}:00 ${ampm}`
    }
  })

  const visitorOptions = [
    { id: 'always_welcome', label: 'Always Welcome', description: 'Open to visitors anytime' },
    { id: 'sometimes_ok', label: 'Sometimes Okay', description: 'With advance notice' },
    { id: 'rarely_preferred', label: 'Rarely Preferred', description: 'Prefer minimal visitors' },
    { id: 'no_visitors', label: 'No Visitors', description: 'Private space only' }
  ]

  const smokingOptions = [
    { id: 'non_smoker_only', label: 'Non-Smoker', description: 'No smoking at all' },
    { id: 'outside_ok', label: 'Outside Only', description: 'Smoking outside okay' },
    { id: 'smoking_ok', label: 'Smoking Friendly', description: 'Okay with smoking' },
    { id: 'smoker', label: 'Smoker', description: 'I smoke regularly' }
  ]

  const studyHabitOptions = [
    { id: 'very_focused', label: 'Very Focused', description: 'Very focused and quiet study environment' },
    { id: 'moderate', label: 'Moderate', description: 'Moderate noise and distractions okay' },
    { id: 'flexible', label: 'Flexible', description: 'Can adapt to different environments' },
    { id: 'social', label: 'Social', description: 'Prefer studying with others/in groups' }
  ]

  const hobbyOptions = [
    // Sports & Fitness
    "Basketball", "Soccer", "Tennis", "Volleyball", "Swimming", "Running", "Hiking", "Rock Climbing",
    "Yoga", "Weight Training", "CrossFit", "Martial Arts", "Cycling", "Skateboarding", "Surfing",
    
    // Arts & Creative
    "Painting", "Drawing", "Photography", "Graphic Design", "Writing", "Poetry", "Sculpture",
    "Ceramics", "Digital Art", "Fashion Design", "Jewelry Making", "Knitting", "Crocheting",
    
    // Music & Performance
    "Playing Guitar", "Playing Piano", "Singing", "Dancing", "DJ-ing", "Music Production",
    "Theater", "Acting", "Musical Theater", "Choir", "Band", "Orchestra",
    
    // Technology & Gaming
    "Video Gaming", "Board Gaming", "Programming", "Web Development", "3D Modeling",
    "Game Development", "Virtual Reality", "Robotics", "Drone Flying",
    
    // Academic & Intellectual
    "Reading", "Creative Writing", "Book Club", "Chess", "Debate", "Language Learning",
    "Philosophy", "Science Experiments", "Mathematics", "History",
    
    // Social & Entertainment
    "Movies", "TV Shows", "Anime", "Manga", "Comic Books", "Social Media",
    "Podcasting", "YouTube Creation", "Streaming", "Cosplay",
    
    // Food & Cooking
    "Cooking", "Baking", "Wine Tasting", "Coffee Brewing", "Food Photography",
    "Meal Prep", "International Cuisine", "BBQ & Grilling", "Vegetarian/Vegan Cooking",
    
    // Outdoors & Nature
    "Camping", "Fishing", "Gardening", "Bird Watching", "Photography",
    "Mountain Biking", "Rock Climbing", "Kayaking", "Stargazing",
    
    // Collection & Crafts
    "Stamp Collecting", "Coin Collecting", "Model Building", "Scrapbooking",
    "Card Collecting", "Action Figures", "Vintage Items", "Antiques",
    
    // Wellness & Lifestyle
    "Meditation", "Mindfulness", "Personal Development", "Volunteering",
    "Environmental Activism", "Animal Care", "Travel Planning", "Fashion"
  ]

  const musicPreferenceOptions = [
    { id: 'always', label: 'Love having music playing' },
    { id: 'sometimes', label: 'Sometimes, at moderate volume' },
    { id: 'quiet', label: 'Prefer quiet environment' }
  ]

  const ageOptions = [
    { id: 'under_18', label: 'Under 18', description: '17 and younger' },
    { id: '18_to_23', label: '18-23', description: 'Traditional college age' },
    { id: 'over_23', label: 'Over 23', description: '24 and older' }
  ]

  const nhUniversities = [
    "University of New Hampshire",
    "Plymouth State University",
    "Keene State College",
    "Dartmouth College",
    "Southern New Hampshire University",
    "New England College",
    "Saint Anselm College",
    "Franklin Pierce University",
    "Rivier University",
    "Colby-Sawyer College",
    "New Hampshire Institute of Art",
    "Granite State College",
    "Manchester Community College",
    "NHTI Concord's Community College",
    "Great Bay Community College",
    "River Valley Community College",
    "Lakes Region Community College",
    "White Mountains Community College",
    "Nashua Community College"
  ]

  const commonLanguages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean",
    "Arabic", "Russian", "Portuguese", "Italian", "Hindi", "Vietnamese", "Thai",
    "Turkish", "Dutch", "Polish", "Greek", "Swedish", "Danish", "Norwegian"
  ]

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "China", "India", 
    "Japan", "South Korea", "Brazil", "Mexico", "France", "Germany", 
    "Italy", "Spain", "Russia", "Saudi Arabia", "Egypt", 
    "South Africa", "Nigeria", "Vietnam", "Thailand", "Malaysia", 
    "Indonesia", "Turkey", "Greece"
  ]

  const filteredUniversities = nhUniversities.filter(uni => 
    uni.toLowerCase().includes(universitySearch.toLowerCase())
  )

  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const filteredLanguages = commonLanguages.filter(lang => 
    lang.toLowerCase().includes(languageSearch.toLowerCase())
  )

  const filteredHobbies = hobbyOptions.filter(hobby => 
    hobby.toLowerCase().includes(hobbySearch.toLowerCase()) &&
    !formData.hobbies.includes(hobby)
  )

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizStep', currentStep)
    localStorage.setItem('quizFormData', JSON.stringify(formData))
    if (imagePreview) {
      localStorage.setItem('quizImagePreview', imagePreview)
    }
  }, [currentStep, formData, imagePreview])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }))
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

  const handleSleepTimeSelect = (timeId) => {
    setFormData(prev => ({
      ...prev,
      sleepTime: timeId
    }))
  }

  const handleWakeTimeSelect = (timeId) => {
    setFormData(prev => ({
      ...prev,
      wakeTime: timeId
    }))
  }

  const handleCleanlinessSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      cleanliness: value
    }))
  }

  const handleHobbyToggle = (hobbyId) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobbyId)
        ? prev.hobbies.filter(id => id !== hobbyId)
        : [...prev.hobbies, hobbyId]
    }))
  }

  const handleVisitorSelect = (visitorId) => {
    setFormData(prev => ({
      ...prev,
      visitors: visitorId
    }))
  }

  const handleSmokingSelect = (smokingId) => {
    setFormData(prev => ({
      ...prev,
      smoking: smokingId
    }))
  }

  const handleAgeSelect = (ageId) => {
    setFormData(prev => ({
      ...prev,
      age: ageId
    }))
  }

  const handleUniversitySelect = (university) => {
    setFormData(prev => ({
      ...prev,
      university: [university]
    }))
    setUniversitySearch('')
    setShowUniversityDropdown(false)
  }

  const handleRemoveUniversity = (universityToRemove) => {
    setFormData(prev => ({
      ...prev,
      university: prev.university.filter(uni => uni !== universityToRemove)
    }))
  }

  const handleCountrySelect = (country) => {
    setFormData(prev => ({
      ...prev,
      countryOfOrigin: country
    }))
    setCountrySearch('')
    setShowCountryDropdown(false)
  }

  const handleRemoveCountry = () => {
    setFormData(prev => ({
      ...prev,
      countryOfOrigin: ''
    }))
  }

  const handleLanguageSelect = (language) => {
    if (!formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }))
    }
    setLanguageSearch('')
    setShowLanguageDropdown(false)
  }

  const handleRemoveLanguage = (languageToRemove) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }))
  }

  const handleNext = (e) => {
    if (e) {
    e.preventDefault()
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submission started')
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Error getting user:', userError)
        throw userError
      }
      
      if (!user) {
        console.error('No user logged in')
        alert('Please log in to submit the quiz')
        return
      }

      console.log('User authenticated:', user.id)

      // Prepare the data for insertion
      const quizData = {
        user_id: user.id,
        // Basic Info
        full_name: formData.fullName,
        age_range: formData.age,
        university: formData.university[0],
        year: formData.year,
        country_of_origin: formData.countryOfOrigin,
        languages: formData.languages,
        // Living Preferences
        sleep_time: formData.sleepTime,
        wake_time: formData.wakeTime,
        cleanliness: formData.cleanliness,
        visitors: formData.visitors,
        smoking: formData.smoking,
        // Lifestyle & Activities
        study_habits: formData.studyHabits,
        hobbies: formData.hobbies,
        music_preference: formData.musicPreference,
        additional_info: formData.additionalInfo,
        created_at: new Date().toISOString()
      }

      console.log('Quiz data prepared:', quizData)

      // Upload profile image if exists
      let profile_image_url = null
      if (formData.profileImage) {
        console.log('Uploading profile image...')
        const fileExt = formData.profileImage.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `profile-images/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('profile-images')
          .upload(filePath, formData.profileImage)

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          throw uploadError
        }

        profile_image_url = data.path
        quizData.profile_image_url = profile_image_url
        console.log('Profile image uploaded:', profile_image_url)
      }

      // Insert the quiz data into the database
      const { error: insertError } = await supabase
        .from('user_profiles')
        .upsert(quizData, { onConflict: 'user_id' })

      if (insertError) {
        console.error('Error inserting quiz data:', insertError)
        throw insertError
      }

      console.log('Quiz data saved successfully')

      // Clear stored data after successful submission
      localStorage.removeItem('quizStep')
      localStorage.removeItem('quizFormData')
      localStorage.removeItem('quizImagePreview')

      console.log('Local storage cleared')

      // Navigate to the matching process page
      console.log('Navigating to matching process page...')
      navigate('/matching-process')

    } catch (error) {
      console.error('Error in form submission:', error)
      alert('There was an error submitting your quiz. Please try again.')
    }
  }

  const handleStudyHabitSelect = (habitId) => {
    setFormData(prev => ({
      ...prev,
      studyHabits: habitId
    }))
  }

  const handleMusicPreferenceSelect = (preferenceId) => {
    setFormData(prev => ({
      ...prev,
      musicPreference: preferenceId
    }))
  }

  const handleHobbySelect = (hobby) => {
    if (!formData.hobbies.includes(hobby)) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobby]
      }))
    }
    setHobbySearch('')
    setShowHobbyDropdown(false)
  }

  const handleRemoveHobby = (hobbyToRemove) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(hobby => hobby !== hobbyToRemove)
    }))
  }

  const renderBasicInfo = () => (
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Age
              </label>
            <div className="flex flex-nowrap gap-4">
              {ageOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleAgeSelect(option.id)}
                  className={`h-14 px-6 rounded-full text-sm font-medium transition-colors flex-1 flex items-center justify-center
                    ${formData.age === option.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                    }`}
                >
                  <span className="font-semibold">{option.label}</span>
                </button>
              ))}
            </div>
            </div>

            <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-3">
                Year
              </label>
            <div className="flex flex-nowrap gap-4">
                {yearOptions.map((yearOption) => (
                  <button
                    key={yearOption.id}
                    type="button"
                    onClick={() => handleYearSelect(yearOption.id)}
                  className={`h-14 px-6 rounded-full text-sm font-medium transition-colors flex-1 flex items-center justify-center
                      ${formData.year === yearOption.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                      }`}
                  >
                  <span className="font-semibold">{yearOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

          <div className="relative">
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-3">
              University
            </label>
            {formData.university.length > 0 ? (
              <div className="flex justify-center gap-4 mb-4">
                <button
                  type="button"
                  className="h-14 px-6 rounded-full text-sm font-medium transition-colors inline-flex items-center justify-center bg-primary-600 text-white"
                >
                  <span className="font-semibold">{formData.university[0]}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUniversity(formData.university[0])}
                    className="ml-3 text-white hover:text-gray-100"
                  >
                    ×
                  </button>
                </button>
              </div>
            ) : null}
            <div className="min-h-[42px] w-full px-4 py-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent bg-white">
              {formData.university.length === 0 && (
                <input
                  type="text"
                  value={universitySearch}
                  onChange={(e) => {
                    setUniversitySearch(e.target.value)
                    setShowUniversityDropdown(true)
                  }}
                  onFocus={() => setShowUniversityDropdown(true)}
                  placeholder="Find your university"
                  className="w-full outline-none text-gray-700"
                />
              )}
            </div>
            {showUniversityDropdown && universitySearch.length > 0 && formData.university.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredUniversities.length > 0 ? (
                  filteredUniversities.map((uni, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleUniversitySelect(uni)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      {uni}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No universities found</div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700 mb-3">
              Country of Origin
            </label>
            {formData.countryOfOrigin ? (
              <div className="flex justify-center gap-4 mb-4">
                <button
                  type="button"
                  className="h-14 px-6 rounded-full text-sm font-medium transition-colors inline-flex items-center justify-center bg-primary-600 text-white"
                >
                  <span className="font-semibold">{formData.countryOfOrigin}</span>
                  <button
                    type="button"
                    onClick={handleRemoveCountry}
                    className="ml-3 text-white hover:text-gray-100"
                  >
                    ×
                  </button>
                </button>
              </div>
            ) : null}
            <div className="min-h-[42px] w-full px-4 py-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent bg-white">
              {!formData.countryOfOrigin && (
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value)
                    setShowCountryDropdown(true)
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  placeholder="Enter your country of origin"
                  className="w-full outline-none text-gray-700"
                />
              )}
            </div>
            {showCountryDropdown && countrySearch.length > 0 && !formData.countryOfOrigin && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      {country}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No countries found</div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-3">
              Languages
            </label>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {formData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="h-14 px-6 rounded-full text-sm font-medium transition-colors inline-flex items-center justify-center bg-primary-600 text-white"
                >
                  <span className="font-semibold">{lang}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(lang)}
                    className="ml-3 text-white hover:text-gray-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="min-h-[42px] w-full px-4 py-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent bg-white">
              <input
                type="text"
                value={languageSearch}
                onChange={(e) => {
                  setLanguageSearch(e.target.value)
                  setShowLanguageDropdown(true)
                }}
                onFocus={() => setShowLanguageDropdown(true)}
                placeholder="Add languages you speak"
                className="w-full outline-none text-gray-700"
              />
            </div>
            {showLanguageDropdown && languageSearch.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLanguageSelect(lang)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      {lang}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No languages found</div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderLivingPreferences = () => (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Living Preferences</h2>
      <p className="text-gray-600 mb-6">Tell us about your living preferences and habits.</p>

      <form onSubmit={handleNext} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What time do you typically go to sleep?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sleepTimeOptions.map((option) => (
              <div key={option.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleSleepTimeSelect(option.id)}
                  className={`h-14 w-full px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                    ${formData.sleepTime === option.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                    }`}
                >
                  <span className="font-semibold">{option.label}</span>
                </button>
                <span className="text-xs text-gray-500 mt-2">{option.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What time do you typically wake up?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wakeTimeOptions.map((option) => (
              <div key={option.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleWakeTimeSelect(option.id)}
                  className={`h-14 w-full px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                    ${formData.wakeTime === option.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                    }`}
                >
                  <span className="font-semibold">{option.label}</span>
                </button>
                <span className="text-xs text-gray-500 mt-2">{option.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate your cleanliness?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cleanlinessOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleCleanlinessSelect(option.id)}
                className={`h-14 px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                  ${formData.cleanliness === option.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                  }`}
              >
                <span className="font-semibold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How do you feel about visitors in your room?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {visitorOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleVisitorSelect(option.id)}
                className={`h-14 w-full px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                  ${formData.visitors === option.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                  }`}
              >
                <span className="font-semibold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What is your preference regarding smoking?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {smokingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSmokingSelect(option.id)}
                className={`h-14 w-full px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                  ${formData.smoking === option.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                  }`}
              >
                <span className="font-semibold">{option.label}</span>
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
  )

  const renderLifestyleActivities = () => (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Lifestyle & Activities</h2>
      <p className="text-gray-600 mb-6">Share more about your lifestyle and personal interests.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you describe your study habits?
          </label>
          <div className="flex flex-nowrap gap-4">
            {studyHabitOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleStudyHabitSelect(option.id)}
                className={`h-14 px-6 rounded-full text-sm font-medium transition-colors flex-1 flex items-center justify-center
                  ${formData.studyHabits === option.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                  }`}
              >
                <span className="font-semibold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How do you feel about music in the room?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {musicPreferenceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleMusicPreferenceSelect(option.id)}
                className={`h-14 px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center
                  ${formData.musicPreference === option.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                  }`}
              >
                <span className="font-semibold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              What are your hobbies or interests?
            </label>
            <button
              type="button"
              onClick={() => setShowHobbyIdeas(true)}
              className="text-primary-600 text-sm hover:text-primary-700 font-medium"
            >
              Need ideas?
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {formData.hobbies.map((hobby, index) => (
              <div
                key={index}
                className="h-14 px-6 rounded-full text-sm font-medium transition-colors inline-flex items-center justify-center bg-primary-600 text-white"
              >
                <span className="font-semibold">{hobby}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHobby(hobby)}
                  className="ml-3 text-white hover:text-gray-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="min-h-[42px] w-full px-4 py-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent bg-white">
            <input
              type="text"
              value={hobbySearch}
              onChange={(e) => {
                setHobbySearch(e.target.value)
                setShowHobbyDropdown(true)
              }}
              onFocus={() => setShowHobbyDropdown(true)}
              placeholder="Type to add your hobbies"
              className="w-full outline-none text-gray-700"
            />
          </div>
          {showHobbyDropdown && hobbySearch.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredHobbies.length > 0 ? (
                filteredHobbies.map((hobby, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleHobbySelect(hobby)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    {hobby}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No matching hobbies found</div>
              )}
            </div>
          )}
        </div>

        {showHobbyIdeas && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Hobby Ideas</h3>
                <button
                  type="button"
                  onClick={() => setShowHobbyIdeas(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sports & Fitness</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Basketball</li>
                    <li>Soccer</li>
                    <li>Tennis</li>
                    <li>Swimming</li>
                    <li>Yoga</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Arts & Creative</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Painting</li>
                    <li>Photography</li>
                    <li>Writing</li>
                    <li>Music</li>
                    <li>Drawing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Technology</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Programming</li>
                    <li>Gaming</li>
                    <li>3D Modeling</li>
                    <li>Web Design</li>
                    <li>Robotics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Social & Entertainment</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Movies & TV</li>
                    <li>Board Games</li>
                    <li>Reading</li>
                    <li>Cooking</li>
                    <li>Travel</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowHobbyIdeas(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Anything else potential roommates should know about you?
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            placeholder="Share any additional information that might help find your ideal roommate match..."
          />
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
            Submit
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center text-primary-600 mb-2">RoomNet</h1>
      <p className="text-center text-gray-600 mb-8">Help us find your perfect roommate match by completing this quiz.</p>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
      </div>
      <div className="text-right text-sm text-gray-500 mb-8">Step {currentStep} of 3</div>

      {currentStep === 1 && renderBasicInfo()}
      {currentStep === 2 && renderLivingPreferences()}
      {currentStep === 3 && renderLifestyleActivities()}
    </div>
  )
}

export default Quiz 