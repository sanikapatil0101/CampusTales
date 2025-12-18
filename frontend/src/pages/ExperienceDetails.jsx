import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import config from "../../config";
const API = config.BASE_URL;

// --- InfoTag Component ---
const InfoTag = ({ label, value }) => (
  <span className="inline-block bg-blue-50 text-blue-800 text-sm font-medium px-4 py-2 rounded-full
                   transition-all duration-300 hover:bg-blue-100">
    <strong>{label}:</strong> {value || 'N/A'}
  </span>
);

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();

  const fetchExperience = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExperience(response.data);
    } catch (err) {
      console.error("Failed to fetch experience:", err);
      if (err.response && err.response.status === 404) {
        alert("Experience not found.");
        navigate('/dashboard');
      }
    }
  }, [id, token, navigate]);

  useEffect(() => {
    // If navigator passed the post in location.state (e.g., from Profile), use it immediately
    if (location?.state?.post) {
      setExperience(location.state.post);
      // still try to fetch fresh copy in background
      fetchExperience();
      return;
    }

    fetchExperience();
  }, [fetchExperience]);

  // --- Loading State ---
  if (!experience) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
        <div className="flex-1 flex flex-col transition-all duration-300 ">
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-gray-600 text-xl font-medium">
              Loading experience details...
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ">
      

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12
                         transition-all duration-300 ease-out">
            
            {/* --- Company Header --- */}
            <div className="text-center mb-8 break-words">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight
                            transform transition-all duration-300">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {experience.companyName}
                </span>
              </h1>
              <p className="text-lg text-gray-600 mt-2 transition-all duration-300 hover:text-gray-700">
                Shared by <span className="font-semibold text-blue-600">{experience.student?.name || 'N/A'}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1 transition-all duration-300 hover:text-gray-600">
                Uploaded on {new Date(experience.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* --- Info Tags --- */}
            <div className="flex flex-wrap justify-center gap-3 border-y border-gray-200 py-6 my-8">
              <InfoTag label="Branch" value={experience.branch} />
              <InfoTag label="Year" value={experience.year} />
              <InfoTag label="Passout" value={experience.passoutYear} />
              <InfoTag label="Type" value={experience.type} />
              <InfoTag label="Placement" value={experience.placementType} />
            </div>

            {/* --- Experience Content --- */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4
                            transform transition-all duration-300">
                Experience Details
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-800 
                            whitespace-pre-line leading-relaxed break-words overflow-hidden
                            transition-all duration-300 hover:bg-gray-100">
                {experience.experienceText}
              </div>
            </div>

            {/* --- Questions & Answers Section --- */}
            {experience.questions && experience.questions.length > 0 && (
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6
                              transform transition-all duration-300">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Interview & Aptitude Q&A
                  </span>
                </h2>
                
                <div className="space-y-6">
                  {experience.questions.map((qa, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6
                                             transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        <span className="text-purple-600">Q{index + 1}:</span> {qa.question}
                      </h3>
                      <div className="bg-white border border-blue-100 rounded-lg p-5 text-gray-800 
                                    whitespace-pre-line leading-relaxed break-words">
                        <p className="text-gray-700">{qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Additional Notes Section --- */}
            {experience.additionalNotes && (
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4
                              transform transition-all duration-300">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Additional Notes & Insights
                  </span>
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-gray-800 
                            whitespace-pre-line leading-relaxed break-words
                            transition-all duration-300 hover:bg-green-100">
                  {experience.additionalNotes}
                </div>
              </div>
            )}

            {/* --- Back Button --- */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center justify-center gap-2
                           px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg 
                           border border-gray-300 shadow-lg
                           transition-all duration-300 ease-out
                           hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl
                           hover:border-gray-400
                           active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                     className="w-5 h-5 transition-transform duration-300 group-hover:scale-105">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="transition-transform duration-300 group-hover:scale-105">
                  Go Back
                </span>
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ExperienceDetails;