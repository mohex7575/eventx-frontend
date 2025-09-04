import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EventsPage from './pages/Events/EventsPage';
import EventDetailPage from './pages/Events/EventDetailPage';
import BookingPage from './pages/Booking/BookingPage';
import MyTickets from './pages/Tickets/MyTickets';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    let token = localStorage.getItem('token');
    let role = localStorage.getItem('userRole');
    let name = localStorage.getItem('userName');

    if (!token) {
      token = sessionStorage.getItem('token');
      role = sessionStorage.getItem('userRole');
      name = sessionStorage.getItem('userName');
    }

    setIsAuthenticated(!!token);
    setUserRole(role || '');
    setUserName(name || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    checkAuth();
    window.location.href = '/login';
  };

  // ---------------- Navbar Component ----------------
  const Navbar = () => (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-purple-500">
              Event<span className="text-blue-400">X</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-200 font-medium">
              Welcome, <span className="text-white">{userName}</span>
            </span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {userRole.toUpperCase()}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
  // --------------------------------------------------

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login onLogin={checkAuth} />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        
        <Route 
          path="/booking/:id" 
          element={isAuthenticated ? <BookingPage /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/my-tickets" 
          element={isAuthenticated ? <MyTickets /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/admin/*" 
          element={
            isAuthenticated && userRole === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/login" />
          } 
        />
        
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? (userRole === 'admin' ? "/admin" : "/events") : "/login"} />
          } 
        />
        
        <Route 
          path="*" 
          element={
            <div className="error-page">
              <div className="error-content">
                <h1 className="error-title">404</h1>
                <p className="error-message">Page not found</p>
                <button 
                  onClick={() => window.history.back()}
                  className="back-btn"
                >
                  Go Back
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
