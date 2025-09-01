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
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Overview</h2>
        <p>Total Events: {overview.totalEvents}</p>
        <p>Total Tickets: {overview.totalTickets}</p>
        <p>Total Revenue: ${overview.totalRevenue}</p>
        <p>Total Users: {overview.totalUsers}</p>
        <p>Active Events: {overview.activeEvents}</p>
      </section>

      <section>
        <h2>Top Events</h2>
        <ul>
          {topEvents.map(event => (
            <li key={event._id}>
              {event.title} - Revenue: ${event.revenue} - Tickets Sold: {event.ticketCount}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Tickets</h2>
        <ul>
          {recentTickets.map(ticket => (
            <li key={ticket._id}>
              {ticket.user.name} - {ticket.event.title} - ${ticket.price}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Monthly Revenue</h2>
        <ul>
          {monthlyRevenue.map(item => (
            <li key={item._id}>
              {item._id}: ${item.revenue} ({item.tickets} tickets)
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
