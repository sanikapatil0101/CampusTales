import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import config from "../../config";
const API = config.BASE_URL;

//  Icons 
const IconApprove = () => <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IconReject = () => <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
const IconDashboard = () => <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>

//  Helper Components 
const InfoTag = ({ label, value }) => (
  <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full
                   transition-all duration-300 hover:bg-gray-200">
    <strong>{label}:</strong> {value || 'N/A'}
  </span>
);

const StatusBadge = ({ status }) => {
  const styles = {
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`inline-block text-sm font-bold uppercase px-4 py-1.5 rounded-full ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const AdminExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // sidebar removed: no local sidebar state needed
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const token = localStorage.getItem("token");

  // toggleSidebar removed

  const fetchExperience = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/admin/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExperience(res.data);
    } catch (err) {
      console.error("Error fetching experience:", err);
      alert("Failed to fetch experience details.");
      navigate("/admin-dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, token, navigate]);

  const handleUpdate = async (action) => {
    const url =
      action === "approve"
        ? `${API}/api/admin/experience/approve/${id}`
        : `${API}/api/admin/experience/reject/${id}`;
    
    setIsUpdating(true);
    try {
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Experience ${action}d!`);
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} experience.`);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  if (loading || !experience) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
        <div className="flex-1 flex flex-col transition-all duration-300">

          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-gray-600 text-xl font-medium">
              Loading...
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">


        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12
                         transition-all duration-300 ease-out">
            
            {/* Company Header & Status */}
            <div className="text-center mb-8 break-words">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight
                            transform transition-all duration-300">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {experience.companyName}
                </span>
              </h1>
              <StatusBadge status={experience.status} />
            </div>

            {/* Info Tags */}
            <div className="flex flex-wrap justify-center gap-3 border-y border-gray-200 py-6 my-8">
              <InfoTag label="Student" value={experience.student?.name} />
              <InfoTag label="Email" value={experience.student?.email} />
              <InfoTag label="Branch" value={experience.branch} />
              <InfoTag label="Year" value={experience.year} />
              <InfoTag label="Passout" value={experience.passoutYear} />
              <InfoTag label="Type" value={experience.type} />
              <InfoTag label="Placement" value={experience.placementType} />
            </div>

            {/* Experience Content */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4
                            transform transition-all duration-300">
                Experience Details
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-800 
                            whitespace-pre-line leading-relaxed break-words overflow-hidden
                            transition-all duration-300 hover:bg-gray-100">
                {experience.experienceText || "No description provided"}
              </div>
            </div>

            {/* Interview Questions & Answers */}
            {experience.questions && experience.questions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4
                              transform transition-all duration-300">
                  Interview Questions & Answers
                </h2>
                <div className="space-y-4">
                  {experience.questions.map((q, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6
                                              transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        Q{index + 1}: {q.question}
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-800
                                    whitespace-pre-line leading-relaxed break-words">
                        {q.answer || "No answer provided"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Additional Notes --- */}
            {experience.additionalNotes && experience.additionalNotes.trim() !== "" && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4
                              transform transition-all duration-300">
                  Additional Notes & Insights
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-gray-800 
                              whitespace-pre-line leading-relaxed break-words overflow-hidden
                              transition-all duration-300 hover:bg-green-100">
                  {experience.additionalNotes}
                </div>
              </div>
            )}
            

            {/* Approve / Reject Buttons */}
            {(experience.status !== 'approved' || experience.status !== 'rejected') && (
              <div className="flex justify-center gap-4 mt-10 border-t border-gray-200 pt-8">
                {experience.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdate("approve")}
                    disabled={isUpdating}
                    className="group flex items-center justify-center gap-2 w-full sm:w-auto
                               px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white 
                               font-semibold rounded-lg shadow-lg
                               transition-all duration-300 ease-out
                               hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 
                               hover:shadow-xl
                               active:scale-95
                               disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <IconApprove />
                    <span className="transition-transform duration-300 group-hover:scale-105">
                      {isUpdating ? "Approving..." : "Approve"}
                    </span>
                  </button>
                )}

                {experience.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdate("reject")}
                    disabled={isUpdating}
                    className="group flex items-center justify-center gap-2 w-full sm:w-auto
                               px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white 
                               font-semibold rounded-lg shadow-lg
                               transition-all duration-300 ease-out
                               hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5 
                               hover:shadow-xl
                               active:scale-95
                               disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <IconReject />
                    <span className="transition-transform duration-300 group-hover:scale-105">
                      {isUpdating ? "Rejecting..." : "Reject"}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Go to Dashboard Button */}
            <div className={`flex justify-center ${experience.status === 'pending' ? 'mt-6' : 'mt-10 border-t border-gray-200 pt-8'}`}>
              <button
                onClick={() => navigate("/admin-dashboard")}
                disabled={isUpdating}
                className="group flex items-center justify-center gap-2
                           px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg 
                           border border-gray-300 shadow-lg
                           transition-all duration-300 ease-out
                           hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl
                           hover:border-gray-400
                           active:scale-95"
              >
                <IconDashboard />
                <span className="transition-transform duration-300 group-hover:scale-105">
                  Back to Dashboard
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

export default AdminExperienceDetails;