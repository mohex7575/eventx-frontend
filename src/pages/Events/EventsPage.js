import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/events');
      // Sort events by date descending (latest first)
      const sortedEvents = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sortedEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="events-page">
      {/* User Account Section */}
      <div className="user-account-card">
        <h2>👤 Your Account</h2>
        <p>Welcome, {localStorage.getItem('userName')}</p>
        <p>Role: {localStorage.getItem('userRole')}</p>
        <button onClick={() => navigate('/my-tickets')} className="view-tickets-btn">
          View My Tickets
        </button>
      </div>

      {/* Search Section */}
      <div className="search-box-container">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Latest Events */}
      <div className="latest-events">
        <h2>Latest Events</h2>

        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={event._id} className="event-card" onClick={() => handleEventClick(event._id)}>
                <div className="event-image">
                  {event.image ? (
                    <img src={event.image} alt={event.title} />
                  ) : (
                    <div className="event-placeholder">🎉</div>
                  )}
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                  <p>{event.price > 0 ? `$${event.price}` : 'Free'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
