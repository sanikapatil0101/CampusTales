import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Sidebar/Header not used in this view (sidebar removed from UI)
import Footer from "../components/Footer";
import config from "../../config";
const API = config.BASE_URL;

//Icons for Stat Cards 
const IconTotalUsers = () => <svg className="w-8 h-8 text-purple-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-12.728 0m12.728 0A9.094 9.094 0 015.636 18.72m12.728 0A9.094 9.094 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
const IconTotalPosts = () => <svg className="w-8 h-8 text-blue-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5m-4.5-12.75V16.5m-4.5-12.75V16.5m0 4.5h13.5M3.75 7.5h13.5m-13.5 4.5h13.5m0 4.5h-13.5" /></svg>
const IconApproved = () => <svg className="w-8 h-8 text-green-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IconPending = () => <svg className="w-8 h-8 text-yellow-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const IconRejected = () => <svg className="w-8 h-8 text-red-500 transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
const IconSearch = () => <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
const IconSliders = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 12H7.5" /></svg>
const IconNotFound = () => <svg className="w-16 h-16 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 0H6.625A2.25 2.25 0 004.5 4.875v11.25a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 16.125v-1.5" /></svg>

// --- Stat Card Component ---
const StatCard = ({ title, value, icon }) => (
  <div className="group bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4
                  transition-all duration-300 ease-out
                  hover:shadow-xl">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">
        {value || 0}
      </div>
      <div className="text-sm font-medium text-gray-600 transition-all duration-300 group-hover:text-gray-800">
        {title}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  // sidebar removed: no local sidebar state needed
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    studentName: "", companyName: "", type: "", year: "",
    branch: "", passoutYear: "", placementType: "", status: "", date: "",
  });

  const token = localStorage.getItem("token");
  // toggleSidebar removed
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const branches = [
    "Civil Engineering", "Mechanical Engineering", "Electrical", "Electronics",
    "Computer Science Engineering", "Information Technology", "Robotics", "AI/ML",
  ];
  const currentYear = new Date().getFullYear();
  const passoutYears = Array.from({ length: 15 }, (_, i) => (currentYear - 10 + i).toString());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const expPromise = axios.get(`${API}/api/admin/experience/all`, { headers });
      const analyticsPromise = axios.get(`${API}/api/admin/analytics`, { headers });

      const [expResponse, analyticsResponse] = await Promise.all([expPromise, analyticsPromise]);

      setExperiences(expResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredExperiences = experiences.filter((exp) => {
    return (
      (filter.studentName ? exp.student?.name.toLowerCase().includes(filter.studentName.toLowerCase()) : true) &&
      (filter.companyName ? exp.companyName.toLowerCase().includes(filter.companyName.toLowerCase()) : true) &&
      (filter.type ? exp.type === filter.type : true) &&
      (filter.year ? ((exp.year && exp.year === filter.year)) : true) &&
      (filter.branch ? exp.branch === filter.branch : true) &&
      (filter.passoutYear ? exp.passoutYear === filter.passoutYear : true) &&
      (filter.placementType ? exp.placementType === filter.placementType : true) &&
      (filter.status ? exp.status === filter.status : true) &&
      (filter.date ? new Date(exp.createdAt).toLocaleDateString() === new Date(filter.date).toLocaleDateString() : true)
    );
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return { footer: "bg-green-50 border-t border-green-200", text: "text-green-700" };
      case "rejected":
        return { footer: "bg-red-50 border-t border-red-200", text: "text-red-700" };
      default: 
        return { footer: "bg-yellow-50 border-t border-yellow-200", text: "text-yellow-700" };
    }
  };
  
  const inputClass = `pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400`;
  const selectClass = `px-4 py-2 w-full border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="flex-1 flex flex-col transition-all duration-300">

        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900
                          transform transition-all duration-300">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h2>

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
                <span className="transition-transform duration-300 group-hover:scale-105">Logout</span>
              </button>
            </div>
          </div>

          {/*Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
            <StatCard title="Total Users" value={analytics.totalUsers} icon={<IconTotalUsers />} />
            <StatCard title="Total Posts" value={analytics.totalExperiences} icon={<IconTotalPosts />} />
            <StatCard title="Approved" value={analytics.totalApproved} icon={<IconApproved />} />
            <StatCard title="Pending" value={analytics.totalPending} icon={<IconPending />} />
            <StatCard title="Rejected" value={analytics.totalRejected} icon={<IconRejected />} />
          </div>

          {/* Filters Section */}
          <div className="p-6 bg-white rounded-xl shadow-lg mb-6
                         transition-all duration-300 ease-out">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Name Search */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2"><IconSearch /></div>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Search by Student"
                  value={filter.studentName}
                  onChange={handleFilterChange}
                  className={inputClass}
                />
              </div>
              {/* Company Name Search */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2"><IconSearch /></div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Search by Company"
                  value={filter.companyName}
                  onChange={handleFilterChange}
                  className={inputClass}
                />
              </div>
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 
                           bg-gray-100 text-gray-700 font-medium rounded-lg shadow-sm
                           transition-all duration-300
                           hover:bg-gray-200 hover:shadow-md"
              >
                <IconSliders />
                {showFilters ? "Hide" : "Show"} All Filters
              </button>
            </div>

            {/* --- Collapsible Filter Dropdowns --- */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-200">
                <select name="type" value={filter.type} onChange={handleFilterChange} className={selectClass}>
                  <option value="">All Types</option>
                  <option value="Internship">Internship</option>
                  <option value="PPO">PPO</option>
                  <option value="Internship+Placement">Internship+Placement</option>
                </select>
                <select name="year" value={filter.year} onChange={handleFilterChange} className={selectClass}>
                  <option value="">All Years</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
                <select name="branch" value={filter.branch} onChange={handleFilterChange} className={selectClass}>
                  <option value="">All Branches</option>
                  {branches.map((b) => (<option key={b} value={b}>{b}</option>))}
                </select>
                <select name="passoutYear" value={filter.passoutYear} onChange={handleFilterChange} className={selectClass}>
                  <option value="">All Passout Years</option>
                  {passoutYears.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
                <select name="placementType" value={filter.placementType} onChange={handleFilterChange} className={selectClass}>
                  <option value="">All Placement Types</option>
                  <option value="On-Campus">On-Campus</option>
                  <option value="Off-Campus">Off-Campus</option>
                </select>
                <select name="status" value={filter.status} onChange={handleFilterChange} className={selectClass}>
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <input
                  type="date"
                  name="date"
                  value={filter.date}
                  onChange={handleFilterChange}
                  className={selectClass}
                />
              </div>
            )}
          </div>
          </div>

          {/*  Experiences List */}
          <div className="relative flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-600 font-medium text-xl">Loading posts...</div>
            ) : filteredExperiences.length === 0 ? (
              <div className="flex flex-col items-center justify-center 
                            text-center bg-white shadow-xl rounded-2xl p-10 
                            border border-gray-200">
                <IconNotFound />
                <h2 className="text-2xl font-semibold mt-4 mb-2 text-gray-800">No Posts Found</h2>
                <p className="text-gray-500">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiences.map((post) => {
                  const styles = getStatusStyles(post.status);
                  return (
                    <div
                      key={post._id}
                      onClick={() => navigate(`/admin/experience/${post._id}`)}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden 
                                 transition-all duration-300 ease-out
                                 hover:shadow-xl
                                 cursor-pointer border border-gray-100 hover:border-gray-200"
                    >
                      {/* Card Header -  Company Name Section */}
                      <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 
                                    border-b-2 border-blue-200">
                        <div className="relative">
                          {/* Decorative corner accents */}
                          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-300 rounded-full opacity-20"></div>
                          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-300 rounded-full opacity-20"></div>
                          
                          {/* Company Name with solid background */}
                          <div className="relative">
                            <h3 className="text-2xl font-bold text-gray-900 truncate mb-1 
                                         bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                              {post.companyName || "N/A"}
                            </h3>
                            
                            {/* Company Type Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 
                                          bg-blue-600/10 border border-blue-200 rounded-full">
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              <span className="text-sm font-medium text-blue-700">
                                by {post.student?.name || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Body - Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            {post.branch || "N/A"}
                          </span>
                          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            {post.type || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer - Status Badge */}
                      <div className={`p-5 ${styles.footer} transition-all duration-300 group-hover:bg-opacity-80`}>
                        <p className={`text-sm font-bold uppercase ${styles.text}`}>
                          Status: {post.status || "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;