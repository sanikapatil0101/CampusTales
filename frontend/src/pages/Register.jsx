import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthCard from '../components/AuthCard'
import config from "../../config";
const API = config.BASE_URL;

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value })

 const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setMessage('')
  setLoading(true)

  //  Basic frontend validation
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError("Please enter a valid email address")
    setLoading(false)
    return
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters long")
    setLoading(false)
    return
  }

  try {
    const response = await axios.post(`${API}/api/auth/register`, formData)
    localStorage.setItem('token', response.data.token)
    setMessage('Registration successful! Redirecting...')
    setTimeout(() => navigate('/dashboard'), 1000)
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message)
    } else {
      setError(err.message || 'Registration failed. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}

  // Enhanced input field styles
  const inputContainerClass = "relative mb-6"
  const inputClass = `
    w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl 
    text-gray-900 placeholder-gray-500 bg-white
    focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500
    transition-all duration-300 shadow-sm
    hover:border-gray-400 hover:shadow-md
  `
  const inputIconClass = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"

  // Enhanced button style
  const buttonClass = `
    flex items-center justify-center w-full gap-3
    px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
    font-semibold rounded-xl shadow-lg
    transform transition-all duration-300 ease-out
    hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 
    hover:shadow-xl hover:scale-[1.02]
    active:scale-95 border border-blue-400/30
    disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
  `

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 overflow-hidden">
      
      {/* Enhanced decorative background blobs */}
      <div 
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-200 rounded-full 
                   opacity-40 blur-3xl filter animate-pulse"
      />
      <div 
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-200 rounded-full 
                   opacity-40 blur-3xl filter animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      
      <AuthCard title="Join CampusTales">
        
        {/* Enhanced styled messages */}
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-center text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="border border-green-200 bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-center text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Enhanced name input group */}
          <div className={inputContainerClass}>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <svg className={inputIconClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <input
              type="text"
              id="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Enhanced email input group */}
          <div className={inputContainerClass}>
            <label htmlFor="email" className="sr-only">Email</label>
            <svg className={inputIconClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <input
              type="email"
              id="email"
              placeholder="you@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Enhanced password input group */}
          <div className={inputContainerClass}>
            <label htmlFor="password" className="sr-only">Password</label>
            <svg className={inputIconClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Enhanced register button */}
          <button
            type="submit"
            className={buttonClass}
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                 className={`w-6 h-6 transform transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:scale-105'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21c-2.305 0-4.47-.612-6.374-1.666z" />
            </svg>
            <span className="transform transition-transform duration-300 group-hover:scale-105">
              {loading ? "Creating Account..." : "Get Started"}
            </span>
          </button>

          {/* Enhanced footer text */}
          <div className="text-center text-sm text-gray-600 mt-8 pt-6 border-t border-gray-200">
            <p className="mb-2">Already have an account?</p>
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold 
                                      transition-all duration-300 hover:underline inline-block">
              Sign in to your account
            </a>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}

export default Register