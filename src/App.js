import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EventsPage from './pages/Events/EventsPage';
import EventDetailPage from './pages/Events/EventDetailPage';
import BookingPage from './pages/Booking/BookingPage';
import MyTickets from './pages/Tickets/MyTickets';
import Login from './components/Login';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          
          {/* Protected Routes - require authentication */}
          <Route 
            path="/booking/:id" 
            element={
              isAuthenticated 
                ? <BookingPage /> 
                : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/my-tickets" 
            element={
              isAuthenticated 
                ? <MyTickets /> 
                : <Navigate to="/login" />
            } 
          />
          
          {/* Protected Admin Routes - require admin role */}
          <Route 
            path="/admin/*" 
            element={
              isAuthenticated && userRole === 'admin' 
                ? <AdminDashboard /> 
                : <Navigate to="/login" />
            } 
          />
          
          {/* Default Redirect */}
          <Route 
            path="/" 
            element={
              <Navigate to={
                isAuthenticated 
                  ? (userRole === 'admin' ? "/admin" : "/events") 
                  : "/login"
              } />
            } 
          />
          
          {/* Catch all route - 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;