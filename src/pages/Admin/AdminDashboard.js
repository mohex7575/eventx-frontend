import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [latestTickets, setLatestTickets] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login as admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOverview(response.data.overview);
      setLatestTickets(response.data.latestTickets || []);
      setTopEvents(response.data.topEvents || []);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative min-h-screen flex items-start justify-center">
      {/* خلفية */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1920&q=80"
          alt="Admin Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      </div>

      {/* المحتوى */}
      <div className="relative z-10 w-full max-w-6xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-400 mb-10">
          Admin <span className="text-blue-400">Dashboard</span>
        </h1>

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-gray-400">Total Events</h2>
            <p className="text-2xl font-bold text-white">{overview.totalEvents}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-gray-400">Total Tickets</h2>
            <p className="text-2xl font-bold text-white">{overview.totalTickets}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-gray-400">Total Revenue</h2>
            <p className="text-2xl font-bold text-green-400">${overview.totalRevenue}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-gray-400">Total Users</h2>
            <p className="text-2xl font-bold text-white">{overview.totalUsers}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-gray-400">Active Events</h2>
            <p className="text-2xl font-bold text-purple-400">{overview.activeEvents}</p>
          </div>
        </div>

        {/* الجداول */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* آخر التذاكر */}
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <h2 className="text-xl font-bold text-purple-400 px-6 py-4 border-b border-gray-700">
              🎟️ Latest Tickets
            </h2>
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-800/80 text-gray-400">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {latestTickets.length > 0 ? (
                  latestTickets.map((ticket, index) => (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td className="px-6 py-3">{ticket.userName}</td>
                      <td className="px-6 py-3">{ticket.eventTitle}</td>
                      <td className="px-6 py-3">{new Date(ticket.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* أفضل الأحداث */}
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <h2 className="text-xl font-bold text-blue-400 px-6 py-4 border-b border-gray-700">
              ⭐ Top Events
            </h2>
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-800/80 text-gray-400">
                <tr>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Tickets Sold</th>
                  <th className="px-6 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topEvents.length > 0 ? (
                  topEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td className="px-6 py-3">{event.title}</td>
                      <td className="px-6 py-3">{event.ticketsSold}</td>
                      <td className="px-6 py-3 text-green-400">${event.revenue}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
