import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You are not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.get('/analytics/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      if (err.response && err.response.status === 403) {
        setError('Access forbidden: You do not have permission to view this dashboard.');
      } else {
        setError('Failed to fetch dashboard data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading dashboard...</div>;

  if (error) return (
    <div className="text-center p-6 text-red-600">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
