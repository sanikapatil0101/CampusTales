import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm 
                     flex items-center justify-between px-6 py-4
                     transition-all duration-300">
      
      {/* Left Section: Hamburger Menu + Title */}
      <div className="flex items-center gap-5">

        {/* Subtle Themed Title */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                      transition-all duration-300">
          CampusTales
        </h1>
      </div>

      {/* Right Section: Subtle Logout Button */}
      <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-700 
                     bg-red-50 border border-red-300 rounded-xl shadow-sm
                     transition-all duration-300 ease-out
                     hover:bg-red-100 hover:-translate-y-0.5 hover:shadow-md
                     hover:border-red-400
                     active:scale-95 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
               className="w-5 h-5 transition-transform duration-300 group-hover:scale-105">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span className="transition-transform duration-300 group-hover:scale-105">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;