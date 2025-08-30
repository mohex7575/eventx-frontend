import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = useCallback(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, categoryFilter]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleBookNow = (eventId, e) => {
    e.stopPropagation();
    navigate(`/booking/${eventId}`);
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error">
        <p>{error}</p>
        <button onClick={fetchEvents} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <p>Discover amazing events happening around you</p>
      </div>

      {/* Search and Filter Section */}
      <div className="events-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="networking">Networking</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events found matching your criteria</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="event-card"
              onClick={() => handleEventClick(event._id)}
            >
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.name} />
                ) : (
                  <div className="event-image-placeholder">
                    {event.name.charAt(0)}
                  </div>
                )}
                <div className="event-category">{event.category}</div>
              </div>

              <div className="event-content">
                <h3 className="event-name">{event.name}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="event-detail">
                    <span className="detail-icon">📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">⏰</span>
                    <span>{new Date(event.date).toLocaleTimeString()}</span>
                  </div>
                  <div className="event-detail">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="event-footer">
                  <div className="event-capacity">
                    <span className="capacity-text">
                      {event.registeredUsers?.length || 0}/{event.capacity} seats booked
                    </span>
                    <div className="capacity-bar">
                      <div 
                        className="capacity-progress"
                        style={{
                          width: `${((event.registeredUsers?.length || 0) / event.capacity) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="event-actions">
                    <span className="event-price">
                      {event.price > 0 ? `$${event.price}` : 'Free'}
                    </span>
                    <button
                      onClick={(e) => handleBookNow(event._id, e)}
                      disabled={event.registeredUsers?.length >= event.capacity}
                      className="book-btn"
                    >
                      {event.registeredUsers?.length >= event.capacity ? 'Sold Out' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;