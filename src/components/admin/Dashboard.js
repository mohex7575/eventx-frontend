import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in as an admin to access the dashboard.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await api.get('/analytics/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDashboardData(response.data);
      } catch (err) {
        if (err.response) {
          // خطأ من السيرفر
          if (err.response.status === 403) {
            setError('Access denied: You do not have permission to view this dashboard.');
          } else {
            setError(`Server error: ${err.response.status} ${err.response.statusText}`);
          }
        } else {
          // خطأ آخر (مثل network)
          setError(`Error fetching dashboard data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(dashboardData, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
