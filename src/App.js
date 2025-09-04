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
    // أولاً تحقق من localStorage
    let token = localStorage.getItem('token');
    let role = localStorage.getItem('userRole');
    let name = localStorage.getItem('userName');

    // إذا لم يوجد في localStorage، تحقق من sessionStorage
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

  return (
    <div className="App">
      {isAuthenticated && (
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">EventX</h1>
            
            <div className="nav-items">
              <span className="nav-welcome">Welcome, {userName}</span>
              <span className="user-role">{userRole}</span>
              
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

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
