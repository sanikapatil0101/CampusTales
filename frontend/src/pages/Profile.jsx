import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import config from "../../config";
const API = config.BASE_URL;

// Icons for Stat Cards
// const IconTotal = () => <svg className="w-8 h-8 text-blue-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5m-4.5-12.75V16.5m-4.5-12.75V16.5m0 4.5h13.5M3.75 7.5h13.5m-13.5 4.5h13.5m0 4.5h-13.5" /></svg>
// const IconApproved = () => <svg className="w-8 h-8 text-green-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// const IconPending = () => <svg className="w-8 h-8 text-yellow-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// const IconRejected = () => <svg className="w-8 h-8 text-red-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
const IconDashboard = () => <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>

// Logout Icon
const IconLogout = () => (
  <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105"
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
  </svg>
);

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <div className="group bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 
                  transition-all duration-300 ease-out
                  hover:shadow-xl
                  border border-gray-100">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">
        {value}
      </div>
      <div className="text-sm font-medium text-gray-600 transition-all duration-300 group-hover:text-gray-800">
        {title}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);

      const headers = { Authorization: `Bearer ${token}` };

      const profilePromise = axios.get(`${API}/api/auth/me`, { headers });
      const postsPromise = axios.get(`${API}/api/experience/me`, { headers });

      const [profileResponse, postsResponse] = await Promise.all([profilePromise, postsPromise]);

      setUser(profileResponse.data);

  const allPosts = Array.isArray(postsResponse.data) ? postsResponse.data : [];
  // show all statuses (approved / pending / rejected)
  setMyPosts(allPosts);
      setAnalytics({
        total: allPosts.length,
        approved: allPosts.filter(p => p.status === 'approved').length,
        pending: allPosts.filter(p => p.status === 'pending').length,
        rejected: allPosts.filter(p => p.status === 'rejected').length,
      });

    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return { badge: "bg-green-100 text-green-800", footer: "bg-green-50 border-t border-green-200" };
      case "rejected":
        return { badge: "bg-red-100 text-red-800", footer: "bg-red-50 border-t border-red-200" };
      default:
        return { badge: "bg-yellow-100 text-yellow-800", footer: "bg-yellow-50 border-t border-yellow-200" };
    }
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="flex-1 flex flex-col transition-all duration-300">

        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
            <h2 className="text-4xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </span>
            </h2>

            {/* Top-right Logout (matches Header style) */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
                </svg>
                <span className="transition-transform duration-300 group-hover:scale-105">Logout</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-600 font-medium text-xl">Loading...</div>
            ) : !user ? (
              <div className="text-center text-red-600 font-medium text-xl">Could not load profile.</div>
            ) : (
              <div className="space-y-8">

                {/* User Info */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{user.email}</p>
                  <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 
                                 text-sm font-semibold px-5 py-2 rounded-full uppercase">
                    {user.role}
                  </span>
                </div>

                {/* My Posts (replaces Analytics) */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h3>
                  {myPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center 
                                  text-center bg-white shadow-xl rounded-2xl p-12 
                                  border border-gray-200">
                      <svg className="w-16 h-16 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 0H6.625A2.25 2.25 0 004.5 4.875v11.25a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 16.125v-1.5" /></svg>
                      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">No Posts Found</h2>
                      <p className="text-gray-500 max-w-md leading-relaxed">
                        You don't have any posts yet. Create one from the Dashboard.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myPosts.map(post => (
                        <div
                          key={post._id}
                          onClick={() => navigate(`/experience/${post._id}`, { state: { post } })}
                          className="group bg-white rounded-2xl shadow-lg overflow-hidden 
                                     transition-all duration-300 ease-out
                                     hover:shadow-xl
                                     cursor-pointer border border-gray-100 hover:border-gray-200"
                        >
                          <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 border-b-2 border-blue-200">
                            <div className="relative">
                              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-300 rounded-full opacity-20"></div>
                              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-300 rounded-full opacity-20"></div>
                              <div className="relative">
                                <h3 className="text-2xl font-bold text-gray-900 truncate mb-1 bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                                  {post.companyName || "N/A"}
                                </h3>
                                {/* status badge top-right */}
                                <div className="absolute top-4 right-4">
                                  <span className={`inline-block text-xs font-semibold uppercase px-3 py-1 rounded-full ${getStatusStyles(post.status).badge}`}>
                                    {post.status || "pending"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                            <div className="p-5 space-y-3">
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                  {post.branch || "N/A"}
                                </span>
                                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                  Passout: <strong>{post.passoutYear || "N/A"}</strong>
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                                  {post.type || "N/A"}
                                </span>
                                <span className={`inline-block px-3 py-1 rounded-full font-medium ${getStatusStyles(post.status).badge}`}>
                                  Status: <strong className="capitalize">{post.status || 'pending'}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="p-5 bg-gray-50 border-t border-gray-200 transition-all duration-300 group-hover:bg-gray-100">
                              <p className="text-xs text-gray-500">
                                Uploaded: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                              </p>
                            </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* **BUTTON AREA (FIXED)** */}
          {!loading && (
            <div className="flex flex-col items-center gap-4 pt-8 mt-6 border-t border-gray-200 flex-shrink-0">

              {/* DASHBOARD BUTTON */}
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center justify-center gap-3
                           px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl 
                           border border-gray-300 shadow-lg
                           transition-all duration-300 ease-out
                           hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-xl
                           hover:border-gray-400 active:scale-95"
              >
                <IconDashboard />
                <span className="transition-transform duration-300 group-hover:scale-105">
                  Back to Dashboard
                </span>
              </button>

              {/* Logout moved to top-right */}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Profile;