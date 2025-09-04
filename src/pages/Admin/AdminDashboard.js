import React, { useState } from 'react';
import EventList from '../../components/admin/EventList';
import CreateEventForm from '../../components/admin/CreateEventForm';
import Dashboard from '../../components/admin/Dashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshEvents, setRefreshEvents] = useState(false);

  const handleEventCreated = () => {
    setRefreshEvents(prev => !prev);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return (
          <>
            <CreateEventForm onEventCreated={handleEventCreated} />
            <EventList key={refreshEvents} />
          </>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your events and view analytics</p>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-lg mb-6">
          <nav className="flex space-x-4 p-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'events'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🎫 Manage Events
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-500 cursor-not-allowed`}
              title=""
              disabled
            >
              📈 Reports ()
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {renderContent()}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-400">📊</div>
            <h3 className="font-semibold text-white">Analytics</h3>
            <p className="text-gray-300 text-sm">Real-time event insights</p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-green-400">🎫</div>
            <h3 className="font-semibold text-white">Management</h3>
            <p className="text-gray-300 text-sm">Full event control</p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-purple-400">📈</div>
            <h3 className="font-semibold text-white">Reports</h3>
            <p className="text-gray-300 text-sm">Exportable data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
