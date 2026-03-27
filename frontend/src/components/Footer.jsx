const Footer = () => {
  const year = new Date().getFullYear()
  
  return (
    <footer className="w-full p-6 bg-gradient-to-r from-gray-50 to-gray-100 text-center 
                     text-gray-600 text-sm border-t border-gray-200 mt-auto
                     transition-all duration-300 ease-in-out">
      <div className="transition-all duration-300">
        &copy; {year} <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CampusTales
        </span>. All rights reserved.
      </div>
      
      {/* Subtle decorative element */}
      <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                     mx-auto transition-all duration-300">
      </div>
    </footer>
  )
}

export default Footer