import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // أزل BrowserRouter من هنا
import AdminDashboard from './pages/Admin/AdminDashboard';
import EventsPage from './pages/Events/EventsPage';
import EventDetailPage from './pages/Events/EventDetailPage';
import BookingPage from './pages/Booking/BookingPage';
import MyTickets from './pages/Tickets/MyTickets';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const navigate = useNavigate(); // أضف useNavigate هنا

  // تتبع تغييرات authentication
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setUserRole(localStorage.getItem('userRole'));
      setUserName(localStorage.getItem('userName'));
    };

    // تحقق كلما حدث تغيير في localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    // استمع لتغييرات localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // تحقق أيضاً عند تحميل المكون
    checkAuth();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // function لتحديث state عند Login/Logout
  const updateAuthStatus = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    updateAuthStatus();
    navigate('/login'); // استخدم navigate بدلاً من window.location.href
    window.location.reload(); // أضف هذا لتحديث الصفحة بالكامل
  };

  return (
    <div className="App">
      {/* شريط التنقل مع زر Logout */}
      {isAuthenticated && (
        <header className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">EventX Studio</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userName || 'User'}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm capitalize">
                {userRole}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={updateAuthStatus} />} />
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
  );
}

export default App;