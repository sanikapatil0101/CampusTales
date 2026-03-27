const AuthCard = ({ title, children }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md
                   transform transition-all duration-300 ease-out
                   hover:shadow-2xl hover:-translate-y-0.5 border border-gray-100">
      
      {/* Enhanced Themed Title with gradient */}
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8
                    transform transition-all duration-300 hover:scale-[1.01]">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                        hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          {title}
        </span>
      </h2>
      
      {/* Children container with smooth transitions */}
      <div className="transform transition-all duration-300">
        {children}
      </div>
    </div>
  )
}

export default AuthCard