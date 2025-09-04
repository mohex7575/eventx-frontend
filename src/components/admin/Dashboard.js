import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login as admin.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOverview(response.data.overview);
      setMonthlyRevenue(response.data.monthlyRevenue);
      setTopEvents(response.data.topEvents);
      setRecentTickets(response.data.recentTickets);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 403) {
        setError('Access denied. You must be an admin to view this page.');
      } else {
        setError('Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white mt-10">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-purple-500 mb-6">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Total Events</h2>
          <p className="text-3xl font-bold">{overview.totalEvents}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-400 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Total Tickets</h2>
          <p className="text-3xl font-bold">{overview.totalTickets}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">${overview.totalRevenue}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{overview.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">Active Events</h2>
          <p className="text-3xl font-bold">{overview.activeEvents}</p>
        </div>
      </div>

      {/* Top Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Top Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topEvents.map(event => (
            <div key={event._id} className="bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>Revenue: ${event.revenue}</p>
              <p>Tickets Sold: {event.ticketCount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Recent Tickets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl shadow-md border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-600 px-4 py-2">User</th>
                <th className="border border-gray-600 px-4 py-2">Event</th>
                <th className="border border-gray-600 px-4 py-2">Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(ticket => (
                <tr key={ticket._id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">{ticket.user.name}</td>
                  <td className="border border-gray-600 px-4 py-2">{ticket.event.title}</td>
                  <td className="border border-gray-600 px-4 py-2">{ticket.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div>
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Monthly Revenue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlyRevenue.map(item => (
            <div key={item._id} className="bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition">
              <h3 className="font-semibold">{item._id}</h3>
              <p>Revenue: ${item.revenue}</p>
              <p>Tickets Sold: {item.tickets}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
