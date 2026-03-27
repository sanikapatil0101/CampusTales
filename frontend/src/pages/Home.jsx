import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const primaryButtonClasses = `
    flex items-center justify-center gap-3
    px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
    font-semibold rounded-xl shadow-lg
    transform transition-all duration-300 ease-out
    hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 
    hover:shadow-xl hover:scale-[1.02]
    active:scale-95 border border-blue-400/30
  `

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 overflow-hidden">
      
      {/* Subtle background blobs */}
      <div 
        className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-200 rounded-full 
                   opacity-40 blur-3xl filter animate-pulse"
      />
      <div 
        className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-200 rounded-full 
                   opacity-40 blur-3xl filter animate-pulse"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center text-center">
        
        {/* Subtle title hover */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 
                      transform transition-transform duration-300 hover:scale-[1.01]">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 
                                    hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            CampusTales
          </span>!
        </h1>
        
        {/* Subtle description hover */}
        <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed
                     transition-all duration-300 hover:text-gray-700">
          Share and discover interview experiences, preparation tips, and career
          journeys from students just like you.
        </p>

        {/* Button Container */}
        <div className="flex flex-col sm:flex-row gap-6 transition-all duration-300">
          
          {/* Register Button */}
          <button 
            onClick={() => navigate('/register')} 
            className={primaryButtonClasses}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                 className="w-6 h-6 transform transition-transform duration-300 group-hover:scale-105">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21c-2.305 0-4.47-.612-6.374-1.666z" />
            </svg>
            <span className="transform transition-transform duration-300 group-hover:scale-105">
              Get Started
            </span>
          </button>

          {/* Login Button */}
          <button 
            onClick={() => navigate('/login')} 
            className={`
              flex items-center justify-center gap-3
              px-8 py-4 bg-white text-gray-800 border border-gray-300
              font-semibold rounded-xl shadow-lg
              transform transition-all duration-300 ease-out
              hover:bg-gray-50 hover:-translate-y-0.5 
              hover:shadow-xl hover:scale-[1.02] hover:border-gray-400
              active:scale-95
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                 className="w-6 h-6 transform transition-transform duration-300 group-hover:scale-105">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            <span className="transform transition-transform duration-300 group-hover:scale-105">
              Sign In
            </span>
          </button>
        </div>

        {/* Subtle decorative element */}
        <div className="mt-16 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                       transform transition-all duration-500 hover:w-28">
        </div>
      </main>
    </div>
  )
}

export default Home